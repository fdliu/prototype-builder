<template>
  <div class="base-input" :class="{ 'label-top': isLabelTop }">
    <label 
      v-if="props.props.label" 
      class="input-label"
      :style="labelStyle"
    >
      {{ props.props.label }}
    </label>
    <el-input :placeholder="props.props.placeholder" class="input-field" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ props: Record<string, any> }>();

const isLabelTop = computed(() => props.props.labelPosition === 'top');

const labelStyle = computed(() => {
  const width = props.props.labelWidth;
  if (width && !isLabelTop.value) {
    // 仅在 label 在左侧时应用宽度
    return { width: width + 'px', flexShrink: 0 };
  }
  return {};
});
</script>

<style scoped>
.base-input {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  width: 200px;
  max-width: 100%;
}
.input-label {
  text-align: right;
  margin-right: 8px;
  font-size: 14px;
  color: #606266;
  flex-shrink: 0;
  white-space: nowrap;        /* 防止换行，确保文字宽度 */
  /* 默认自适应，不设置宽度 */
}
.input-field {
  flex: 1;
}

/* label 在上方 */
.base-input.label-top {
  flex-direction: column;
  align-items: stretch;
  width: 200px;
}
.base-input.label-top .input-label {
  width: auto !important;      /* top 布局忽略 labelWidth */
  text-align: left;
  margin-right: 0;
  margin-bottom: 4px;
  flex-shrink: 0;
  white-space: normal;
}
</style>