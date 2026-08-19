<template>
  <div class="canvas-area" @dragover.prevent @drop="onDropToCanvas">
    <div v-if="store.components.length === 0" class="empty-tip">
      从左侧拖拽组件到这里
    </div>
    <div
      v-for="comp in store.components"
      :key="comp.id"
      class="root-item"
      :data-id="comp.id"
    >
      <CanvasItem :component="comp" :depth="0" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEditorStore } from '../stores/editor';
import CanvasItem from './CanvasItem.vue';
import { componentList } from '../config/componentConfig';

const store = useEditorStore();

function onDropToCanvas(e: DragEvent) {
  const moveId = e.dataTransfer?.getData('moveComponentId');
  const newType = e.dataTransfer?.getData('componentType');

  if (moveId) {
    // 根据鼠标坐标插入到合适位置
    insertComponentAtDropPosition(moveId, e.clientY);
  } else if (newType) {
    // 从左侧拖入新组件
    const defaultProps = getDefaultProps(newType);
    const defaultStyle = getDefaultStyle(newType);
    const newComp: any = {
      id: generateId(),
      type: newType,
      props: { ...defaultProps },
      style: { ...defaultStyle },
    };
    if (newType === 'layout') {
      newComp.slots = { header: [], sidebar: [], content: [], footer: [] };
    }
    if (newType === 'grid') {
      const cols = Number(defaultProps.columns) || 2;
      newComp.slots = {};
      for (let i = 0; i < cols; i++) newComp.slots[`col_${i}`] = [];
    }
    store.addComponent(newComp);
  }
}

function insertComponentAtDropPosition(moveId: string, clientY: number) {
  const rootItems = document.querySelectorAll('.root-item');
  if (rootItems.length === 0) return;

  // 获取所有根级组件的 DOM 矩形
  const rects: { id: string; top: number; bottom: number }[] = [];
  rootItems.forEach((el) => {
    const rect = el.getBoundingClientRect();
    rects.push({
      id: (el as HTMLElement).dataset.id || '',
      top: rect.top,
      bottom: rect.bottom,
    });
  });

  // 如果拖到了第一个组件上方，插入到最前面
  if (clientY <= rects[0].top) {
    store.moveComponentBefore(moveId, rects[0].id);
    return;
  }
  // 如果拖到了最后一个组件下方，插入到最后面
  if (clientY >= rects[rects.length - 1].bottom) {
    store.moveComponentAfter(moveId, rects[rects.length - 1].id);
    return;
  }

  // 否则找到第一个 bottom > clientY 的组件，插入到它前面
  for (let i = 0; i < rects.length; i++) {
    if (clientY < rects[i].bottom) {
      store.moveComponentBefore(moveId, rects[i].id);
      return;
    }
  }
}

function getDefaultProps(type: string): Record<string, any> {
  const config = componentList.find(c => c.type === type);
  return config?.defaultProps || {};
}
function getDefaultStyle(type: string): Record<string, string> {
  const config = componentList.find(c => c.type === type);
  return config?.defaultStyle || {};
}
function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}
</script>

<style scoped>
.canvas-area {
  flex: 1;
  padding: 20px;
  background: #fafafa;
  overflow-y: auto;
  position: relative;
}
.empty-tip {
  color: #999;
  text-align: center;
  padding: 40px;
  font-size: 16px;
}
</style>