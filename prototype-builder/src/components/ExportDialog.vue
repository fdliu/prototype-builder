<template>
  <el-dialog title="导出" v-model="dialogVisible" width="400px">
    <div class="export-buttons">
      <el-button type="primary" @click="handleExportJSON">导出 JSON</el-button>
      <el-button type="success" @click="handleExportHTML">导出 HTML</el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useEditorStore } from '../stores/editor';
import { exportJSON, exportHTML } from '../utils/export';

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>();

const store = useEditorStore();
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

function handleExportJSON() {
  exportJSON(store.components);
}

function handleExportHTML() {
  exportHTML(store.components);
}
</script>

<style scoped>
.export-buttons {
  display: flex;
  justify-content: space-around;
  padding: 20px 0;
}
</style>