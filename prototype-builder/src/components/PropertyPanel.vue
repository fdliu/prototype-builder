<template>
  <div class="property-panel">
    <h3>属性配置</h3>
    <div v-if="!selectedComponent" class="no-selection">请先选择一个组件</div>
    <el-tabs v-else>
      <el-tab-pane label="属性">
        <el-form label-width="100px">
          <el-form-item label="组件类型">
            <el-input :model-value="selectedComponent.type" disabled />
          </el-form-item>
          <el-form-item v-for="field in currentPropsConfig" :key="field.key" :label="field.label">
            <el-input v-if="field.type === 'input'"
              :model-value="selectedComponent.props[field.key]"
              @update:model-value="updateProp(field.key, $event)" />
            <el-input v-else-if="field.type === 'textarea'" type="textarea"
              :model-value="selectedComponent.props[field.key]"
              @update:model-value="updateProp(field.key, $event)" />
            <el-select v-else-if="field.type === 'select'"
              :model-value="selectedComponent.props[field.key]"
              @update:model-value="updateProp(field.key, $event)">
              <el-option v-for="opt in field.options" :key="opt" :label="opt" :value="opt" />
            </el-select>
            <el-input-number v-else-if="field.type === 'number'"
              :model-value="selectedComponent.props[field.key]"
              @update:model-value="updateProp(field.key, $event)"
              :min="0" :max="24" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="样式">
        <el-form label-width="90px">
          <el-form-item v-for="field in currentStyleConfig" :key="field.key" :label="field.label">
            <el-input v-if="field.type === 'input'"
              :model-value="getStyleValue(field.key)"
              @update:model-value="updateStyle(field.key, $event)"
              placeholder="如: 100px 或 50%" />
            <el-input-number v-else-if="field.type === 'number'"
              :model-value="Number(getStyleValue(field.key) || 0)"
              @update:model-value="updateStyle(field.key, $event)"
              :min="0" :max="500" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useEditorStore } from '../stores/editor';
import { componentList } from '../config/componentConfig';

const store = useEditorStore();
const selectedComponent = computed(() => store.selectedComponent);

const currentPropsConfig = computed(() => {
  if (!selectedComponent.value) return [];
  const config = componentList.find(c => c.type === selectedComponent.value!.type);
  return config?.propsConfig || [];
});
const currentStyleConfig = computed(() => {
  if (!selectedComponent.value) return [];
  const config = componentList.find(c => c.type === selectedComponent.value!.type);
  return config?.styleConfig || [];
});

function getStyleValue(key: string): string {
  if (!selectedComponent.value) return '';
  return selectedComponent.value.style?.[key] || '';
}

function updateProp(key: string, value: any) {
  if (!selectedComponent.value) return;
  const updates: Record<string, any> = { [key]: value };
  if (key === 'columns' && selectedComponent.value.type === 'grid') {
    const cols = Number(value) || 2;
    const span = Math.floor(24 / cols);
    const remainder = 24 - span * cols;
    const newSpans = Array(cols).fill(span);
    if (remainder > 0) newSpans[cols - 1] += remainder;
    updates.colSpans = newSpans;
  }
  store.updateProps(selectedComponent.value.id, updates);
}

function updateStyle(key: string, value: any) {
  if (selectedComponent.value) {
    store.updateStyle(selectedComponent.value.id, { [key]: String(value) });
  }
}
</script>

<style scoped>
.property-panel {
  width: 280px;
  background: #f5f5f5;
  padding: 15px;
  border-left: 1px solid #e0e0e0;
  overflow-y: auto;
}
.no-selection { color: #999; text-align: center; margin-top: 40px; }
</style>