<template>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column
      v-for="(col, index) in columns"
      :key="index"
      :prop="String(index)"
      :label="col"
    />
  </el-table>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ props: Record<string, any> }>();

const columns = computed(() => {
  const cols = props.props.columns;
  if (Array.isArray(cols)) return cols;
  if (typeof cols === 'string') return cols.split(',').map((c: string) => c.trim());
  return [];
});

const tableData = computed(() => {
  const data = props.props.data;
  if (!Array.isArray(data)) return [];
  return data.map((row: any[], rowIndex: number) => {
    const obj: Record<string, any> = { id: rowIndex };
    if (Array.isArray(row)) {
      row.forEach((cell, colIndex) => {
        obj[String(colIndex)] = cell;
      });
    }
    return obj;
  });
});
</script>