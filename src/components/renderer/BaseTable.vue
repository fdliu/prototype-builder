<template>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column v-for="(col, index) in parsedColumns" :key="index">
      <!-- 表头插槽 -->
      <template #header>
        <a
          v-if="col.link"
          :href="col.link"
          target="_blank"
          :style="headerStyle"
        >
          {{ col.label }}
        </a>
        <span v-else :style="headerStyle">{{ col.label }}</span>
      </template>

      <!-- 单元格插槽 -->
      <template #default="scope">
        <a
          v-if="getCellLink(scope.row, index)"
          :href="getCellLink(scope.row, index)"
          target="_blank"
          :style="cellStyle"
        >
          {{ getCellText(scope.row, index) }}
        </a>
        <span v-else :style="cellStyle">{{
          getCellText(scope.row, index)
        }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ props: Record<string, any> }>();

// 解析列定义
const parsedColumns = computed(() => {
  const cols = props.props.columns;
  if (Array.isArray(cols)) {
    return cols.map((col: any) => {
      if (typeof col === "string") {
        return { label: col, link: "" };
      } else if (typeof col === "object" && col !== null) {
        return {
          label: col.label || "",
          link: col.link || "",
        };
      }
      return { label: String(col), link: "" };
    });
  }
  if (typeof cols === "string") {
    // 尝试解析 JSON
    try {
      const parsed = JSON.parse(cols);
      if (Array.isArray(parsed)) {
        return parsed.map((item: any) => {
          if (typeof item === "string") return { label: item, link: "" };
          if (typeof item === "object")
            return { label: item.label || "", link: item.link || "" };
          return { label: String(item), link: "" };
        });
      }
    } catch (e) {}
    // 普通逗号分隔
    return cols
      .split(",")
      .map((s: string) => ({ label: s.trim(), link: "" }))
      .filter((c) => c.label);
  }
  return [];
});

// 解析数据
const tableData = computed(() => {
  const data = props.props.data;
  // 如果是字符串，尝试 JSON 解析
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed.map((row: any, rowIndex: number) => {
          if (Array.isArray(row)) {
            // 行是数组，直接作为对象属性
            const obj: Record<string, any> = { id: rowIndex };
            row.forEach((cell, colIndex) => {
              obj[String(colIndex)] = cell;
            });
            return obj;
          } else if (typeof row === "object" && row !== null) {
            // 行是对象，可能包含 text/link 结构？
            // 为简单，按列顺序映射到索引属性
            const obj: Record<string, any> = { id: rowIndex };
            Object.keys(row).forEach((key, idx) => {
              obj[String(idx)] = row[key];
            });
            return obj;
          }
          return { id: rowIndex };
        });
      }
    } catch (e) {}
    // 非 JSON，按换行/逗号解析纯文本
    const rows = data.split("\n").filter((row) => row.trim() !== "");
    return rows.map((row, rowIndex) => {
      const cells = row.split(",").map((cell) => cell.trim());
      const obj: Record<string, any> = { id: rowIndex };
      cells.forEach((cell, colIndex) => {
        obj[String(colIndex)] = cell;
      });
      return obj;
    });
  }
  // 如果是数组，保持原有逻辑
  if (Array.isArray(data)) {
    return data.map((row: any, rowIndex: number) => {
      const obj: Record<string, any> = { id: rowIndex };
      if (Array.isArray(row)) {
        row.forEach((cell, colIndex) => {
          obj[String(colIndex)] = cell;
        });
      } else if (typeof row === "object" && row !== null) {
        Object.keys(row).forEach((key, idx) => {
          obj[String(idx)] = row[key];
        });
      }
      return obj;
    });
  }
  return [];
});

// 单元格文本
function getCellText(row: any, colIndex: number): string {
  const cell = row[String(colIndex)];
  if (cell && typeof cell === "object") {
    return cell.text || "";
  }
  if (typeof cell === "string") {
    return cell;
  }
  return "";
}

// 单元格链接（优先使用对象中的 link，否则如果是URL字符串则返回该字符串）
function getCellLink(row: any, colIndex: number): string {
  const cell = row[String(colIndex)];
  if (cell && typeof cell === "object") {
    return cell.link || "";
  }
  if (
    typeof cell === "string" &&
    (cell.startsWith("http://") || cell.startsWith("https://"))
  ) {
    return cell;
  }
  return "";
}

const headerStyle = computed(() => {
  const p = props.props;
  return {
    fontSize: (p.headerFontSize || 14) + "px",
    color: p.headerColor || "#333333",
    background: p.headerBackground || "#f5f7fa",
    padding: p.headerPadding || "8px",
    textDecoration: "none",
  };
});

const cellStyle = computed(() => {
  const p = props.props;
  return {
    fontSize: (p.cellFontSize || 14) + "px",
    color: p.cellColor || "#333333",
    padding: p.cellPadding || "8px",
    textDecoration: "none",
  };
});
</script>
