<template>
  <div class="base-checkbox" :class="{ vertical: direction === 'vertical' }">
    <label v-if="props.props.label" class="field-label">{{ props.props.label }}</label>
    <el-checkbox-group v-model="localValue">
      <el-checkbox v-for="(opt, index) in options" :key="index" :value="opt">
        {{ opt }}
      </el-checkbox>
    </el-checkbox-group>
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

function normalize(v: any): string[] {
  if (Array.isArray(v)) return v.map((x) => String(x));
  if (typeof v === 'string') {
    return v
      .split(',')
      .map((s: string) => s.trim())
      .filter((s) => s);
  }
  return [];
}

const localValue = ref<string[]>(normalize(props.props.value));
watch(
  () => props.props.value,
  (v) => {
    localValue.value = normalize(v);
  },
  { immediate: true }
);
</script>

<style scoped>
.base-checkbox {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
  max-width: 100%;
}
.base-checkbox.vertical {
  align-items: flex-start;
}
.base-checkbox.vertical :deep(.el-checkbox-group) {
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
