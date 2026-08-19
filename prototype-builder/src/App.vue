<template>
  <div class="app-container">
    <header class="header">
      <h1>后台原型生成器</h1>
      <div class="header-actions">
        <el-button @click="undo" :disabled="!canUndo">撤销</el-button>
        <el-button @click="redo" :disabled="!canRedo">重做</el-button>
        <el-button type="primary" @click="exportDialogVisible = true">导出</el-button>
      </div>
    </header>
    <div class="main">
      <ComponentList />
      <CanvasArea />
      <PropertyPanel />
    </div>
    <ExportDialog v-model="exportDialogVisible" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useEditorStore } from './stores/editor';
import ComponentList from './components/ComponentList.vue';
import CanvasArea from './components/CanvasArea.vue';
import PropertyPanel from './components/PropertyPanel.vue';
import ExportDialog from './components/ExportDialog.vue';

const store = useEditorStore();
const exportDialogVisible = ref(false);

const canUndo = computed(() => store.history.length > 0);
const canRedo = computed(() => store.future.length > 0);

function undo() { store.undo(); }
function redo() { store.redo(); }

onMounted(() => {
  store.loadFromLocal();
});
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
}
.main {
  flex: 1;
  display: flex;
  overflow: hidden;
}
</style>