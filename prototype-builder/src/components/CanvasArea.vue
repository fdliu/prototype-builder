<template>
  <div
    class="canvas-area"
    @dragover.prevent
    @drop="onDrop"
    ref="canvasRef"
  >
    <div v-if="store.components.length === 0" class="empty-tip">
      从左侧拖拽组件到这里
    </div>
    <template v-for="comp in store.components" :key="comp.id">
      <CanvasItem :component="comp" :depth="0" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useEditorStore } from '../stores/editor';
import CanvasItem from './CanvasItem.vue';
import Sortable from 'sortablejs';

const store = useEditorStore();
const canvasRef = ref<HTMLElement | null>(null);

function onDrop(e: DragEvent) {
  const type = e.dataTransfer?.getData('componentType');
  if (!type) return;
  
  const defaultProps = getDefaultProps(type);
  const newComp: any = {
    id: generateId(),
    type,
    props: { ...defaultProps },
  };
  
  if (type === 'layout') {
    newComp.slots = { header: [], sidebar: [], content: [], footer: [] };
  }
  if (type === 'grid') {
    const cols = Number(defaultProps.columns) || 2;
    newComp.slots = {};
    for (let i = 0; i < cols; i++) {
      newComp.slots[`col_${i}`] = [];
    }
  }
  
  store.addComponent(newComp);
}

function getDefaultProps(type: string): Record<string, any> {
  const configs: Record<string, any> = {
    layout: { header: '后台管理系统', sidebar: 'true', sidebarWidth: '200px', content: '内容区域' },
    grid: { columns: 2, gutter: 10, colSpans: [12, 12] },
    button: { text: '按钮', type: 'primary' },
    input: { placeholder: '请输入', label: '输入框' },
    table: { columns: ['姓名', '年龄'], data: [['张三', 28], ['李四', 32]] },
    form: { fields: ['姓名', '邮箱'] },
    card: { title: '卡片标题', content: '卡片内容' },
    dialog: { title: '弹窗标题', triggerText: '打开弹窗' },
  };
  return configs[type] || {};
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

onMounted(() => {
  if (canvasRef.value) {
    Sortable.create(canvasRef.value, {
      animation: 150,
      handle: '.drag-handle',
      onEnd: (evt) => {
        if (evt.oldIndex !== undefined && evt.newIndex !== undefined) {
          store.reorder(evt.oldIndex, evt.newIndex);
        }
      },
    });
  }
});
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