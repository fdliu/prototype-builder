<template>
  <div class="property-panel">
    <h3>属性配置</h3>
    <div v-if="!selectedComponent" class="no-selection">
      请先选择一个组件
    </div>
    <el-form v-else label-width="100px">
      <el-form-item label="组件类型">
        <el-input :model-value="selectedComponent.type" disabled />
      </el-form-item>
      <el-form-item
        v-for="field in currentPropsConfig"
        :key="field.key"
        :label="field.label"
      >
        <el-input
          v-if="field.type === 'input'"
          :model-value="selectedComponent.props[field.key]"
          @update:model-value="updateProp(field.key, $event)"
        />
        <el-input-number
          v-else-if="field.type === 'number'"
          :model-value="selectedComponent.props[field.key]"
          @update:model-value="updateProp(field.key, $event)"
          :min="1"
          :max="24"
        />
        <el-input
            v-else-if="field.type === 'textarea'"
          type="textarea"
          :model-value="selectedComponent.props[field.key]"
          @update:model-value="updateProp(field.key, $event)"
        />
        <el-select
          v-else-if="field.type === 'select'"
          :model-value="selectedComponent.props[field.key]"
          @update:model-value="updateProp(field.key, $event)"
        >
          <el-option
            v-for="opt in field.options"
            :key="opt"
            :label="opt"
            :value="opt"
          />
        </el-select>
      </el-form-item>
    </el-form>
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
  const config = componentList.find((c) => c.type === selectedComponent.value!.type);
  return config?.propsConfig || [];
});

function updateProp(key: string, value: any) {
  if (selectedComponent.value) {
    const updates: Record<string, any> = { [key]: value };
    
    // 当修改 columns 时，自动更新 colSpans
    if (key === 'columns' && selectedComponent.value.type === 'grid') {
      const cols = Number(value) || 2;
      const span = Math.floor(24 / cols);
      const remainder = 24 - span * cols;
      const newSpans = Array(cols).fill(span);
      if (remainder > 0) {
        newSpans[cols - 1] += remainder;
      }
      updates.colSpans = newSpans;
    }
    
    store.updateProps(selectedComponent.value.id, updates);
  }
}
</script>

<style scoped>
.property-panel {
  width: 250px;
  background: #f5f5f5;
  padding: 15px;
  border-left: 1px solid #e0e0e0;
  overflow-y: auto;
}
.no-selection {
  color: #999;
  text-align: center;
  margin-top: 40px;
}
</style>