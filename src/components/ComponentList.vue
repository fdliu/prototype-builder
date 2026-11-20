<template>
  <div class="component-list">
    <div class="section-header" @click="showComponents = !showComponents">
      <span class="header-icon">🧩</span>
      <span class="header-title">组件库</span>
      <span class="chevron" :class="{ open: showComponents }">▾</span>
    </div>
    <div v-show="showComponents" class="section-body">
      <el-tooltip
        v-for="comp in componentList"
        :key="comp.type"
        :content="comp.premium ? '需要开通会员' : '拖动到中间内容区'"
        placement="right"
        effect="dark"
      >
        <div
          class="component-item"
          :class="{ 'is-premium': comp.premium }"
          :draggable="!comp.premium"
          @dragstart="onDragStart($event, comp)"
        >
          <span class="item-icon">{{ componentIcons[comp.type] || '▪' }}</span>
          <span class="item-label">{{ comp.name }}</span>
          <span v-if="comp.premium" class="lock-icon">🔒</span>
          <span v-if="comp.premium" class="premium-tag">会员</span>
          <span class="item-arrow">›</span>
        </div>
      </el-tooltip>
    </div>

    <div class="section-header" @click="showTemplates = !showTemplates">
      <span class="header-icon">📦</span>
      <span class="header-title">行业模版</span>
      <span class="chevron" :class="{ open: showTemplates }">▾</span>
    </div>
    <div v-show="showTemplates" class="section-body">
      <div
        v-for="tpl in industryTemplates"
        :key="tpl.key"
        class="template-item"
        @click="loadTemplate(tpl)"
      >
        <span class="item-icon">{{ templateIcons[tpl.key] || '▪' }}</span>
        <span class="item-label">{{ tpl.name }}</span>
        <span class="item-arrow">›</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { componentList } from '../config/componentConfig';
import { industryTemplates } from '../config/templates';
import type { TemplateDef } from '../config/templates';
import { useEditorStore } from '../stores/editor';
import type { ComponentConfig } from '../types';

const store = useEditorStore();
const showComponents = ref(true);
const showTemplates = ref(true);

const componentIcons: Record<string, string> = {
  layout: '🧩',
  grid: '🗂️',
  text: '🔤',
  link: '🔗',
  button: '🔘',
  input: '✏️',
  select: '📋',
  radio: '⚪',
  checkbox: '☑️',
  table: '📊',
  form: '📝',
  card: '🃏',
  dialog: '💬',
  icon: '⭐',
};

const templateIcons: Record<string, string> = {
  'gov-approval': '🏛️',
  'retail-inventory': '🏪',
  'device-ledger': '⚙️',
};

function onDragStart(e: DragEvent, comp: ComponentConfig) {
  if (comp.premium) {
    e.preventDefault();
    return;
  }
  if (e.dataTransfer) {
    e.dataTransfer.setData('componentType', comp.type);
    e.dataTransfer.effectAllowed = 'copy';
  }
}

function loadTemplate(tpl: TemplateDef) {
  store.loadTemplate(tpl.build());
}
</script>

<style scoped>
.component-list {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: #f5f5f5;
  padding: 12px;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
}

/* 一级标题：高亮块 + 右侧下拉箭头 */
.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  background: #409eff;
  border-radius: 6px;
  padding: 10px 12px;
  cursor: pointer;
  user-select: none;
}
.section-header + .section-body + .section-header {
  margin-top: 12px;
}
.section-header .chevron {
  margin-left: auto;
  font-size: 12px;
  transition: transform 0.2s;
}
.section-header .chevron.open {
  transform: rotate(180deg);
}

.section-body {
  margin-top: 8px;
}

/* 二级项：图标 + 文字 + 右侧箭头 */
.component-item,
.template-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  margin-bottom: 8px;
  background: #fff;
  border-radius: 4px;
  cursor: grab;
  user-select: none;
  text-align: left;
  transition: background 0.2s, border-color 0.2s;
}
.component-item {
  border: 1px solid #ddd;
}
.component-item:hover {
  background: #ecf5ff;
  border-color: #409eff;
}
.component-item:active { cursor: grabbing; }

.item-label {
  flex: 1;
  min-width: 0;
}
.item-arrow {
  color: #c0c4cc;
  font-size: 14px;
  line-height: 1;
}

/* 付费锁定：置灰 + 禁止拖拽 */
.component-item.is-premium {
  background: #f0f0f0;
  color: #a8abb2;
  border-color: #e0e0e0;
  cursor: not-allowed;
}
.component-item.is-premium:hover {
  background: #f0f0f0;
  border-color: #e0e0e0;
}

.lock-icon {
  font-size: 12px;
}
.premium-tag {
  font-size: 11px;
  color: #fff;
  background: #ff9a3d;
  border-radius: 3px;
  padding: 1px 5px;
  line-height: 1.4;
  flex-shrink: 0;
}

/* 行业模版二级项 */
.template-item {
  border: 1px solid #d9ecff;
  color: #2563eb;
  cursor: pointer;
}
.template-item:hover {
  background: #ecf5ff;
  border-color: #409eff;
}
</style>
