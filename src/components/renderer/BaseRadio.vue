<template>
  <div class="base-radio" :class="{ vertical: direction === 'vertical' }">
    <label v-if="props.props.label" class="field-label">{{ props.props.label }}</label>
    <el-radio-group v-model="localValue">
      <el-radio v-for="(opt, index) in options" :key="index" :value="opt">
        {{ opt }}
      </el-radio>
    </el-radio-group>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

const props = defineProps<{ props: Record<string, any> }>();

const options = computed<string[]>(() => {
  const opts = props.props.options;
  if (Array.isArray(opts)) return opts;
  if (typeof opts === 'string') {
    return opts
      .split(',')
      .map((s: string) => s.trim())
      .filter((s) => s);
  }
  return [];
});

const direction = computed(() => props.props.direction || 'horizontal');

const localValue = ref<any>(props.props.value ?? '');
watch(
  () => props.props.value,
  (v) => {
    localValue.value = v ?? '';
  },
  { immediate: true }
);
</script>

<style scoped>
.base-radio {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
  max-width: 100%;
}
.base-radio.vertical {
  align-items: flex-start;
}
.base-radio.vertical :deep(.el-radio-group) {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}
.field-label {
  font-size: 14px;
  color: #606266;
  flex-shrink: 0;
  white-space: nowrap;
}
</style>
