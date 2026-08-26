<template>
  <div class="component-list">
    <h3>组件库</h3>
    <div
      v-for="comp in componentList"
      :key="comp.type"
      class="component-item"
      draggable="true"
      @dragstart="onDragStart($event, comp.type)"
    >
      {{ comp.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { componentList } from '../config/componentConfig';

function onDragStart(e: DragEvent, type: string) {
  if (e.dataTransfer) {
    e.dataTransfer.setData('componentType', type);
    e.dataTransfer.effectAllowed = 'copy';
  }
}
</script>

<style scoped>
.component-list {
  width: 100%;
  box-sizing: border-box;
  background: #f5f5f5;
  padding: 15px;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
}
.component-item {
  padding: 10px;
  margin-bottom: 8px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: grab;
  user-select: none;
  text-align: center;
}
.component-item:hover {
  background: #ecf5ff;
  border-color: #409eff;
}
.component-item:active { cursor: grabbing; }
</style>