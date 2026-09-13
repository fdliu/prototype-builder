<template>
  <div class="base-form" style="width: 100%; height: 100%; overflow: auto">
    <el-form
      :label-position="labelPosition"
      :label-width="labelPosition === 'top' ? 'auto' : '80px'"
    >
      <el-form-item
        v-for="(field, index) in parsedFields"
        :key="index"
        :label="field.label"
      >
        <el-input v-if="field.type === 'input' || !field.type" />
        <el-select
          v-else-if="field.type === 'select'"
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option
            v-for="opt in field.options || []"
            :key="opt"
            :label="opt"
            :value="opt"
          />
        </el-select>
        <el-radio-group v-else-if="field.type === 'radio'">
          <el-radio
            v-for="opt in field.options || []"
            :key="opt"
            :label="opt"
            >{{ opt }}</el-radio
          >
        </el-radio-group>
        <el-checkbox-group v-else-if="field.type === 'checkbox'">
          <el-checkbox
            v-for="opt in field.options || []"
            :key="opt"
            :label="opt"
            >{{ opt }}</el-checkbox
          >
        </el-checkbox-group>
        <el-input v-else />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ props: Record<string, any> }>();

const labelPosition = computed(() => {
  return props.props.labelPosition === "top" ? "top" : "left";
});

interface FormField {
  label: string;
  type?: string;
  options?: string[];
}

const parsedFields = computed<FormField[]>(() => {
  const config = props.props.fieldsConfig;
  if (config && typeof config === "string") {
    try {
      const parsed = JSON.parse(config);
      if (Array.isArray(parsed)) {
        return parsed.map((item: any) => ({
          label: item.label || "字段",
          type: item.type || "input",
          options: Array.isArray(item.options) ? item.options : [],
        }));
      }
    } catch (e) {}
  }
  const fields = props.props.fields;
  if (Array.isArray(fields))
    return fields.map((f: string) => ({ label: f, type: "input" }));
  if (typeof fields === "string")
    return fields
      .split(",")
      .map((s: string) => ({ label: s.trim(), type: "input" }))
      .filter((f) => f.label);
  return [];
});
</script>
<style scoped>
.base-form {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
</style>
