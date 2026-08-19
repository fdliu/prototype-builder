<template>
  <div class="base-input" :class="{ 'label-top': isLabelTop }">
    <label v-if="props.props.label" class="input-label">{{ props.props.label }}</label>
    <el-input :placeholder="props.props.placeholder" class="input-field" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ props: Record<string, any> }>();

const isLabelTop = computed(() => {
  return props.props.labelPosition === 'top';
});
</script>

<style scoped>
.base-input {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  width: 100%;
}
.input-label {
  width: 80px;
  text-align: right;
  margin-right: 8px;
  font-size: 14px;
  color: #606266;
  flex-shrink: 0;
}
.input-field {
  flex: 1;
}

/* label 在上方 */
.base-input.label-top {
  flex-direction: column;
  align-items: stretch;
}
.base-input.label-top .input-label {
  width: auto;
  text-align: left;
  margin-right: 0;
  margin-bottom: 4px;
}
</style>