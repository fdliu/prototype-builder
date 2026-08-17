<template>
  <div
    class="canvas-area"
    @dragover.prevent
    @drop="onDrop"
    ref="canvasRef"
  >
    <div
      v-for="(comp, index) in store.components"
      :key="comp.id"
      class="canvas-item"
      :class="{ selected: store.selectedId === comp.id }"
      @click.stop="store.select(comp.id)"
    >
      <div class="item-actions" v-if="store.selectedId === comp.id">
        <button @click.stop="store.copyComponent(comp.id)">复制</button>
        <button @click.stop="store.removeComponent(comp.id)">删除</button>
      </div>
      <component :is="getRenderer(comp.type)" :props="comp.props" />
    </div>
    <div v-if="store.components.length === 0" class="empty-tip">
      从左侧拖拽组件到这里
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useEditorStore } from '../stores/editor';
import { getRenderer } from './renderer';
import Sortable from 'sortablejs';

const store = useEditorStore();
const canvasRef = ref<HTMLElement | null>(null);

function onDrop(e: DragEvent) {
  const type = e.dataTransfer?.getData('componentType');
  if (!type) return;
  const defaultProps = getDefaultProps(type);
  const newComp = {
    id: generateId(),
    type,
    props: { ...defaultProps },
  };
  store.addComponent(newComp);
}

function getDefaultProps(type: string): Record<string, any> {
  // 从配置中获取默认属性，可简化：直接 hardcode 或导入 config
  const configs: Record<string, any> = {
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
.canvas-item {
  position: relative;
  padding: 8px;
  margin-bottom: 10px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}
.canvas-item.selected {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}
.item-actions {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 10;
  display: flex;
  gap: 5px;
}
.item-actions button {
  font-size: 12px;
  padding: 2px 8px;
  border: 1px solid #ccc;
  border-radius: 3px;
  background: white;
  cursor: pointer;
}
.empty-tip {
  color: #999;
  text-align: center;
  padding: 40px;
  font-size: 16px;
}
</style>