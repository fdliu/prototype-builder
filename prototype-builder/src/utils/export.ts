import type { ComponentInstance } from '../types';

function getStyleString(comp: ComponentInstance): string {
  const style = comp.style || {};
  const cssParts: string[] = [];
  if (style.width) cssParts.push(`width:${style.width}`);
  if (style.height) cssParts.push(`height:${style.height}`);
  if (style.paddingTop) cssParts.push(`padding-top:${style.paddingTop}px`);
  if (style.paddingRight) cssParts.push(`padding-right:${style.paddingRight}px`);
  if (style.paddingBottom) cssParts.push(`padding-bottom:${style.paddingBottom}px`);
  if (style.paddingLeft) cssParts.push(`padding-left:${style.paddingLeft}px`);
  if (style.marginTop) cssParts.push(`margin-top:${style.marginTop}px`);
  if (style.marginRight) cssParts.push(`margin-right:${style.marginRight}px`);
  if (style.marginBottom) cssParts.push(`margin-bottom:${style.marginBottom}px`);
  if (style.marginLeft) cssParts.push(`margin-left:${style.marginLeft}px`);
  return cssParts.join(';');
}

function getColSpans(p: Record<string, any>): number[] {
  const cols = Number(p.columns) || 2;
  const spans = p.colSpans;
  let spanArray: number[] = [];
  if (Array.isArray(spans)) spanArray = spans.map(Number);
  else if (typeof spans === 'string' && spans.trim())
    spanArray = spans.split(',').map((s: string) => Number(s.trim()) || 12);
  if (spanArray.length !== cols) {
    const span = Math.floor(24 / cols);
    spanArray = Array(cols).fill(span);
    const remainder = 24 - span * cols;
    if (remainder > 0) spanArray[cols - 1] += remainder;
  }
  return spanArray;
}

function componentToHTML(comp: ComponentInstance): string {
  const p = comp.props;
  const styleStr = getStyleString(comp);
  switch (comp.type) {
    case 'layout': {
      const showSidebar = p.showSidebar === 'true' || p.showSidebar === true || p.showSidebar === undefined;
      const sidebarHTML = showSidebar
        ? `<div class="layout-sidebar" style="width:${p.sidebarWidth || '200px'};">
             <div class="sidebar-item">菜单项 1</div>
             <div class="sidebar-item">菜单项 2</div>
           </div>`
        : '';
      return `<div class="layout" style="${styleStr}">
        <div class="layout-header">${p.header}</div>
        <div class="layout-body">${sidebarHTML}<div class="layout-content">内容区域</div></div>
        <div class="layout-footer">底部区域</div>
      </div>`;
    }
    case 'grid': {
      const gutter = Number(p.gutter) || 0;
      const spans = getColSpans(p);
      let gridHTML = `<div class="el-row" style="display:flex; flex-wrap:wrap; gap:${gutter}px; ${styleStr}">`;
      spans.forEach((span: number, index: number) => {
        const width = (span / 24) * 100;
        gridHTML += `<div class="el-col" style="flex:0 0 calc(${width}% - ${gutter}px); background:#f5f7fa; border:1px dashed #dcdfe6; border-radius:4px; padding:20px; text-align:center; color:#909399; min-height:60px;">
          列 ${index + 1}
        </div>`;
      });
      gridHTML += '</div>';
      return gridHTML;
    }
    case 'button':
      return `<div style="${styleStr}"><button class="btn btn-${p.type}">${p.text}</button></div>`;
    case 'input': {
      const labelPosition = p.labelPosition || 'left';
      if (labelPosition === 'top') {
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
    case 'table': {
      const columns = p.columns;
      const data = p.data;
      let tableHTML = `<div style="${styleStr}"><table class="table"><thead><tr>`;
      if (Array.isArray(columns)) columns.forEach((col: string) => (tableHTML += `<th>${col}</th>`));
      else if (typeof columns === 'string') columns.split(',').forEach((col: string) => (tableHTML += `<th>${col.trim()}</th>`));
      tableHTML += '</tr></thead><tbody>';
      if (Array.isArray(data)) {
        data.forEach((row: any[]) => {
          tableHTML += '<tr>';
          row.forEach((cell) => (tableHTML += `<td>${cell}</td>`));
          tableHTML += '</tr>';
        });
      }
      tableHTML += '</tbody></table></div>';
      return tableHTML;
    }
    case 'form': {
      let fields = p.fields;
      if (typeof fields === 'string') fields = fields.split(',').map((f: string) => f.trim());
      let formHTML = `<form class="form" style="${styleStr}">`;
      if (Array.isArray(fields)) {
        fields.forEach((field: string) => {
          formHTML += `<div class="form-item"><label>${field}</label><input placeholder="${field}"></div>`;
        });
      }
      formHTML += '</form>';
      return formHTML;
    }
    case 'card':
      return `<div class="card" style="${styleStr}"><div class="card-title">${p.title}</div><div class="card-content">${p.content}</div></div>`;
    case 'dialog':
      return `<div class="dialog-trigger" style="${styleStr}"><button class="btn btn-primary">${p.triggerText}</button>
        <div class="dialog-mask" style="display:none;">
          <div class="dialog-box"><div class="dialog-title">${p.title}</div><div class="dialog-content">弹窗内容</div></div>
        </div></div>`;
    default:
      return `<div style="${styleStr}"></div>`;
  }
}

export function exportJSON(components: ComponentInstance[]) {
  const data = JSON.stringify(components, null, 2);
  downloadFile('prototype.json', data, 'application/json');
}

export function exportHTML(components: ComponentInstance[]) {
  const bodyContent = components.map(componentToHTML).join('\n');
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>原型预览</title>
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
    .dialog-trigger { position: relative; }
    .dialog-mask { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; }
    .dialog-box { background: white; padding: 20px; border-radius: 4px; min-width: 300px; }
  </style>
</head>
<body>
${bodyContent}
</body>
</html>`;
  downloadFile('prototype.html', html, 'text/html');
}

function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}