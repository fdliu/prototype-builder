import type { ComponentInstance } from "../types";

// 生成唯一 ID，避免多次加载模板时 ID 冲突
let seq = 0;
function uid(): string {
  seq += 1;
  return `tpl_${Date.now().toString(36)}_${seq.toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}

const baseStyle: Record<string, string> = {
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

function node(
  type: string,
  props: Record<string, any>,
  style: Record<string, string> = {}
): ComponentInstance {
  return { id: uid(), type, props, style: { ...baseStyle, ...style } };
}

function text(
  content: string,
  extra: Record<string, any> = {},
  style: Record<string, string> = {}
): ComponentInstance {
  return node(
    "text",
    {
      content,
      fontSize: 14,
      color: "#333333",
      textAlign: "left",
      fontWeight: "normal",
      ...extra,
    },
    style
  );
}

function input(label: string, placeholder = "请输入"): ComponentInstance {
  return node("input", {
    label,
    placeholder,
    labelPosition: "left",
    labelWidth: "",
    labelPrefixIcon: "",
    labelSuffixIcon: "",
  });
}

function select(label: string, options: string[]): ComponentInstance {
  return node("select", {
    label,
    placeholder: "请选择",
    options,
    labelPosition: "left",
    labelWidth: "",
  });
}

function button(
  textValue: string,
  type = "primary",
  extra: Record<string, any> = {}
): ComponentInstance {
  return node("button", {
    text: textValue,
    type,
    link: "",
    target: "_self",
    ...extra,
  });
}

function table(
  columns: string[],
  data: any[][],
  extra: Record<string, any> = {}
): ComponentInstance {
  return node(
    "table",
    {
      columns,
      data,
      headerFontSize: 14,
      headerColor: "#333333",
      headerBackground: "#f5f7fa",
      headerPadding: "8px",
      cellFontSize: 14,
      cellColor: "#333333",
      cellPadding: "8px",
      ...extra,
    },
    { width: "100%" }
  );
}

function grid(
  columns: number,
  colComponents: ComponentInstance[][]
): ComponentInstance {
  const slots: Record<string, ComponentInstance[]> = {};
  colComponents.forEach((arr, i) => {
    slots[`col_${i}`] = arr;
  });
  const span = Math.floor(24 / columns);
  const colSpans = Array(columns).fill(span);
  const remainder = 24 - span * columns;
  if (remainder > 0) colSpans[columns - 1] += remainder;
  return {
    id: uid(),
    type: "grid",
    props: {
      columns,
      gutter: 10,
      colSpans,
      colAlign: "top",
      colJustify: "left",
    },
    style: { ...baseStyle, width: "100%" },
    slots,
  };
}

function layout(
  props: Record<string, any>,
  slots: ComponentInstance["slots"]
): ComponentInstance {
  return {
    id: uid(),
    type: "layout",
    props: {
      header: "顶部区域",
      showSidebar: "true",
      sidebarWidth: "200px",
      headerHeight: "50px",
      headerFontSize: 16,
      headerColor: "#333333",
      headerBgColor: "#f0f0f0",
      headerPadding: "0 16px",
      headerFontWeight: "bold",
      headerTextAlign: "left",
      ...props,
    },
    style: { ...baseStyle, width: "100%" },
    slots,
  };
}

function dialog(
  title: string,
  content: ComponentInstance[],
  extra: Record<string, any> = {}
): ComponentInstance {
  return {
    id: uid(),
    type: "dialog",
    props: {
      title,
      triggerText: "打开弹窗",
      ...extra,
    },
    style: { ...baseStyle },
    slots: { content },
  };
}

// ========== 模板 1：政务审批表单 ==========
export function buildGovApproval(): ComponentInstance[] {
  return [
    layout(
      { header: "政务审批系统" },
      {
        header: [
          text("政务审批表单", { fontSize: 18, fontWeight: "bold", color: "#333333" }),
        ],
        sidebar: [
          text("申请管理", { fontSize: 14, color: "#333333" }),
          text("审批记录", { fontSize: 14, color: "#333333" }),
          text("待办事项", { fontSize: 14, color: "#333333" }),
        ],
        content: [
          text("新建审批申请", { fontSize: 18, fontWeight: "bold" }),
          input("申请人", "请输入姓名"),
          input("部门", "请输入部门"),
          select("申请类型", ["请假", "报销", "用章申请", "出差申请"]),
          input("申请事由", "请简要说明"),
          grid(2, [
            [button("提交申请", "primary")],
            [button("重置", "info")],
          ]),
        ],
        footer: [text("© 2026 政务服务中心", { fontSize: 12, color: "#666666" })],
      }
    ),
  ];
}

// ========== 模板 2：门店进销存 ==========
export function buildRetailInventory(): ComponentInstance[] {
  return [
    layout(
      { header: "门店进销存管理系统" },
      {
        header: [
          text("门店进销存", { fontSize: 18, fontWeight: "bold", color: "#333333" }),
        ],
        sidebar: [
          text("商品管理", { fontSize: 14, color: "#333333" }),
          text("进货入库", { fontSize: 14, color: "#333333" }),
          text("销售出库", { fontSize: 14, color: "#333333" }),
          text("库存查询", { fontSize: 14, color: "#333333" }),
        ],
        content: [
          text("商品库存一览", { fontSize: 18, fontWeight: "bold" }),
          grid(3, [
            [text("今日进货 +12", { fontSize: 14, fontWeight: "bold" })],
            [text("今日销售 +8", { fontSize: 14, fontWeight: "bold" })],
            [text("库存预警 3", { fontSize: 14, fontWeight: "bold", color: "#e6a23c" })],
          ]),
          table(
            ["商品名称", "分类", "库存", "售价"],
            [
              ["可乐", "饮料", 120, "3.5"],
              ["薯片", "零食", 80, "6.0"],
              ["洗衣液", "日化", 45, "29.9"],
            ]
          ),
          grid(3, [
            [input("商品名称", "请输入商品名称")],
            [select("分类", ["饮料", "零食", "日化"])],
            [button("查询", "primary")],
          ]),
        ],
        footer: [text("门店管理端", { fontSize: 12, color: "#666666" })],
      }
    ),
  ];
}

// ========== 模板 3：设备台账 ==========
export function buildDeviceLedger(): ComponentInstance[] {
  return [
    layout(
      { header: "设备台账管理" },
      {
        header: [
          text("设备台账", { fontSize: 18, fontWeight: "bold", color: "#333333" }),
        ],
        sidebar: [
          text("设备列表", { fontSize: 14, color: "#333333" }),
          text("维保记录", { fontSize: 14, color: "#333333" }),
          text("巡检记录", { fontSize: 14, color: "#333333" }),
        ],
        content: [
          text("设备台账", { fontSize: 18, fontWeight: "bold" }),
          grid(4, [
            [input("设备编号", "请输入设备编号")],
            [select("状态", ["运行中", "维修中", "停机"])],
            [button("查询", "primary")],
            [
              button("新增设备", "success", {
                action: "open-dialog",
                dialogId: "device-add-dialog",
              }),
            ],
          ]),
          table(
            ["设备编号", "设备名称", "型号", "状态", "负责人"],
            [
              ["SB-001", "空压机", "GA-55", "运行中", "张工"],
              ["SB-002", "数控车床", "CK6140", "维修中", "李工"],
              ["SB-003", "注塑机", "MA1600", "停机", "王工"],
            ],
            { id: "device-table" }
          ),
          dialog(
            "新增设备",
            [
              input("设备编号", "请输入设备编号"),
              input("设备名称", "请输入设备名称"),
              input("型号", "请输入型号"),
              select("状态", ["运行中", "维修中", "停机"]),
              input("负责人", "请输入负责人"),
              grid(2, [
                [
                  button("确认", "primary", {
                    action: "confirm-dialog",
                    dialogId: "device-add-dialog",
                    targetTableId: "device-table",
                  }),
                ],
                [
                  button("取消", "info", {
                    action: "close-dialog",
                    dialogId: "device-add-dialog",
                  }),
                ],
              ]),
            ],
            {
              id: "device-add-dialog",
              trigger: "hidden",
            }
          ),
        ],
        footer: [text("设备管理部", { fontSize: 12, color: "#666666" })],
      }
    ),
  ];
}

export interface TemplateDef {
  key: string;
  name: string;
  build: () => ComponentInstance[];
}

export const industryTemplates: TemplateDef[] = [
  { key: "gov-approval", name: "政务审批表单", build: buildGovApproval },
  { key: "retail-inventory", name: "门店进销存", build: buildRetailInventory },
  { key: "device-ledger", name: "设备台账", build: buildDeviceLedger },
];
