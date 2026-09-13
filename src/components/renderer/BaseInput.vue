<template>
  <div class="base-input" :class="{ 'label-top': isLabelTop }">
    <el-label v-if="props.props.label" class="input-label" :style="labelStyle">
      <el-icon v-if="prefixIconComponent" class="label-icon">
        <component :is="prefixIconComponent" />
      </el-icon>
      <span>{{ props.props.label }}</span>
      <el-icon v-if="suffixIconComponent" class="label-icon">
        <component :is="suffixIconComponent" />
      </el-icon>
    </el-label>
    <el-input :placeholder="props.props.placeholder" class="input-field" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import * as Icons from "@element-plus/icons-vue";

const props = defineProps<{ props: Record<string, any> }>();

const isLabelTop = computed(() => props.props.labelPosition === "top");

const labelStyle = computed(() => {
  const width = props.props.labelWidth;
  if (width && width !== "") {
    return {
      width: String(width) + "px",
      flexShrink: 0,
      textAlign: isLabelTop.value ? "left" : "right",
    };
  }
  return {};
});

const prefixIconComponent = computed(() => {
  const name = props.props.labelPrefixIcon;
  if (!name) return null;
  return (Icons as any)[name] || null;
});

const suffixIconComponent = computed(() => {
  const name = props.props.labelSuffixIcon;
  if (!name) return null;
  return (Icons as any)[name] || null;
});
</script>

<style scoped>
.base-input {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  max-width: 100%;
}
.input-label {
  text-align: right;
  margin-right: 8px;
  font-size: 14px;
  color: #606266;
  flex-shrink: 0;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.input-field {
  flex: 1;
}
.label-icon {
  font-size: 14px;
}

/* label 在上方 */
.base-input.label-top {
  flex-direction: column;
  align-items: stretch;
  width: 200px;
}
.base-input.label-top .input-label {
  width: auto !important;
  text-align: left;
  margin-right: 0;
  margin-bottom: 4px;
  flex-shrink: 0;
  white-space: normal;
}
</style>
