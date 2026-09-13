<template>
  <el-row :gutter="gutter">
    <el-col v-for="(span, index) in colSpans" :key="index" :span="span">
      <div class="grid-col-placeholder" :style="getGridColStyle()">
        列 {{ index + 1 }}
      </div>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  props: Record<string, any>;
}>();

const gutter = computed(() => Number(props.props.gutter) || 0);

const colSpans = computed(() => {
  const cols = Number(props.props.columns) || 2;
  const spans = props.props.colSpans;

  let spanArray: number[] = [];

  if (Array.isArray(spans)) {
    spanArray = spans.map(Number);
  } else if (typeof spans === "string" && spans.trim()) {
    spanArray = spans.split(",").map((s: string) => Number(s.trim()) || 12);
  }

  // 联动处理
  if (spanArray.length !== cols) {
    const span = Math.floor(24 / cols);
    spanArray = Array(cols).fill(span);
    const remainder = 24 - span * cols;
    if (remainder > 0) {
      spanArray[cols - 1] += remainder;
    }
  }

  return spanArray;
});

function getGridColStyle(): Record<string, string> {
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
  const colAlign = props?.props?.component?.colAlign || "top";
  const colJustify = props?.props?.component?.colJustify || "left";
  return {
    display: "flex",
    flexDirection: "column",
    alignItems: justifyMap[colJustify] || "flex-start",
    justifyContent: alignMap[colAlign] || "flex-start",
  };
}
</script>

<style scoped>
.grid-col-placeholder {
  /* background: #f5f7fa; */
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  padding: 20px;
  text-align: center;
  color: #909399;
  font-size: 13px;
  min-height: 60px;
}
</style>
