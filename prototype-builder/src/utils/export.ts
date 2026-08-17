import type { ComponentInstance } from '../types';

function componentToHTML(comp: ComponentInstance): string {
  const p = comp.props;
  switch (comp.type) {
    case 'button':
      return `<button class="btn btn-${p.type}">${p.text}</button>`;
    case 'input':
      return `<div class="form-item"><label>${p.label}</label><input placeholder="${p.placeholder}"></div>`;
    case 'table':
      const columns = p.columns;
      const data = p.data;
      let tableHTML = '<table class="table"><thead><tr>';
      if (Array.isArray(columns)) {
        columns.forEach((col: string) => (tableHTML += `<th>${col}</th>`));
      } else if (typeof columns === 'string') {
        columns.split(',').forEach((col: string) => (tableHTML += `<th>${col.trim()}</th>`));
      }
      tableHTML += '</tr></thead><tbody>';
      if (Array.isArray(data)) {
        data.forEach((row: any[]) => {
          tableHTML += '<tr>';
          row.forEach((cell) => (tableHTML += `<td>${cell}</td>`));
          tableHTML += '</tr>';
        });
      }
      tableHTML += '</tbody></table>';
      return tableHTML;
    case 'form':
      let fields = p.fields;
      if (typeof fields === 'string') fields = fields.split(',').map((f: string) => f.trim());
      let formHTML = '<form class="form">';
      if (Array.isArray(fields)) {
        fields.forEach((field: string) => {
          formHTML += `<div class="form-item"><label>${field}</label><input placeholder="${field}"></div>`;
        });
      }
      formHTML += '</form>';
      return formHTML;
    case 'card':
      return `<div class="card"><div class="card-title">${p.title}</div><div class="card-content">${p.content}</div></div>`;
    case 'dialog':
      return `<div class="dialog-trigger"><button class="btn btn-primary">${p.triggerText}</button>
        <div class="dialog-mask" style="display:none;">
          <div class="dialog-box"><div class="dialog-title">${p.title}</div><div class="dialog-content">弹窗内容</div></div>
        </div></div>`;
    default:
      return '<div></div>';
  }
}

export function exportJSON(components: ComponentInstance[]) {
  const data = JSON.stringify(components, null, 2);
  downloadFile('prototype.json', data, 'application/json');
}

export function exportHTML(components: ComponentInstance[]) {
  console.log("components-------",components);
  const bodyContent = components?.map(componentToHTML).join('\n');
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