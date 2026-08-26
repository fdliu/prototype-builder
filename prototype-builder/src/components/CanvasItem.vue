<template>
  <div class="canvas-item-wrapper" :class="{ 'wrapper-container': isLayout || isGrid }">
    <div
      class="canvas-item"
      :class="{
        selected: store.selectedId === component.id || store.multiSelectedIds.includes(component.id),
        'is-container': isLayout || isGrid,
        'full-width': isFullWidth
      }"
      @click.stop="store.select(component.id)"
      :style="componentStyle"
      draggable="true"
      @dragstart="onDragStart"
      @dragend="onDragEnd"
      @dragover.prevent.stop="onDragOver"
      @drop.prevent.stop="onDropToSelf"
    >
    <div class="item-toolbar" v-if="store.selectedId === component.id">
      <span class="drag-handle" @mousedown.stop>⋮⋮</span>
      <span class="item-type">{{ component.type }}</span>
      <button v-if="component.type === 'icon'" @click.stop="openIconPicker" style="font-size: 8px;">换图标</button>
      <button @click.stop="store.copyComponent(component.id)">复制</button>
      <button @click.stop="store.removeComponent(component.id)">删除</button>
    </div>

      <!-- Layout 容器 -->
      <div v-if="isLayout" class="layout-editor">
        <div class="slot-area slot-header"
             @dragover.prevent.stop
             @drop.prevent.stop="handleDropToSlot('header', $event)">
          <div class="slot-label">Header</div>
          <template v-for="child in getSlotComponents('header')" :key="child.id">
            <CanvasItem :component="child" :depth="depth + 1" />
          </template>
          <div v-if="!getSlotComponents('header').length" class="drop-hint">拖入组件到 Header</div>
        </div>
        <div class="layout-main">
          <div v-if="showSidebar" class="slot-area slot-sidebar"
               :style="{ width: component.props.sidebarWidth || '200px' }"
               @dragover.prevent.stop
               @drop.prevent.stop="handleDropToSlot('sidebar', $event)">
            <div class="slot-label">Sidebar</div>
            <template v-for="child in getSlotComponents('sidebar')" :key="child.id">
              <CanvasItem :component="child" :depth="depth + 1" />
            </template>
            <div v-if="!getSlotComponents('sidebar').length" class="drop-hint">拖入组件</div>
          </div>
          <div class="slot-area slot-content"
               @dragover.prevent.stop
               @drop.prevent.stop="handleDropToSlot('content', $event)">
            <div class="slot-label">Content</div>
            <template v-for="child in getSlotComponents('content')" :key="child.id">
              <CanvasItem :component="child" :depth="depth + 1" />
            </template>
            <div v-if="!getSlotComponents('content').length" class="drop-hint">拖入组件到 Content</div>
          </div>
        </div>
        <div class="slot-area slot-footer"
             @dragover.prevent.stop
             @drop.prevent.stop="handleDropToSlot('footer', $event)">
          <div class="slot-label">Footer</div>
          <template v-for="child in getSlotComponents('footer')" :key="child.id">
            <CanvasItem :component="child" :depth="depth + 1" />
          </template>
          <div v-if="!getSlotComponents('footer').length" class="drop-hint">拖入组件到 Footer</div>
        </div>
      </div>

      <!-- Grid 容器 -->
      <div v-else-if="isGrid" class="grid-editor">
        <el-row :gutter="gutter">
          <el-col v-for="(span, index) in colSpans" :key="index" :span="span">
            <div class="grid-col-area"
                 @dragover.prevent.stop
                 @drop.prevent.stop="handleDropToCol(index, $event)">
              <div class="col-label">列 {{ index + 1 }}（span: {{ span }}）</div>
              <template v-for="child in getColComponents(index)" :key="child.id">
                <CanvasItem :component="child" :depth="depth + 1" />
              </template>
              <div v-if="!getColComponents(index).length" class="drop-hint">拖入组件</div>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 普通组件 -->
      <div v-else>
        <component :is="getRenderer(component.type)" :props="component.props" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useEditorStore } from '../stores/editor';
import { getRenderer } from './renderer';
import { componentList } from '../config/componentConfig';
import type { ComponentInstance } from '../types';

const props = defineProps<{ component: ComponentInstance; depth: number }>();
const store = useEditorStore();
const isDragging = ref(false);

const isLayout = computed(() => props.component.type === 'layout');
const isGrid = computed(() => props.component.type === 'grid');

const showSidebar = computed(() => {
  const val = props.component.props?.showSidebar;
  if (val === undefined || val === null) return true;
  return val === 'true' || val === true;
});

const gutter = computed(() => Number(props.component.props?.gutter) || 0);

const colSpans = computed(() => {
  const cols = Number(props.component.props?.columns) || 2;
  const spans = props.component.props?.colSpans;
  let spanArray: number[] = [];
  if (Array.isArray(spans)) spanArray = spans.map(Number);
  else if (typeof spans === 'string' && spans.trim())
    spanArray = spans.split(',').map((s: string) => Number(s.trim()) || 12);
  if (spanArray.length !== cols) {
    const span = Math.floor(24 / cols);
    spanArray = Array(cols).fill(span);
    const remainder = 24 - span * cols;
    if (remainder > 0) spanArray[cols - 1] += remainder;
  }
  return spanArray;
});

const componentStyle = computed(() => {
  const style = props.component.style || {};
  const cssStyle: Record<string, string> = {};
  if (style.width) cssStyle.width = style.width;
  if (style.height) cssStyle.height = style.height;
  if (style.paddingTop) cssStyle.paddingTop = style.paddingTop + 'px';
  if (style.paddingRight) cssStyle.paddingRight = style.paddingRight + 'px';
  if (style.paddingBottom) cssStyle.paddingBottom = style.paddingBottom + 'px';
  if (style.paddingLeft) cssStyle.paddingLeft = style.paddingLeft + 'px';
  if (style.marginTop) cssStyle.marginTop = style.marginTop + 'px';
  if (style.marginRight) cssStyle.marginRight = style.marginRight + 'px';
  if (style.marginBottom) cssStyle.marginBottom = style.marginBottom + 'px';
  if (style.marginLeft) cssStyle.marginLeft = style.marginLeft + 'px';
  return cssStyle;
});

const isFullWidth = computed(() => {
  if (isLayout.value || isGrid.value) return true;
  const width = props.component.style?.width;
  return width === '100%' || width === '100%' || width === '100%';
});

function getSlotComponents(slotName: string): ComponentInstance[] {
  if (!props.component.slots) return [];
  return props.component.slots[slotName] || [];
}
function getColComponents(colIndex: number): ComponentInstance[] {
  if (!props.component.slots) return [];
  return props.component.slots[`col_${colIndex}`] || [];
}

function onDragStart(e: DragEvent) {
  e.stopPropagation(); // 阻止冒泡，避免父组件覆盖数据
  isDragging.value = true;
  if (e.dataTransfer) {
    e.dataTransfer.setData('moveComponentId', props.component.id);
    e.dataTransfer.effectAllowed = 'move';
  }
}
function onDragEnd() { isDragging.value = false; }
function onDragOver(e: DragEvent) {
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
}

function onDropToSelf(e: DragEvent) {
  const moveId = e.dataTransfer?.getData('moveComponentId');
  const newType = e.dataTransfer?.getData('componentType');

  if (moveId && moveId !== props.component.id) {
    const sourceIndex = store.components.findIndex(c => c.id === moveId);
    const targetIndex = store.components.findIndex(c => c.id === props.component.id);

    if (sourceIndex !== -1 && targetIndex !== -1) {
      // 根级组件之间排序：源在前则插入到目标后，源在后则插入到目标前
      if (sourceIndex < targetIndex) {
        store.moveComponentAfter(moveId, props.component.id);
      } else {
        store.moveComponentBefore(moveId, props.component.id);
      }
    } else {
      // 非根级组件回退为交换
      store.swapComponents(moveId, props.component.id);
    }
  } else if (newType) {
    const newComp = createComponent(newType);
    store.insertAfter(newComp, props.component.id);
  }
}

function handleDropToSlot(slotName: string, e: DragEvent) {
  const moveId = e.dataTransfer?.getData('moveComponentId');
  const newType = e.dataTransfer?.getData('componentType');
  if (moveId) {
    store.moveComponentToSlot(moveId, props.component.id, slotName);
  } else if (newType) {
    const newComp = createComponent(newType);
    store.addComponent(newComp, props.component.id, slotName);
  }
}

function handleDropToCol(colIndex: number, e: DragEvent) {
  const slotName = `col_${colIndex}`;
  const moveId = e.dataTransfer?.getData('moveComponentId');
  const newType = e.dataTransfer?.getData('componentType');
  if (moveId) {
    store.moveComponentToSlot(moveId, props.component.id, slotName);
  } else if (newType) {
    const newComp = createComponent(newType);
    store.addComponent(newComp, props.component.id, slotName);
  }
}

function createComponent(type: string): ComponentInstance {
  const config = componentList.find(c => c.type === type);
  const newComp: ComponentInstance = {
    id: generateId(),
    type,
    props: { ...(config?.defaultProps || {}) },
    style: { ...(config?.defaultStyle || {}) },
  };
  if (type === 'layout') {
    newComp.slots = { header: [], sidebar: [], content: [], footer: [] };
  }
  if (type === 'grid') {
    const cols = Number(config?.defaultProps?.columns) || 2;
    newComp.slots = {};
    for (let i = 0; i < cols; i++) newComp.slots[`col_${i}`] = [];
  }
  return newComp;
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

function openIconPicker() {
  store.openIconPicker(props.component.id);
}
</script>

<style scoped>
.canvas-item-wrapper {
  display: inline-block;
  width: fit-content;
  max-width: 100%;
  vertical-align: top;
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
  margin-bottom: 10px;
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
  top: 50%;
  right: -50px;
  transform: translateY(-50%);
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 2px;
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
.canvas-item:hover { border-color: #bbb; }
.canvas-item.selected {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}
.canvas-item.dragging { opacity: 0.5; }
/* 全宽组件工具栏移到右上角 */
.canvas-item.full-width .item-toolbar {
  top: 4px;
  right: 4px;
  transform: none;
  flex-direction: row;      /* 可选：水平排列，更紧凑 */
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
.drag-handle:active { cursor: grabbing; }
.item-type { font-size: 12px; color: #666; flex: 1; }
.item-toolbar button {
  font-size: 12px;
  padding: 2px 8px;
  border: 1px solid #ccc;
  border-radius: 3px;
  background: white;
  cursor: pointer;
}
.layout-editor { display: flex; flex-direction: column; gap: 8px; }
.layout-main { display: flex; gap: 8px; }
.slot-area {
  padding: 8px;
  border: 2px dashed #ccc;
  border-radius: 4px;
  min-height: 60px;
  background: #fafafa;
  transition: border-color 0.2s;
}
.slot-area:hover { border-color: #409eff; }
.slot-header { background: #ecf5ff; }
.slot-sidebar { background: #f0f0f0; flex-shrink: 0; }
.slot-content { background: #fff; flex: 1; }
.slot-footer { background: #f0f0f0; }
.slot-label {
  font-size: 11px;
  color: #999;
  margin-bottom: 6px;
  font-weight: bold;
  pointer-events: none;
}
.grid-editor { width: 100%; }
.grid-col-area {
  padding: 8px;
  border: 2px dashed #dcdfe6;
  border-radius: 4px;
  min-height: 80px;
  background: #fafafa;
  transition: border-color 0.2s;
}
.grid-col-area:hover { border-color: #409eff; }
.col-label {
  font-size: 11px;
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
</style>