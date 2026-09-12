import type { ComponentInstance } from "../types";

// ========== 工具函数 ==========

function getStyleString(comp: ComponentInstance): string {
  const style = comp.style || {};
  const cssParts: string[] = [];
  if (style.width) cssParts.push(`width:${style.width}`);
  if (style.height) cssParts.push(`height:${style.height}`);
  if (style.paddingTop) cssParts.push(`padding-top:${style.paddingTop}px`);
  if (style.paddingRight)
    cssParts.push(`padding-right:${style.paddingRight}px`);
  if (style.paddingBottom)
    cssParts.push(`padding-bottom:${style.paddingBottom}px`);
  if (style.paddingLeft) cssParts.push(`padding-left:${style.paddingLeft}px`);
  if (style.marginTop) cssParts.push(`margin-top:${style.marginTop}px`);
  if (style.marginRight) cssParts.push(`margin-right:${style.marginRight}px`);
  if (style.marginBottom)
    cssParts.push(`margin-bottom:${style.marginBottom}px`);
  if (style.marginLeft) cssParts.push(`margin-left:${style.marginLeft}px`);
  return cssParts.join(";");
}

function getColSpans(p: Record<string, any>): number[] {
  const cols = Number(p.columns) || 2;
  const spans = p.colSpans;
  let spanArray: number[] = [];
  if (Array.isArray(spans)) spanArray = spans.map(Number);
  else if (typeof spans === "string" && spans.trim())
    spanArray = spans.split(",").map((s: string) => Number(s.trim()) || 12);
  if (spanArray.length !== cols) {
    const span = Math.floor(24 / cols);
    spanArray = Array(cols).fill(span);
    const remainder = 24 - span * cols;
    if (remainder > 0) spanArray[cols - 1] += remainder;
  }
  return spanArray;
}

// ========== 组件转 HTML（递归） ==========

function componentToHTML(comp: ComponentInstance): string {
  const p = comp.props;
  const styleStr = getStyleString(comp);

  switch (comp.type) {
    // ---------- 布局容器 ----------
    case "layout": {
      const showSidebar =
        p.showSidebar === "true" ||
        p.showSidebar === true ||
        p.showSidebar === undefined;
      const headerStyleStr = [
        `height:${p.headerHeight || "50px"}`,
        `font-size:${p.headerFontSize || 16}px`,
        `color:${p.headerColor || "#ffffff"}`,
        `background:${p.headerBgColor || "#409eff"}`,
        `padding:${p.headerPadding || "0 16px"}`,
        `font-weight:${p.headerFontWeight || "bold"}`,
        `text-align:${p.headerTextAlign || "left"}`,
        `display:flex`,
        `align-items:center`,
      ].join(";");

      const sidebarHTML = showSidebar
        ? `<div class="layout-sidebar" style="width:${
            p.sidebarWidth || "200px"
          };">
             ${renderSlot(comp.slots?.sidebar)}
           </div>`
        : "";
      return `<div class="layout" style="${styleStr}">
        <div class="layout-header" style="${headerStyleStr}">${
        renderSlot(comp.slots?.header) || p.header
      }</div>
        <div class="layout-body">
          ${sidebarHTML}
          <div class="layout-content">${
            renderSlot(comp.slots?.content) || "内容区域"
          }</div>
        </div>
        <div class="layout-footer">${
          renderSlot(comp.slots?.footer) || "底部区域"
        }</div>
      </div>`;
    }

    // ---------- 栅格容器 ----------
    case "grid": {
      const gutter = Number(p.gutter) || 0;
      const spans = getColSpans(p);
      const colAlign = p.colAlign || "top";
      const colJustify = p.colJustify || "left";
      const alignMap: Record<string, string> = {
        top: "flex-start",
        middle: "center",
        bottom: "flex-end",
      };
      const justifyMap: Record<string, string> = {
        left: "flex-start",
        center: "center",
        right: "flex-end",
      };
      const alignItems = justifyMap[colJustify] || "flex-start";
      const justifyContent = alignMap[colAlign] || "flex-start";

      // 使用负边距抵消列内边距，避免 gap 导致换行
      let gridHTML = `<div class="el-row" style="display:flex; flex-wrap:wrap; margin-left:-${
        gutter / 2
      }px; margin-right:-${gutter / 2}px; ${styleStr}">`;
      spans.forEach((span: number, index: number) => {
        const width = (span / 24) * 100;
        const colContent = renderSlot(comp.slots?.[`col_${index}`]);
        gridHTML += `<div class="el-col" style="flex:0 0 ${width}%; max-width:${width}%; box-sizing:border-box; padding-left:${
          gutter / 2
        }px; padding-right:${gutter / 2}px;">
          <div style="background:#f5f7fa; border:1px dashed #dcdfe6; border-radius:4px; padding:10px; min-height:60px; display:flex; flex-direction:column; align-items:${alignItems}; justify-content:${justifyContent};">
            ${colContent || `列 ${index + 1}`}
          </div>
        </div>`;
      });
      gridHTML += "</div>";
      return gridHTML;
    }

    // ---------- 弹窗容器（重点） ----------
    case "dialog": {
      const dialogId = "dialog-" + comp.id.replace(/[^a-zA-Z0-9]/g, "");
      const contentHTML = renderSlot(comp.slots?.content) || "<p>弹窗内容</p>";
      return `
        <div class="dialog-wrapper">
          <button class="btn btn-primary" onclick="showDialog('${dialogId}')">${p.triggerText}</button>
          <div class="dialog-mask" id="${dialogId}" style="display:none;" onclick="if(event.target===this) hideDialog('${dialogId}')">
            <div class="dialog-box">
              <div class="dialog-title">
                ${p.title}
                <span class="dialog-close" onclick="hideDialog('${dialogId}')" style="cursor:pointer; float:right;">&times;</span>
              </div>
              <div class="dialog-content">${contentHTML}</div>
            </div>
          </div>
        </div>`;
    }

    // ---------- 基础组件 ----------
    case "button":
      return `<div style="${styleStr}"><button class="btn btn-${p.type}">${p.text}</button></div>`;

    case "input": {
      const labelPosition = p.labelPosition || "left";
      if (labelPosition === "top") {
        return `<div style="${styleStr}">
          <label style="display:block; margin-bottom:4px; font-size:14px; color:#606266;">${p.label}</label>
          <input placeholder="${p.placeholder}" style="width:100%; padding:8px; border:1px solid #dcdfe6; border-radius:4px;">
        </div>`;
      }
      return `<div style="${styleStr} display:flex; align-items:center;">
        <label style="width:80px; text-align:right; margin-right:8px; font-size:14px; color:#606266; flex-shrink:0;">${p.label}</label>
        <input placeholder="${p.placeholder}" style="flex:1; padding:8px; border:1px solid #dcdfe6; border-radius:4px;">
      </div>`;
    }

    case "select": {
      const labelPosition = p.labelPosition || "left";
      const options = Array.isArray(p.options)
        ? p.options
        : typeof p.options === "string"
        ? p.options
            .split(",")
            .map((s: string) => s.trim())
            .filter((s) => s)
        : [];
      const optionsHTML = options
        .map((opt) => `<option value="${opt}">${opt}</option>`)
        .join("");
      if (labelPosition === "top") {
        return `<div style="${styleStr}">
          <label style="display:block; margin-bottom:4px; font-size:14px; color:#606266;">${
            p.label
          }</label>
          <select style="width:100%; padding:8px; border:1px solid #dcdfe6; border-radius:4px;">
            <option value="">${p.placeholder || "请选择"}</option>
            ${optionsHTML}
          </select>
        </div>`;
      }
      return `<div style="${styleStr} display:flex; align-items:center;">
        <label style="width:80px; text-align:right; margin-right:8px; font-size:14px; color:#606266; flex-shrink:0;">${
          p.label
        }</label>
        <select style="flex:1; padding:8px; border:1px solid #dcdfe6; border-radius:4px;">
          <option value="">${p.placeholder || "请选择"}</option>
          ${optionsHTML}
        </select>
      </div>`;
    }

    case "table": {
      const p = comp.props;
      const styleStr = getStyleString(comp);
      // 解析列定义
      let columns: Array<{ label: string; link: string }> = [];
      const colsRaw = p.columns;
      if (Array.isArray(colsRaw)) {
        columns = colsRaw.map((col: any) => {
          if (typeof col === "string") return { label: col, link: "" };
          if (typeof col === "object")
            return { label: col.label || "", link: col.link || "" };
          return { label: String(col), link: "" };
        });
      } else if (typeof colsRaw === "string") {
        try {
          const parsed = JSON.parse(colsRaw);
          if (Array.isArray(parsed)) {
            columns = parsed.map((item: any) => {
              if (typeof item === "string") return { label: item, link: "" };
              if (typeof item === "object")
                return { label: item.label || "", link: item.link || "" };
              return { label: String(item), link: "" };
            });
          }
        } catch (e) {
          columns = colsRaw
            .split(",")
            .map((s: string) => ({ label: s.trim(), link: "" }))
            .filter((c) => c.label);
        }
      }

      // 解析数据
      let rows: any[][] = [];
      const dataRaw = p.data;
      if (typeof dataRaw === "string") {
        try {
          const parsed = JSON.parse(dataRaw);
          if (Array.isArray(parsed)) {
            rows = parsed.map((row: any) => {
              if (Array.isArray(row)) return row;
              if (typeof row === "object")
                return Object.values(row).map((v) => v);
              return [];
            });
          }
        } catch (e) {
          rows = dataRaw
            .split("\n")
            .filter((row) => row.trim() !== "")
            .map((row) => row.split(",").map((cell) => cell.trim()));
        }
      } else if (Array.isArray(dataRaw)) {
        rows = dataRaw;
      }

      let tableHTML = `<div style="${styleStr}" height:${
        p.height || "auto"
      }; overflow:auto;"><table class="table" style="border-collapse:collapse; width:100%;">`;
      tableHTML += `<thead><tr>`;
      columns.forEach((col) => {
        const linkAttr = col.link ? ` href="${col.link}" target="_blank"` : "";
        const tag = col.link ? "a" : "span";
        tableHTML += `<th style="font-size:${p.headerFontSize || 14}px; color:${
          p.headerColor || "#333"
        }; background:${p.headerBackground || "#f5f7fa"}; padding:${
          p.headerPadding || "8px"
        };"><${tag}${linkAttr} style="color:${
          p.headerColor || "#333"
        }; text-decoration:none;">${col.label}</${tag}></th>`;
      });
      tableHTML += `</tr></thead><tbody>`;
      rows.forEach((row: any[]) => {
        tableHTML += "<tr>";
        row.forEach((cell: any, colIndex: number) => {
          let text = "";
          let link = "";
          if (cell && typeof cell === "object") {
            text = cell.text || "";
            link = cell.link || "";
          } else {
            text = String(cell ?? "");
            if (text.startsWith("http://") || text.startsWith("https://")) {
              link = text;
            }
          }
          const linkAttr = link ? ` href="${link}" target="_blank"` : "";
          const tag = link ? "a" : "span";
          tableHTML += `<td style="font-size:${p.cellFontSize || 14}px; color:${
            p.cellColor || "#333"
          }; padding:${
            p.cellPadding || "8px"
          };"><${tag}${linkAttr} style="color:${
            p.cellColor || "#333"
          }; text-decoration:none;">${text}</${tag}></td>`;
        });
        tableHTML += "</tr>";
      });
      tableHTML += `</tbody></table></div>`;
      return tableHTML;
    }

    case "form": {
      const labelPosition = p.labelPosition || "left";
      let fieldsArray: Array<{
        label: string;
        type: string;
        options?: string[];
      }> = [];
      const config = p.fieldsConfig;
      if (config && typeof config === "string") {
        try {
          const parsed = JSON.parse(config);
          if (Array.isArray(parsed)) {
            fieldsArray = parsed.map((item: any) => ({
              label: item.label || "字段",
              type: item.type || "input",
              options: Array.isArray(item.options) ? item.options : [],
            }));
          }
        } catch (e) {}
      }
      if (fieldsArray.length === 0) {
        let fields = p.fields;
        if (typeof fields === "string")
          fields = fields.split(",").map((s: string) => s.trim());
        fieldsArray = (fields as string[]).map((f: string) => ({
          label: f,
          type: "input",
        }));
      }

      let formHTML = `<form class="form" style="${styleStr}">`;
      fieldsArray.forEach((field) => {
        if (labelPosition === "top") {
          formHTML += `<div class="form-item" style="display:flex; flex-direction:column; margin-bottom:8px;">`;
          formHTML += `<label style="margin-bottom:4px;">${field.label}</label>`;
        } else {
          formHTML += `<div class="form-item" style="display:flex; align-items:center;">`;
          formHTML += `<label style="width:80px; text-align:right; margin-right:8px; flex-shrink:0;">${field.label}</label>`;
        }
        if (field.type === "select") {
          formHTML += `<select style="flex:1; padding:6px;"><option>请选择</option>`;
          (field.options || []).forEach((opt) => {
            formHTML += `<option>${opt}</option>`;
          });
          formHTML += `</select>`;
        } else if (field.type === "radio") {
          formHTML += `<div style="flex:1;">`;
          (field.options || []).forEach((opt) => {
            formHTML += `<label style="margin-right:8px;"><input type="radio" name="${field.label}"> ${opt}</label>`;
          });
          formHTML += `</div>`;
        } else if (field.type === "checkbox") {
          formHTML += `<div style="flex:1;">`;
          (field.options || []).forEach((opt) => {
            formHTML += `<label style="margin-right:8px;"><input type="checkbox"> ${opt}</label>`;
          });
          formHTML += `</div>`;
        } else {
          formHTML += `<input placeholder="${field.label}" style="flex:1; padding:6px;">`;
        }
        formHTML += `</div>`;
      });
      formHTML += `</form>`;
      return formHTML;
    }

    case "card":
      return `<div class="card" style="${styleStr}"><div class="card-title">${p.title}</div><div class="card-content">${p.content}</div></div>`;

    case "icon": {
      return `<div style="${styleStr} text-align:center;">
      <span class="icon-placeholder" data-icon-name="${
        p.iconName
      }" style="font-size:${p.size || 24}px; color:${
        p.color || "#333"
      };"></span>
      </div>`;
    }

    case "text": {
      const fontSize = p.fontSize || 14;
      const color = p.color || "#333333";
      const textAlign = p.textAlign || "left";
      const fontWeight = p.fontWeight || "normal";
      return `<div style="${styleStr} font-size:${fontSize}px; color:${color}; text-align:${textAlign}; font-weight:${fontWeight}; word-break:break-word; line-height:1.5;">${p.content}</div>`;
    }

    default:
      return `<div style="${styleStr}"></div>`;
  }
}

// 递归渲染子组件数组
function renderSlot(slotComponents?: ComponentInstance[]): string {
  if (!slotComponents || slotComponents.length === 0) return "";
  return slotComponents.map((child) => componentToHTML(child)).join("");
}

// ========== 导出函数 ==========

export function exportJSON(components: ComponentInstance[]) {
  const data = JSON.stringify(components, null, 2);
  downloadFile("prototype.json", data, "application/json");
}

export function generateHTML(components: ComponentInstance[]): string {
  const bodyContent = components.map(componentToHTML).join("\n");
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>原型预览</title>
  <script src="https://unpkg.com/vue@3"></script>
  <script src="https://unpkg.com/@element-plus/icons-vue"></script>
  <style>
    body { font-family: sans-serif; padding: 20px; }
    .btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
    .btn-primary { background: #409eff; color: white; }
    .btn-success { background: #67c23a; color: white; }
    .btn-warning { background: #e6a23c; color: white; }
    .btn-danger { background: #f56c6c; color: white; }
    .btn-info { background: #909399; color: white; }
    .form-item { margin-bottom: 12px; }
    .form-item label { display: inline-block; width: 80px; text-align: right; margin-right: 8px; }
    .table { border-collapse: collapse; width: 100%; }
    .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    .card { border: 1px solid #ddd; border-radius: 4px; padding: 16px; margin-bottom: 12px; }
    .card-title { font-weight: bold; margin-bottom: 8px; }
    .layout { border: 1px solid #ddd; border-radius: 4px; overflow: hidden; margin-bottom: 12px; }
    .layout-header { background: #409eff; color: white; padding: 12px 16px; font-weight: bold; }
    .layout-body { display: flex; min-height: 200px; }
    .layout-sidebar { background: #f5f5f5; border-right: 1px solid #ddd; padding: 8px 0; flex-shrink: 0; }
    .sidebar-item { padding: 8px 16px; font-size: 14px; }
    .layout-content { flex: 1; padding: 16px; }
    .layout-footer { background: #f5f5f5; padding: 12px 16px; font-size: 13px; color: #666; }
    .dialog-mask {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }
    .dialog-box {
      background: white;
      padding: 20px;
      border-radius: 6px;
      min-width: 300px;
      max-width: 80%;
    }
    .dialog-title { font-weight: bold; margin-bottom: 12px; font-size: 16px; }
    .dialog-close { float: right; cursor: pointer; font-size: 20px; line-height: 1; color: #999; }
  </style>
</head>
<body>
${bodyContent}
<script>
  function showDialog(id) {
    var mask = document.getElementById(id);
    if (mask) mask.style.display = 'flex';
  }
  function hideDialog(id) {
    var mask = document.getElementById(id);
    if (mask) mask.style.display = 'none';
  }
  // 替换图标占位
  document.querySelectorAll('.icon-placeholder').forEach(function(el) {
    var iconName = el.getAttribute('data-icon-name');
    if (iconName && window.ElementPlusIconsVue && window.ElementPlusIconsVue[iconName]) {
      var IconComp = window.ElementPlusIconsVue[iconName];
      // 创建 Vue 应用挂载图标
      var container = document.createElement('span');
      el.parentNode.replaceChild(container, el);
      Vue.createApp({
        render() {
          return Vue.h(IconComp);
        }
      }).mount(container);
    } else {
      // 回退显示文本
      el.textContent = '[图标: ' + iconName + ']';
    }
  });
</script>
</body>
</html>`;
}

export function exportHTML(components: ComponentInstance[]) {
  const html = generateHTML(components);
  downloadFile("prototype.html", html, "text/html");
}

function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
