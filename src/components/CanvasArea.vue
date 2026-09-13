<template>
  <div
    ref="canvasRef"
    class="canvas-area"
    @dragover.prevent
    @drop="onDropToCanvas"
    @mousedown.left="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
  >
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

    <!-- 框选矩形 -->
    <div v-if="isSelecting" class="selection-box" :style="selectionStyle"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useEditorStore } from "../stores/editor";
import CanvasItem from "./CanvasItem.vue";
import { componentList } from "../config/componentConfig";

const store = useEditorStore();
const canvasRef = ref<HTMLElement | null>(null);

// 框选状态
const isSelecting = ref(false);
const startX = ref(0);
const startY = ref(0);
const currentX = ref(0);
const currentY = ref(0);

const selectionStyle = computed(() => {
  const left = Math.min(startX.value, currentX.value);
  const top = Math.min(startY.value, currentY.value);
  const width = Math.abs(currentX.value - startX.value);
  const height = Math.abs(currentY.value - startY.value);
  return {
    left: left + "px",
    top: top + "px",
    width: width + "px",
    height: height + "px",
  };
});

// 鼠标按下：启动框选（仅画布空白区域）
function onMouseDown(e: MouseEvent) {
  const target = e.target as HTMLElement;
  if (target.closest(".canvas-item")) return;
  if (target.closest(".component-list")) return;
  e.preventDefault();
  isSelecting.value = true;
  const rect = canvasRef.value!.getBoundingClientRect();
  startX.value = e.clientX - rect.left;
  startY.value = e.clientY - rect.top;
  currentX.value = startX.value;
  currentY.value = startY.value;
}

function onMouseMove(e: MouseEvent) {
  if (!isSelecting.value) return;
  const rect = canvasRef.value!.getBoundingClientRect();
  currentX.value = e.clientX - rect.left;
  currentY.value = e.clientY - rect.top;
}

function onMouseUp(e: MouseEvent) {
  if (!isSelecting.value) return;
  isSelecting.value = false;

  const rect = canvasRef.value!.getBoundingClientRect();
  const left = Math.min(startX.value, currentX.value);
  const top = Math.min(startY.value, currentY.value);
  const right = Math.max(startX.value, currentX.value);
  const bottom = Math.max(startY.value, currentY.value);
  const selectRect = {
    left: left + rect.left,
    top: top + rect.top,
    right: right + rect.left,
    bottom: bottom + rect.top,
  };

  const rootItems = canvasRef.value!.querySelectorAll(".root-item");
  const selectedIds: string[] = [];
  rootItems.forEach((el) => {
    const elRect = (el as HTMLElement).getBoundingClientRect();
    const intersect = !(
      elRect.right < selectRect.left ||
      elRect.left > selectRect.right ||
      elRect.bottom < selectRect.top ||
      elRect.top > selectRect.bottom
    );
    if (intersect) {
      const id = (el as HTMLElement).dataset.id;
      if (id) selectedIds.push(id);
    }
  });

  if (selectedIds.length > 0) {
    store.setMultiSelect(selectedIds);
  } else {
    store.clearMultiSelect();
  }
}

// 捕获阶段处理新组件拖入（优先于组件内部 drop）
function onDropCapture(e: DragEvent) {
  const newType = e.dataTransfer?.getData("componentType");
  const moveId = e.dataTransfer?.getData("moveComponentId");

  // 只处理新组件拖入（左侧拖入）
  if (newType) {
    e.stopPropagation(); // 阻止组件内部 drop 处理
    e.preventDefault();

    const defaultProps = getDefaultProps(newType);
    const defaultStyle = getDefaultStyle(newType);
    const newComp: any = {
      id: generateId(),
      type: newType,
      props: { ...defaultProps },
      style: { ...defaultStyle },
    };
    if (newType === "layout") {
      newComp.slots = { header: [], sidebar: [], content: [], footer: [] };
    }
    if (newType === "grid") {
      const cols = Number(defaultProps.columns) || 2;
      newComp.slots = {};
      for (let i = 0; i < cols; i++) newComp.slots[`col_${i}`] = [];
    }
    if (newType === "dialog") {
      newComp.slots = { content: [] };
    }

    insertNewComponentAtPosition(newComp, e.clientY);
  }
  // 移动已有组件的处理交给 CanvasItem 或 onDropToCanvas，此处忽略
}

// 原有的 onDropToCanvas 现在只处理移动已有组件（备用）
function onDropToCanvas(e: DragEvent) {
  const newType = e.dataTransfer?.getData("componentType");
  const moveId = e.dataTransfer?.getData("moveComponentId");

  if (newType) {
    // 新组件插入
    const defaultProps = getDefaultProps(newType);
    const defaultStyle = getDefaultStyle(newType);
    const newComp: any = {
      id: generateId(),
      type: newType,
      props: { ...defaultProps },
      style: { ...defaultStyle },
    };
    if (newType === "layout") {
      newComp.slots = { header: [], sidebar: [], content: [], footer: [] };
    }
    if (newType === "grid") {
      const cols = Number(defaultProps.columns) || 2;
      newComp.slots = {};
      for (let i = 0; i < cols; i++) newComp.slots[`col_${i}`] = [];
    }
    if (newType === "dialog") {
      newComp.slots = { content: [] };
    }
    insertNewComponentAtPosition(newComp, e.clientY);
  } else if (moveId) {
    // 移动已有组件
    insertComponentAtDropPosition(moveId, e.clientY);
  }
}

// 根据鼠标 Y 坐标插入新组件到根级数组
function insertNewComponentAtPosition(newComp: any, clientY: number) {
  const rootItems = canvasRef.value?.querySelectorAll(".root-item");
  if (!rootItems || rootItems.length === 0) {
    store.addComponent(newComp);
    return;
  }

  const rects: { top: number; bottom: number }[] = [];
  rootItems.forEach((el) => {
    const rect = el.getBoundingClientRect();
    rects.push({ top: rect.top, bottom: rect.bottom });
  });

  let insertIndex = rects.length;
  if (clientY <= rects[0].top) {
    insertIndex = 0;
  } else if (clientY >= rects[rects.length - 1].bottom) {
    insertIndex = rects.length;
  } else {
    for (let i = 0; i < rects.length; i++) {
      if (clientY < rects[i].bottom) {
        insertIndex = i;
        break;
      }
    }
  }

  store.insertComponentAt(newComp, insertIndex);
}

// 原有的插入位置函数（用于移动已有组件）
function insertComponentAtDropPosition(moveId: string, clientY: number) {
  const rootItems = canvasRef.value?.querySelectorAll(".root-item");
  if (rootItems?.length === 0) {
    store.moveComponentToRoot(moveId);
    return;
  }
  const rects: { id: string; top: number; bottom: number }[] = [];
  rootItems?.forEach((el) => {
    const rect = el.getBoundingClientRect();
    rects.push({
      id: (el as HTMLElement).dataset.id || "",
      top: rect.top,
      bottom: rect.bottom,
    });
  });

  if (clientY <= rects[0].top) {
    store.moveComponentBefore(moveId, rects[0].id);
    return;
  }
  if (clientY >= rects[rects.length - 1].bottom) {
    store.moveComponentAfter(moveId, rects[rects.length - 1].id);
    return;
  }
  for (let i = 0; i < rects.length; i++) {
    if (clientY < rects[i].bottom) {
      store.moveComponentBefore(moveId, rects[i].id);
      return;
    }
  }
}

// 默认属性获取函数
function getDefaultProps(type: string): Record<string, any> {
  const config = componentList.find((c) => c.type === type);
  return config?.defaultProps || {};
}

function getDefaultStyle(type: string): Record<string, string> {
  const config = componentList.find((c) => c.type === type);
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
  user-select: none;
  /* display: flex; */
  display: inline-table;
  /* flex-wrap: wrap;
  align-items: flex-start;
  gap: 10px; */
}
.empty-tip {
  color: #999;
  text-align: center;
  padding: 40px;
  font-size: 16px;
  width: 100%;
}
.root-item {
  position: relative;
  flex-shrink: 0;
  max-width: 100%;
}
.selection-box {
  position: absolute;
  border: 1px dashed #409eff;
  background: rgba(64, 158, 255, 0.1);
  pointer-events: none;
  z-index: 100;
}
</style>
