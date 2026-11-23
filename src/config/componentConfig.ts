import type { ComponentConfig, StyleFieldConfig } from "../types";

// 通用样式配置（所有组件共享）
const commonStyleConfig: StyleFieldConfig[] = [
  { key: "width", label: "宽度(px/%)", type: "input" },
  { key: "height", label: "高度(px/%)", type: "input" },
  { key: "paddingTop", label: "上内边距(px)", type: "number" },
  { key: "paddingRight", label: "右内边距(px)", type: "number" },
  { key: "paddingBottom", label: "下内边距(px)", type: "number" },
  { key: "paddingLeft", label: "左内边距(px)", type: "number" },
  { key: "marginTop", label: "上外边距(px)", type: "number" },
  { key: "marginRight", label: "右外边距(px)", type: "number" },
  { key: "marginBottom", label: "下外边距(px)", type: "number" },
  { key: "marginLeft", label: "左外边距(px)", type: "number" },
];

// 默认样式
const defaultCommonStyle: Record<string, string> = {
  width: "",
  height: "",
  paddingTop: "0",
  paddingRight: "0",
  paddingBottom: "0",
  paddingLeft: "0",
  marginTop: "0",
  marginRight: "0",
  marginBottom: "0",
  marginLeft: "0",
};
// 按钮默认样式
const defaultBtnCommonStyle: Record<string, string> = {
  width: "",
  height: "",
  paddingTop: "0",
  paddingRight: "0",
  paddingBottom: "0",
  paddingLeft: "0",
  marginTop: "0",
  marginRight: "0",
  marginBottom: "0",
  marginLeft: "0",
};
// 输入框默认样式
const defaultInputCommonStyle: Record<string, string> = {
  width: "",
  height: "",
  paddingTop: "0",
  paddingRight: "0",
  paddingBottom: "0",
  paddingLeft: "0",
  marginTop: "0",
  marginRight: "0",
  marginBottom: "0",
  marginLeft: "0",
};

// 栅格列内排列方式：一行水平（默认）/ 自动换行 / 垂直堆叠
export const gridLayoutDirOptions = ["一行水平", "自动换行", "垂直堆叠"];

// 统一计算栅格列内 flex 布局：保证「水平对齐」始终控制水平方向、「垂直对齐」始终控制垂直方向
export function getGridColFlexStyle(
  props: Record<string, any> = {}
): Record<string, string> {
  const verMap: Record<string, string> = {
    top: "flex-start",
    middle: "center",
    bottom: "flex-end",
  };
  const horMap: Record<string, string> = {
    left: "flex-start",
    center: "center",
    right: "flex-end",
  };

  // 兼容英文旧值
  const rawDir = props.layoutDir || "一行水平";
  const dir =
    rawDir === "row" ? "一行水平" : rawDir === "wrap" ? "自动换行" : rawDir === "column" ? "垂直堆叠" : rawDir;
  const isRow = dir !== "垂直堆叠";

  const colAlign = props.colAlign || "top";
  const colJustify = props.colJustify || "left";

  // 行方向：水平轴由 justifyContent 控制；列方向：水平轴由 alignItems 控制
  const alignItems = isRow
    ? verMap[colAlign] || "flex-start"
    : horMap[colJustify] || "flex-start";
  const justifyContent = isRow
    ? horMap[colJustify] || "flex-start"
    : verMap[colAlign] || "flex-start";

  return {
    display: "flex",
    flexDirection: isRow ? "row" : "column",
    flexWrap: dir === "自动换行" ? "wrap" : "nowrap",
    alignItems,
    justifyContent,
  };
}

// 文字链接颜色选项（对应 Element Plus Link 六种类型）
export const linkColorOptions = ["默认", "主要", "成功", "警告", "危险", "信息"];
export const linkColorMap: Record<string, string> = {
  默认: "#606266",
  主要: "#409eff",
  成功: "#67c23a",
  警告: "#e6a23c",
  危险: "#f56c6c",
  信息: "#909399",
};

export const componentList: ComponentConfig[] = [
  {
    type: "layout",
    name: "布局容器",
    defaultProps: {
      header: "顶部区域",
      showSidebar: "true",
      sidebarWidth: "200px",
      // 新增：顶部区域样式
      headerHeight: "50px",
      headerFontSize: 16,
      headerColor: "#ffffff",
      headerBgColor: "#f0f0f0",
      headerPadding: "0 16px",
      headerFontWeight: "bold",
      headerTextAlign: "left",
    },
    defaultStyle: { ...defaultCommonStyle, width: "100%" },
    propsConfig: [
      { key: "header", label: "顶部标题", type: "input" },
      {
        key: "showSidebar",
        label: "显示侧边栏",
        type: "select",
        options: ["true", "false"],
      },
      { key: "sidebarWidth", label: "侧边栏宽度", type: "input" },
      { key: "headerHeight", label: "顶部高度", type: "input" },
      { key: "headerFontSize", label: "顶部字体大小(px)", type: "number" },
      { key: "headerColor", label: "顶部文字颜色", type: "input" },
      { key: "headerBgColor", label: "顶部背景色", type: "input" },
      { key: "headerPadding", label: "顶部内边距", type: "input" },
      {
        key: "headerFontWeight",
        label: "顶部字重",
        type: "select",
        options: ["normal", "bold"],
      },
      {
        key: "headerTextAlign",
        label: "顶部对齐",
        type: "select",
        options: ["left", "center", "right"],
      },
    ],
    styleConfig: commonStyleConfig,
  },
  {
    type: "grid",
    name: "栅格布局",
    defaultProps: {
      columns: 2,
      gutter: 10,
      colSpans: [12, 12],
      layoutDir: "一行水平", // 列内排列方式：一行水平（默认）| 自动换行 | 垂直堆叠
      colAlign: "top", // 垂直对齐：top | middle | bottom
      colJustify: "left", // 水平对齐：left | center | right
    },
    defaultStyle: { ...defaultCommonStyle, width: "100%" },
    propsConfig: [
      { key: "columns", label: "列数", type: "number" },
      { key: "gutter", label: "间距", type: "number" },
      {
        key: "layoutDir",
        label: "排列方式",
        type: "select",
        options: gridLayoutDirOptions,
      },
      { key: "colSpans", label: "每列跨度（逗号分隔）", type: "textarea" },
      {
        key: "colAlign",
        label: "垂直对齐",
        type: "select",
        options: ["top", "middle", "bottom"],
      },
      {
        key: "colJustify",
        label: "水平对齐",
        type: "select",
        options: ["left", "center", "right"],
      },
    ],
    styleConfig: commonStyleConfig,
  },
  {
    type: "text",
    name: "文本",
    defaultProps: {
      content: "这是一段文本",
      fontSize: 14,
      color: "#333333",
      textAlign: "left",
      fontWeight: "normal",
    },
    defaultStyle: { ...defaultBtnCommonStyle },
    propsConfig: [
      { key: "content", label: "文本内容", type: "textarea" },
      { key: "fontSize", label: "字体大小(px)", type: "number" },
      { key: "color", label: "文字颜色", type: "input" },
      {
        key: "textAlign",
        label: "对齐方式",
        type: "select",
        options: ["left", "center", "right"],
      },
      {
        key: "fontWeight",
        label: "字重",
        type: "select",
        options: ["normal", "bold"],
      },
    ],
    styleConfig: commonStyleConfig,
  },
  {
    type: "link",
    name: "文字链接",
    defaultProps: {
      content: "文字链接",
      href: "https://",
      color: "主要",
      fontSize: 14,
      textAlign: "left",
      fontWeight: "normal",
    },
    defaultStyle: { ...defaultBtnCommonStyle },
    propsConfig: [
      { key: "content", label: "文本内容", type: "textarea" },
      { key: "href", label: "超链接地址", type: "input" },
      {
        key: "color",
        label: "字体颜色",
        type: "select",
        options: linkColorOptions,
      },
      { key: "fontSize", label: "字体大小(px)", type: "number" },
      {
        key: "textAlign",
        label: "对齐方式",
        type: "select",
        options: ["left", "center", "right"],
      },
      {
        key: "fontWeight",
        label: "字重",
        type: "select",
        options: ["normal", "bold"],
      },
    ],
    styleConfig: commonStyleConfig,
  },
  {
    type: "button",
    name: "按钮",
    defaultProps: {
      text: "按钮",
      type: "primary",
      link: "",
      target: "_self",
      // 新增：文字链接样式
      linkColor: "#409eff",
      linkFontSize: 14,
      linkFontWeight: "normal",
      linkTextDecoration: "none",
    },
    defaultStyle: { ...defaultCommonStyle },
    propsConfig: [
      { key: "text", label: "按钮文字", type: "input" },
      {
        key: "type",
        label: "按钮类型",
        type: "select",
        options: ["primary", "success", "warning", "danger", "info", "text"],
      },
      { key: "link", label: "超链接地址", type: "input" },
      {
        key: "target",
        label: "打开方式",
        type: "select",
        options: ["_self", "_blank"],
      },
      // 文字链接样式（仅 type=text 时生效）
      { key: "linkColor", label: "文字颜色", type: "input" },
      { key: "linkFontSize", label: "字体大小(px)", type: "number" },
      {
        key: "linkFontWeight",
        label: "字重",
        type: "select",
        options: ["normal", "bold", "lighter"],
      },
      {
        key: "linkTextDecoration",
        label: "下划线",
        type: "select",
        options: ["none", "underline"],
      },
    ],
    styleConfig: commonStyleConfig,
  },
  {
    type: "input",
    name: "输入框",
    defaultProps: {
      placeholder: "请输入",
      label: "输入框",
      labelPosition: "left",
      labelWidth: "",
      labelPrefixIcon: "", // 新增：标签前图标
      labelSuffixIcon: "", // 新增：标签后图标
    },
    defaultStyle: { ...defaultInputCommonStyle },
    propsConfig: [
      { key: "label", label: "标签", type: "input" },
      {
        key: "labelPosition",
        label: "标签位置",
        type: "select",
        options: ["left", "top"],
      },
      { key: "labelWidth", label: "标签宽度(px)", type: "input" },
      { key: "placeholder", label: "占位提示", type: "input" },
      { key: "labelPrefixIcon", label: "标签前图标", type: "input" }, // 新增
      { key: "labelSuffixIcon", label: "标签后图标", type: "input" }, // 新增
    ],
    styleConfig: commonStyleConfig,
  },
  {
    type: "select",
    name: "下拉框",
    defaultProps: {
      label: "下拉框",
      placeholder: "请选择",
      options: ["选项1", "选项2", "选项3"],
      labelPosition: "left",
      labelWidth: "", // 新增
    },
    defaultStyle: { ...defaultCommonStyle },
    propsConfig: [
      { key: "label", label: "标签", type: "input" },
      {
        key: "labelPosition",
        label: "标签位置",
        type: "select",
        options: ["left", "top"],
      },
      { key: "labelWidth", label: "标签宽度(px)", type: "input" }, // 新增
      { key: "placeholder", label: "占位提示", type: "input" },
      { key: "options", label: "选项（逗号分隔）", type: "textarea" },
    ],
    styleConfig: commonStyleConfig,
  },
  {
    type: "radio",
    name: "单选框",
    defaultProps: {
      label: "单选框",
      options: "选项1,选项2,选项3",
      value: "选项1",
      direction: "horizontal",
    },
    defaultStyle: { ...defaultCommonStyle },
    propsConfig: [
      { key: "label", label: "标签", type: "input" },
      { key: "options", label: "选项（逗号分隔）", type: "textarea" },
      { key: "value", label: "默认选中", type: "input" },
      {
        key: "direction",
        label: "排列方向",
        type: "select",
        options: ["horizontal", "vertical"],
      },
    ],
    styleConfig: commonStyleConfig,
  },
  {
    type: "checkbox",
    name: "多选框",
    defaultProps: {
      label: "多选框",
      options: "选项1,选项2,选项3",
      value: "选项1,选项2",
      direction: "horizontal",
    },
    defaultStyle: { ...defaultCommonStyle },
    propsConfig: [
      { key: "label", label: "标签", type: "input" },
      { key: "options", label: "选项（逗号分隔）", type: "textarea" },
      { key: "value", label: "默认选中（逗号分隔）", type: "input" },
      {
        key: "direction",
        label: "排列方向",
        type: "select",
        options: ["horizontal", "vertical"],
      },
    ],
    styleConfig: commonStyleConfig,
  },
  {
    type: "table",
    name: "表格",
    defaultProps: {
      columns: ["姓名", "年龄"],
      data: [
        ["张三", 28],
        ["李四", 32],
      ],
      // 列定义可支持对象数组：[{ "label": "列名", "link": "https://..." }]
      // 数据单元格支持对象：{ "text": "显示文字", "link": "https://..." }
      // 或纯字符串（如果是URL自动识别为链接）
      headerFontSize: 14,
      headerColor: "#333333",
      headerBackground: "#f5f7fa",
      headerPadding: "8px",
      cellFontSize: 14,
      cellColor: "#333333",
      cellPadding: "8px",
    },
    defaultStyle: { ...defaultCommonStyle, width: "400px", height: "200px" },
    propsConfig: [
      { key: "columns", label: "列定义（支持对象数组）", type: "textarea" },
      { key: "data", label: "数据（支持对象数组）", type: "textarea" },
      { key: "headerFontSize", label: "表头字体大小(px)", type: "number" },
      { key: "headerColor", label: "表头文字颜色", type: "input" },
      { key: "headerBackground", label: "表头背景色", type: "input" },
      { key: "headerPadding", label: "表头内边距", type: "input" },
      { key: "cellFontSize", label: "单元格字体大小(px)", type: "number" },
      { key: "cellColor", label: "单元格文字颜色", type: "input" },
      { key: "cellPadding", label: "单元格内边距", type: "input" },
    ],
    styleConfig: commonStyleConfig,
  },
  {
    type: "form",
    name: "表单",
    defaultProps: {
      fields: ["姓名", "邮箱"],
      fieldsConfig: "",
      labelPosition: "left",
    },
    defaultStyle: { ...defaultCommonStyle, width: "400px", height: "200px" },
    propsConfig: [],
    styleConfig: commonStyleConfig,
  },
  {
    type: "card",
    name: "卡片",
    premium: true,
    defaultProps: { title: "卡片标题", content: "卡片内容" },
    defaultStyle: { ...defaultCommonStyle, width: "300px", height: "150px" },
    propsConfig: [
      { key: "title", label: "标题", type: "input" },
      { key: "content", label: "内容", type: "textarea" },
    ],
    styleConfig: commonStyleConfig,
  },
  {
    type: "dialog",
    name: "弹窗",
    premium: true,
    defaultProps: {
      title: "弹窗标题",
      triggerText: "打开弹窗",
    },
    defaultStyle: { ...defaultCommonStyle },
    propsConfig: [
      { key: "title", label: "弹窗标题", type: "input" },
      { key: "triggerText", label: "触发按钮文字", type: "input" },
    ],
    styleConfig: commonStyleConfig,
  },
  {
    type: "icon",
    name: "图标",
    premium: true,
    defaultProps: {
      iconName: "HomeFilled",
      color: "#333333",
      size: 24,
    },
    defaultStyle: {
      width: "25px",
      height: "25px",
      paddingTop: "0",
      paddingRight: "0",
      paddingBottom: "0",
      paddingLeft: "0",
      marginTop: "0",
      marginRight: "0",
      marginBottom: "0",
      marginLeft: "0",
    },
    propsConfig: [
      { key: "iconName", label: "图标名称", type: "input" },
      { key: "color", label: "颜色", type: "input" },
      { key: "size", label: "大小(px)", type: "number" },
    ],
    styleConfig: commonStyleConfig,
  },
];
