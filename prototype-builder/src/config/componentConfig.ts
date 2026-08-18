import type { ComponentConfig } from '../types';

export const componentList: ComponentConfig[] = [
  {
    type: 'layout',
    name: '布局容器',
    defaultProps: {
      header: '顶部区域',
      sidebarWidth: '200px',
      showSidebar: 'true',
    },
    propsConfig: [
      { key: 'header', label: '顶部标题', type: 'input' },
      { key: 'showSidebar', label: '显示侧边栏', type: 'select', options: ['true', 'false'] },
      { key: 'sidebarWidth', label: '侧边栏宽度', type: 'input' },
    ],
  },
  {
    type: 'grid',
    name: '栅格布局',
    defaultProps: {
      columns: 2,
      gutter: 10,
      colSpans: [12, 12],
    },
    propsConfig: [
      { key: 'columns', label: '列数', type: 'number' },
      { key: 'gutter', label: '间距', type: 'number' },
      { key: 'colSpans', label: '每列跨度（逗号分隔）', type: 'textarea' },
    ],
  },
  {
    type: 'button',
    name: '按钮',
    defaultProps: { text: '按钮', type: 'primary' },
    propsConfig: [
      { key: 'text', label: '按钮文字', type: 'input' },
      { key: 'type', label: '按钮类型', type: 'select', options: ['primary', 'success', 'warning', 'danger', 'info'] },
    ],
  },
  {
    type: 'input',
    name: '输入框',
    defaultProps: { placeholder: '请输入', label: '输入框' },
    propsConfig: [
      { key: 'label', label: '标签', type: 'input' },
      { key: 'placeholder', label: '占位提示', type: 'input' },
    ],
  },
  {
    type: 'table',
    name: '表格',
    defaultProps: {
      columns: ['姓名', '年龄'],
      data: [
        ['张三', 28],
        ['李四', 32],
      ],
    },
    propsConfig: [
      { key: 'columns', label: '列名（逗号分隔）', type: 'textarea' },
    ],
  },
  {
    type: 'form',
    name: '表单',
    defaultProps: {
      fields: ['姓名', '邮箱'],
    },
    propsConfig: [
      { key: 'fields', label: '字段（逗号分隔）', type: 'textarea' },
    ],
  },
  {
    type: 'card',
    name: '卡片',
    defaultProps: {
      title: '卡片标题',
      content: '卡片内容',
    },
    propsConfig: [
      { key: 'title', label: '标题', type: 'input' },
      { key: 'content', label: '内容', type: 'textarea' },
    ],
  },
  {
    type: 'dialog',
    name: '弹窗',
    defaultProps: {
      title: '弹窗标题',
      triggerText: '打开弹窗',
    },
    propsConfig: [
      { key: 'title', label: '弹窗标题', type: 'input' },
      { key: 'triggerText', label: '触发按钮文字', type: 'input' },
    ],
  },
];