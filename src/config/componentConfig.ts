import type { ComponentConfig, StyleFieldConfig } from '../types';

// 通用样式配置（所有组件共享）
const commonStyleConfig: StyleFieldConfig[] = [
  { key: 'width', label: '宽度(px/%)', type: 'input' },
  { key: 'height', label: '高度(px/%)', type: 'input' },
  { key: 'paddingTop', label: '上内边距(px)', type: 'number' },
  { key: 'paddingRight', label: '右内边距(px)', type: 'number' },
  { key: 'paddingBottom', label: '下内边距(px)', type: 'number' },
  { key: 'paddingLeft', label: '左内边距(px)', type: 'number' },
  { key: 'marginTop', label: '上外边距(px)', type: 'number' },
  { key: 'marginRight', label: '右外边距(px)', type: 'number' },
  { key: 'marginBottom', label: '下外边距(px)', type: 'number' },
  { key: 'marginLeft', label: '左外边距(px)', type: 'number' },
];

// 默认样式
const defaultCommonStyle: Record<string, string> = {
  width: '',
  height: '',
  paddingTop: '0',
  paddingRight: '0',
  paddingBottom: '0',
  paddingLeft: '0',
  marginTop: '0',
  marginRight: '0',
  marginBottom: '0',
  marginLeft: '0',
};
// 按钮默认样式
const defaultBtnCommonStyle: Record<string, string> = {
  width: '',
  height: '',
  paddingTop: '0',
  paddingRight: '0',
  paddingBottom: '0',
  paddingLeft: '0',
  marginTop: '0',
  marginRight: '0',
  marginBottom: '0',
  marginLeft: '0',
};
// 输入框默认样式
const defaultInputCommonStyle: Record<string, string> = {
  width: '',
  height: '',
  paddingTop: '0',
  paddingRight: '0',
  paddingBottom: '0',
  paddingLeft: '0',
  marginTop: '0',
  marginRight: '0',
  marginBottom: '0',
  marginLeft: '0',
};

export const componentList: ComponentConfig[] = [
  {
    type: 'layout',
    name: '布局容器',
    defaultProps: {
      header: '顶部区域',
      showSidebar: 'true',
      sidebarWidth: '200px',
    },
    defaultStyle: { ...defaultCommonStyle, width: '100%' },
    propsConfig: [
      { key: 'header', label: '顶部标题', type: 'input' },
      { key: 'showSidebar', label: '显示侧边栏', type: 'select', options: ['true', 'false'] },
      { key: 'sidebarWidth', label: '侧边栏宽度', type: 'input' },
    ],
    styleConfig: commonStyleConfig,
  },
  {
    type: 'grid',
    name: '栅格布局',
    defaultProps: {
      columns: 2,
      gutter: 10,
      colSpans: [12, 12],
    },
    defaultStyle: { ...defaultCommonStyle, width: '100%' },
    propsConfig: [
      { key: 'columns', label: '列数', type: 'number' },
      { key: 'gutter', label: '间距', type: 'number' },
      { key: 'colSpans', label: '每列跨度（逗号分隔）', type: 'textarea' },
    ],
    styleConfig: commonStyleConfig,
  },
  {
    type: 'text',
    name: '文本',
    defaultProps: {
      content: '这是一段文本',
      fontSize: 14,
      color: '#333333',
      textAlign: 'left',
      fontWeight: 'normal',
    },
    defaultStyle: { ...defaultBtnCommonStyle },
    propsConfig: [
      { key: 'content', label: '文本内容', type: 'textarea' },
      { key: 'fontSize', label: '字体大小(px)', type: 'number' },
      { key: 'color', label: '文字颜色', type: 'input' },
      { key: 'textAlign', label: '对齐方式', type: 'select', options: ['left', 'center', 'right'] },
      { key: 'fontWeight', label: '字重', type: 'select', options: ['normal', 'bold'] },
    ],
    styleConfig: commonStyleConfig,
  },
  {
    type: 'button',
    name: '按钮',
    defaultProps: { text: '按钮', type: 'primary' },
    defaultStyle: { ...defaultBtnCommonStyle },
    propsConfig: [
      { key: 'text', label: '按钮文字', type: 'input' },
      { key: 'type', label: '按钮类型', type: 'select', options: ['primary', 'success', 'warning', 'danger', 'info'] },
    ],
    styleConfig: commonStyleConfig,
  },
  {
    type: 'input',
    name: '输入框',
    defaultProps: { 
      placeholder: '请输入', 
      label: '输入框',
      labelPosition: 'left',
      labelWidth: '',          // 新增，空字符串表示自适应
    },
    defaultStyle: { ...defaultCommonStyle },
    propsConfig: [
      { key: 'label', label: '标签', type: 'input' },
      { key: 'labelPosition', label: '标签位置', type: 'select', options: ['left', 'top'] },
      { key: 'labelWidth', label: '标签宽度(px)', type: 'input' },   // 新增
      { key: 'placeholder', label: '占位提示', type: 'input' },
    ],
    styleConfig: commonStyleConfig,
  },
  {
    type: 'select',
    name: '下拉框',
    defaultProps: {
      label: '下拉框',
      placeholder: '请选择',
      options: ['选项1', '选项2', '选项3'],
      labelPosition: 'left',
      labelWidth: '',          // 新增
    },
    defaultStyle: { ...defaultCommonStyle },
    propsConfig: [
      { key: 'label', label: '标签', type: 'input' },
      { key: 'labelPosition', label: '标签位置', type: 'select', options: ['left', 'top'] },
      { key: 'labelWidth', label: '标签宽度(px)', type: 'input' },   // 新增
      { key: 'placeholder', label: '占位提示', type: 'input' },
      { key: 'options', label: '选项（逗号分隔）', type: 'textarea' },
    ],
    styleConfig: commonStyleConfig,
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
    defaultStyle: { ...defaultCommonStyle, width: '400px' },
    propsConfig: [
      { key: 'columns', label: '列名（逗号分隔）', type: 'textarea' },
    ],
    styleConfig: commonStyleConfig,
  },
  {
    type: 'form',
    name: '表单',
    defaultProps: {
      fields: ['姓名', '邮箱'],
      fieldsConfig: '',
      labelPosition: 'left',      // 新增：标签位置
    },
    defaultStyle: { ...defaultCommonStyle },
    propsConfig: [],              // 保持为空，由高级界面接管
    styleConfig: commonStyleConfig,
  },
  {
    type: 'card',
    name: '卡片',
    defaultProps: {
      title: '卡片标题',
      content: '卡片内容',
    },
    defaultStyle: { ...defaultCommonStyle },
    propsConfig: [
      { key: 'title', label: '标题', type: 'input' },
      { key: 'content', label: '内容', type: 'textarea' },
    ],
    styleConfig: commonStyleConfig,
  },
  {
    type: 'dialog',
    name: '弹窗',
    defaultProps: {
      title: '弹窗标题',
      triggerText: '打开弹窗',
    },
    defaultStyle: { ...defaultCommonStyle },
    propsConfig: [
      { key: 'title', label: '弹窗标题', type: 'input' },
      { key: 'triggerText', label: '触发按钮文字', type: 'input' },
    ],
    styleConfig: commonStyleConfig,
  },
  {
    type: 'icon',
    name: '图标',
    defaultProps: {
      iconName: 'HomeFilled',
      color: '#333333',
      size: 24,
    },
    defaultStyle: {
      width: '25px',
      height: '25px',
      paddingTop: '0',
      paddingRight: '0',
      paddingBottom: '0',
      paddingLeft: '0',
      marginTop: '0',
      marginRight: '0',
      marginBottom: '0',
      marginLeft: '0',
    },
    propsConfig: [
      { key: 'iconName', label: '图标名称', type: 'input' },
      { key: 'color', label: '颜色', type: 'input' },
      { key: 'size', label: '大小(px)', type: 'number' },
    ],
    styleConfig: commonStyleConfig,
  },
];