<template>
  <div class="base-select" :class="{ 'label-top': isLabelTop }">
    <label 
      v-if="props.props.label" 
      class="select-label"
      :style="labelStyle"
    >
      {{ props.props.label }}
    </label>
    <el-select :placeholder="props.props.placeholder" class="select-field">
      <el-option
        v-for="(option, index) in options"
        :key="index"
        :label="option"
        :value="option"
      />
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ props: Record<string, any> }>();

const options = computed(() => {
  const opts = props.props.options;
  if (Array.isArray(opts)) return opts;
  if (typeof opts === 'string') {
    return opts.split(',').map((s: string) => s.trim()).filter(s => s);
  }
  return [];
});

const isLabelTop = computed(() => props.props.labelPosition === 'top');

const labelStyle = computed(() => {
  const width = props.props.labelWidth;
  if (width && !isLabelTop.value) {
    return { width: width + 'px', flexShrink: 0 };
  }
  return {};
});
</script>

<style scoped>
.base-select {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  width: 200px;
  max-width: 100%;
}
.select-label {
  text-align: right;
  margin-right: 8px;
  font-size: 14px;
  color: #606266;
  flex-shrink: 0;
  white-space: nowrap;
}
.select-field {
  flex: 1;
}

/* label 在上方 */
.base-select.label-top {
  flex-direction: column;
  align-items: stretch;
  width: 200px;
}
.base-select.label-top .select-label {
  width: auto !important;
  text-align: left;
  margin-right: 0;
  margin-bottom: 4px;
  flex-shrink: 0;
  white-space: normal;
}
</style>