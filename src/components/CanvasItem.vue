<template>
  <div
    class="canvas-item-wrapper"
    :class="{ 'wrapper-container': isLayout || isGrid }"
  >
    <div
      class="canvas-item"
      :class="{
        selected:
          store.selectedId === liveComponent.id ||
          store.multiSelectedIds.includes(liveComponent.id),
        'is-container': isLayout || isGrid,
        'full-width': isFullWidth,
      }"
      @click.stop="store.select(liveComponent.id)"
      :style="componentStyle"
      draggable="true"
      @dragstart="onDragStart"
      @dragend="onDragEnd"
      @dragover.prevent.stop="onDragOver"
      @drop.prevent="onDropToSelf"
    >
      <div class="item-toolbar" v-if="store.selectedId === liveComponent.id">
        <span class="drag-handle" @mousedown.stop>⋮⋮</span>
        <span class="item-type">{{ liveComponent.type }}</span>
        <button
          v-if="liveComponent.type === 'icon'"
          @click.stop="openIconPicker"
          style="font-size: 8px"
        >
          换图标
        </button>
        <button @click.stop="store.copyComponent(liveComponent.id)">
          复制
        </button>
        <button @click.stop="store.removeComponent(liveComponent.id)">
          删除
        </button>
      </div>

      <!-- Layout 容器 -->
      <div v-if="isLayout" class="layout-editor">
        <div
          class="slot-area slot-header"
          :style="headerSlotStyle"
          @dragover.prevent.stop
          @drop.prevent.stop="handleDropToSlot('header', $event)"
        >
          <div class="slot-label">Header</div>
          <template
            v-for="child in getSlotComponents('header')"
            :key="child.id"
          >
            <CanvasItem :component="child" :depth="depth + 1" />
          </template>
          <div v-if="!getSlotComponents('header').length" class="drop-hint">
            拖入组件到 Header
          </div>
        </div>
        <div class="layout-main">
          <div
            v-if="showSidebar"
            class="slot-area slot-sidebar"
            :style="{ width: liveComponent.props.sidebarWidth || '200px' }"
            @dragover.prevent.stop
            @drop.prevent.stop="handleDropToSlot('sidebar', $event)"
          >
            <div class="slot-label">Sidebar</div>
            <template
              v-for="child in getSlotComponents('sidebar')"
              :key="child.id"
            >
              <CanvasItem :component="child" :depth="depth + 1" />
            </template>
            <div v-if="!getSlotComponents('sidebar').length" class="drop-hint">
              拖入组件
            </div>
          </div>
          <div
            class="slot-area slot-content"
            @dragover.prevent.stop
            @drop.prevent.stop="handleDropToSlot('content', $event)"
          >
            <div class="slot-label">Content</div>
            <template
              v-for="child in getSlotComponents('content')"
              :key="child.id"
            >
              <CanvasItem :component="child" :depth="depth + 1" />
            </template>
            <div v-if="!getSlotComponents('content').length" class="drop-hint">
              拖入组件到 Content
            </div>
          </div>
        </div>
        <div
          class="slot-area slot-footer"
          @dragover.prevent.stop
          @drop.prevent.stop="handleDropToSlot('footer', $event)"
        >
          <div class="slot-label">Footer</div>
          <template
            v-for="child in getSlotComponents('footer')"
            :key="child.id"
          >
            <CanvasItem :component="child" :depth="depth + 1" />
          </template>
          <div v-if="!getSlotComponents('footer').length" class="drop-hint">
            拖入组件到 Footer
          </div>
        </div>
      </div>

      <!-- Grid 容器 -->
      <div v-else-if="isGrid" class="grid-editor">
        <el-row :gutter="gutter">
          <el-col v-for="(span, index) in colSpans" :key="index" :span="span">
            <div
              class="grid-col-area"
              :title="`列 ${index + 1}（span: ${span}）`"
              :style="getGridColStyle()"
              @dragover.prevent.stop
              @drop.prevent.stop="handleDropToCol(index, $event)"
            >
              <template
                v-for="child in getColComponents(index)"
                :key="child.id"
              >
                <CanvasItem :component="child" :depth="depth + 1" />
              </template>

              <div v-if="!getColComponents(index).length" class="drop-hint">
                拖入组件
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- Dialog 容器 -->
      <div v-else-if="isDialog" class="dialog-editor">
        <div
          class="slot-area slot-dialog-content"
          @dragover.prevent.stop
          @drop.prevent.stop="handleDropToSlot('content', $event)"
        >
          <div class="slot-label">弹窗内容</div>
          <template
            v-for="child in getSlotComponents('content')"
            :key="child.id"
          >
            <CanvasItem :component="child" :depth="depth + 1" />
          </template>
          <div v-if="!getSlotComponents('content').length" class="drop-hint">
            拖入组件到弹窗内容
          </div>
        </div>
      </div>

      <!-- 普通组件 -->
      <div v-else>
        <component
          :is="getRenderer(liveComponent.type)"
          :props="liveComponent.props"
        />
      </div>

      <!-- 缩放手柄（仅容器组件显示） -->
      <div
        v-if="
          isLayout ||
          isGrid ||
          liveComponent.type === 'table' ||
          liveComponent.type === 'card' ||
          liveComponent.type === 'form'
        "
        class="resize-handle"
        @mousedown.stop="startResize"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onBeforeUnmount, provide } from "vue";
import { useEditorStore } from "../stores/editor";
import { getRenderer } from "./renderer";
import { componentList } from "../config/componentConfig";
import type { ComponentInstance } from "../types";

// 在 setup 中提供编辑态标识
provide("isEditing", true);
// 缩放相关
const isResizing = ref(false);
let startX = 0;
let startWidth = 0;
let startY = 0;
let startHeight = 0;
const props = defineProps<{ component: ComponentInstance; depth: number }>();
const store = useEditorStore();
const isDragging = ref(false);

const liveComponent = computed(() => {
  return store.findComponentById(props.component.id) || props.component;
});
const isLayout = computed(() => liveComponent.value.type === "layout");
const isGrid = computed(() => liveComponent.value.type === "grid");
const isDialog = computed(() => liveComponent.value.type === "dialog");

const showSidebar = computed(() => {
  const val = liveComponent.value.props?.showSidebar;
  if (val === undefined || val === null) return true;
  return val === "true" || val === true;
});

const gutter = computed(() => Number(liveComponent.value.props?.gutter) || 0);

const colSpans = computed(() => {
  const cols = Number(liveComponent.value.props?.columns) || 2;
  const spans = liveComponent.value.props?.colSpans;
  let spanArray: number[] = [];
  if (Array.isArray(spans)) spanArray = spans.map(Number);
  else if (typeof spans === "string" && spans.trim())
    spanArray = spans.split(",").map((s: string) => Number(s.trim()) || 12);
  if (spanArray.length !== cols) {
    const span = Math.floor(24 / cols);
    spanArray = Array(cols).fill(span);
    const remainder = 24 - span * cols;
    if (remainder > 0) spanArray[cols - 1] += remainder;
  }
  return spanArray;
});

const componentStyle = computed(() => {
  const style = liveComponent.value.style || {};
  const cssStyle: Record<string, string> = {};
  if (style.width) cssStyle.width = style.width;
  if (style.height) cssStyle.height = style.height;
  if (style.paddingTop) cssStyle.paddingTop = style.paddingTop + "px";
  if (style.paddingRight) cssStyle.paddingRight = style.paddingRight + "px";
  if (style.paddingBottom) cssStyle.paddingBottom = style.paddingBottom + "px";
  if (style.paddingLeft) cssStyle.paddingLeft = style.paddingLeft + "px";
  if (style.marginTop) cssStyle.marginTop = style.marginTop + "px";
  if (style.marginRight) cssStyle.marginRight = style.marginRight + "px";
  if (style.marginBottom) cssStyle.marginBottom = style.marginBottom + "px";
  if (style.marginLeft) cssStyle.marginLeft = style.marginLeft + "px";
  return cssStyle;
});

const isFullWidth = computed(() => {
  if (isLayout.value || isGrid.value) return true;
  const width = liveComponent.value.style?.width;
  return width === "100%" || width === "100%" || width === "100%";
});

function getSlotComponents(slotName: string): ComponentInstance[] {
  if (!liveComponent.value.slots) return [];
  return liveComponent.value.slots[slotName] || [];
}
function getColComponents(colIndex: number): ComponentInstance[] {
  if (!liveComponent.value.slots) return [];
  return liveComponent.value.slots[`col_${colIndex}`] || [];
}

function onDragStart(e: DragEvent) {
  e.stopPropagation();
  isDragging.value = true;
  if (e.dataTransfer) {
    e.dataTransfer.setData("moveComponentId", liveComponent.value.id);
    e.dataTransfer.effectAllowed = "move";
  }
}
function onDragEnd() {
  isDragging.value = false;
}
function onDragOver(e: DragEvent) {
  if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
}

function onDropToSelf(e: DragEvent) {
  const moveId = e.dataTransfer?.getData("moveComponentId");
  if (moveId && moveId !== liveComponent.value.id) {
    // 移动已有组件的逻辑
    const sourceIndex = store.components.findIndex((c) => c.id === moveId);
    const targetIndex = store.components.findIndex(
      (c) => c.id === liveComponent.value.id
    );
    if (sourceIndex !== -1 && targetIndex !== -1) {
      if (sourceIndex < targetIndex) {
        store.moveComponentAfter(moveId, liveComponent.value.id);
      } else {
        store.moveComponentBefore(moveId, liveComponent.value.id);
      }
    } else {
      store.swapComponents(moveId, liveComponent.value.id);
    }
  }
  // 不处理 newType，也不 stopPropagation，让事件冒泡到画布容器
}

// 根据鼠标 Y 坐标计算插入索引
function getInsertIndexByClientY(clientY: number): number {
  const rootItems = document.querySelectorAll(".root-item");
  if (rootItems.length === 0) return 0;

  const rects: { top: number; bottom: number }[] = [];
  rootItems.forEach((el) => {
    const rect = el.getBoundingClientRect();
    rects.push({ top: rect.top, bottom: rect.bottom });
  });

  if (clientY <= rects[0].top) return 0;
  if (clientY >= rects[rects.length - 1].bottom) return rects.length;

  for (let i = 0; i < rects.length; i++) {
    if (clientY < rects[i].bottom) {
      return i;
    }
  }
  return rects.length;
}

function handleDropToSlot(slotName: string, e: DragEvent) {
  const moveId = e.dataTransfer?.getData("moveComponentId");
  const newType = e.dataTransfer?.getData("componentType");
  if (moveId) {
    store.moveComponentToSlot(moveId, liveComponent.value.id, slotName);
  } else if (newType) {
    const newComp = createComponent(newType);
    store.addComponent(newComp, liveComponent.value.id, slotName);
  }
}

function handleDropToCol(colIndex: number, e: DragEvent) {
  const slotName = `col_${colIndex}`;
  const moveId = e.dataTransfer?.getData("moveComponentId");
  const newType = e.dataTransfer?.getData("componentType");
  if (moveId) {
    store.moveComponentToSlot(moveId, liveComponent.value.id, slotName);
  } else if (newType) {
    const newComp = createComponent(newType);
    store.addComponent(newComp, liveComponent.value.id, slotName);
  }
}

function createComponent(type: string): ComponentInstance {
  const config = componentList.find((c) => c.type === type);
  const newComp: ComponentInstance = {
    id: generateId(),
    type,
    props: { ...(config?.defaultProps || {}) },
    style: { ...(config?.defaultStyle || {}) },
  };
  if (type === "layout") {
    newComp.slots = { header: [], sidebar: [], content: [], footer: [] };
  }
  if (type === "grid") {
    const cols = Number(config?.defaultProps?.columns) || 2;
    newComp.slots = {};
    for (let i = 0; i < cols; i++) newComp.slots[`col_${i}`] = [];
  }
  if (type === "dialog") {
    newComp.slots = { content: [] };
  }
  return newComp;
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

function openIconPicker() {
  store.openIconPicker(liveComponent.value.id);
}

function startResize(e: MouseEvent) {
  const type = liveComponent.value.type;
  if (
    !isLayout.value &&
    !isGrid.value &&
    type !== "table" &&
    type !== "card" &&
    type !== "form"
  )
    return;
  e.stopPropagation();
  e.preventDefault();
  isResizing.value = true;
  startX = e.clientX;
  startY = e.clientY;
  const el = (e.target as HTMLElement).closest(".canvas-item");
  if (el) {
    const rect = el.getBoundingClientRect();
    startWidth = rect.width;
    startHeight = rect.height;
  } else {
    startWidth = 100;
    startHeight = 50;
  }
  document.addEventListener("mousemove", onResizeMove);
  document.addEventListener("mouseup", onResizeEnd);
}

function onResizeMove(e: MouseEvent) {
  if (!isResizing.value) return;
  const deltaX = e.clientX - startX;
  const deltaY = e.clientY - startY;
  const newWidth = Math.max(50, startWidth + deltaX);
  const newHeight = Math.max(30, startHeight + deltaY);
  store.updateStyle(liveComponent.value.id, {
    width: newWidth + "px",
    height: newHeight + "px",
  });
}

function onResizeEnd() {
  isResizing.value = false;
  document.removeEventListener("mousemove", onResizeMove);
  document.removeEventListener("mouseup", onResizeEnd);
}

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
  const colAlign = liveComponent.value.props?.colAlign || "top";
  const colJustify = liveComponent.value.props?.colJustify || "left";
  return {
    display: "flex",
    flexDirection: "column",
    alignItems: justifyMap[colJustify] || "flex-start",
    justifyContent: alignMap[colAlign] || "flex-start",
  };
}

const headerSlotStyle = computed(() => {
  const p = liveComponent.value.props || {};
  const alignMap: Record<string, string> = {
    left: "flex-start",
    center: "center",
    right: "flex-end",
  };
  const justify = alignMap[p.headerTextAlign || "left"] || "flex-start";
  return {
    height: p.headerHeight || "50px",
    minHeight: p.headerHeight || "50px",
    fontSize: (p.headerFontSize || 16) + "px",
    color: p.headerColor || "#ffffff",
    background: p.headerBgColor || "#409eff",
    padding: p.headerPadding || "8px 16px",
    fontWeight: p.headerFontWeight || "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: justify,
    gap: "8px",
  };
});

onBeforeUnmount(() => {
  document.removeEventListener("mousemove", onResizeMove);
  document.removeEventListener("mouseup", onResizeEnd);
});
</script>

<style scoped>
.canvas-item-wrapper {
  display: block;
  width: fit-content;
  max-width: 100%;
}
.canvas-item-wrapper.wrapper-container {
  display: block;
  width: 100%;
}

.canvas-item {
  position: relative;
  display: block;
  width: fit-content;
  max-width: 100%;
  padding: 8px;
  /* margin-bottom: 10px; */
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.canvas-item.is-container {
  width: 100%;
}

/* 工具栏绝对定位，不占用布局空间 */
.item-toolbar {
  position: absolute;
  top: -35px;
  right: -125px;
  z-index: 20;
  display: flex;
  flex-direction: row; /* 水平排列 */
  align-items: center;
  gap: 4px;
  padding: 2px 4px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.item-toolbar button {
  font-size: 12px;
  padding: 1px 6px;
  border: 1px solid #ccc;
  border-radius: 3px;
  background: white;
  cursor: pointer;
  white-space: nowrap;
}

.drag-handle {
  cursor: grab;
  font-size: 14px;
  color: #999;
  user-select: none;
  padding: 0 2px;
}

.item-type {
  display: none; /* 隐藏组件类型文字，保持工具栏简洁 */
}

/* 拖拽手柄样式 */
.drag-handle {
  cursor: grab;
  font-size: 14px;
  color: #999;
  user-select: none;
  padding: 0 2px;
}

.item-toolbar button {
  font-size: 12px;
  padding: 1px 6px;
  border: 1px solid #ccc;
  border-radius: 3px;
  background: white;
  cursor: pointer;
}
.canvas-item:hover {
  border-color: #bbb;
}
.canvas-item.selected {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}
.canvas-item.dragging {
  opacity: 0.5;
}
/* 全宽组件工具栏移到右上角 */
.canvas-item.full-width .item-toolbar {
  top: -35px;
  right: -125px;
  transform: none;
  flex-direction: row;
  align-items: center;
}
.item-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  padding-bottom: 4px;
  border-bottom: 1px dashed #ddd;
}
.drag-handle {
  cursor: grab;
  font-size: 18px;
  color: #999;
  user-select: none;
}
.drag-handle:active {
  cursor: grabbing;
}
.item-type {
  font-size: 12px;
  color: #666;
  flex: 1;
}
.item-toolbar button {
  font-size: 12px;
  padding: 2px 8px;
  border: 1px solid #ccc;
  border-radius: 3px;
  background: white;
  cursor: pointer;
}
.layout-editor {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.layout-main {
  display: flex;
  gap: 8px;
}
.slot-area {
  padding: 8px;
  border: 2px dashed #ccc;
  border-radius: 4px;
  min-height: 60px;
  background: #fafafa;
  transition: border-color 0.2s;
}
.slot-area:hover {
  border-color: #409eff;
}
/* .slot-header {
  background: #ecf5ff;
} */
.slot-sidebar {
  background: #f0f0f0;
  flex-shrink: 0;
}
.slot-content {
  background: #fff;
  flex: 1;
}
.slot-footer {
  background: #f0f0f0;
}
.slot-label {
  font-size: 11px;
  color: #999;
  margin-bottom: 6px;
  font-weight: bold;
  pointer-events: none;
}
.grid-editor {
  width: 100%;
}
.grid-col-area {
  padding: 8px;
  border: 2px dashed #dcdfe6;
  border-radius: 4px;
  min-height: 40px;
  background: #fafafa;
  transition: border-color 0.2s;
}
.grid-col-area:hover {
  border-color: #409eff;
}
.col-label {
  padding: 0;
  font-size: 8px;
  color: #999;
  margin-bottom: 6px;
  font-weight: bold;
  pointer-events: none;
}
.drop-hint {
  color: #bbb;
  text-align: center;
  padding: 15px;
  font-size: 12px;
  pointer-events: none;
}
.dialog-editor {
  min-width: 200px;
}
.slot-dialog-content {
  background: #fafafa;
  border: 2px dashed #ccc;
  border-radius: 4px;
  min-height: 80px;
  padding: 8px;
}
.resize-handle {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 16px;
  height: 16px;
  cursor: nwse-resize;
  background: transparent;
  z-index: 30;
}

.resize-handle::after {
  content: "";
  position: absolute;
  right: 3px;
  bottom: 3px;
  width: 8px;
  height: 8px;
  border-right: 2px solid #999;
  border-bottom: 2px solid #999;
}
</style>
