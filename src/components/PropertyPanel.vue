<template>
  <div class="property-panel">
    <h3>属性配置</h3>
    <div v-if="!selectedComponent" class="no-selection">请先选择一个组件</div>
    <el-tabs v-else>
      <!-- 属性 Tab -->
      <el-tab-pane label="属性">
        <!-- 通用属性（form 组件除外） -->
        <el-form v-if="!isForm" label-width="100px">
          <el-form-item label="组件类型">
            <el-input :model-value="selectedComponent.type" disabled />
          </el-form-item>
          <el-form-item
            v-for="field in currentPropsConfig"
            :key="field.key"
            :label="field.label"
          >
            <div v-if="field.type === 'input'">
              <el-input
                :model-value="selectedComponent.props[field.key]"
                @update:model-value="updateProp(field.key, $event)"
              />
              <el-button
                v-if="field.key === 'iconName'"
                size="small"
                @click="openIconPicker"
                >选择图标</el-button
              >
            </div>
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
            <el-input-number
              v-else-if="field.type === 'number'"
              :model-value="Number(selectedComponent.props[field.key]) || 0"
              @update:model-value="updateProp(field.key, $event)"
              :min="0"
              :max="200"
            />
          </el-form-item>
        </el-form>

        <!-- Form 组件高级字段配置 -->
        <div v-else class="form-fields-editor">
          <div class="label-position-row">
            <span>标签位置：</span>
            <el-radio-group v-model="labelPosition" @change="syncLabelPosition">
              <el-radio label="left">左边</el-radio>
              <el-radio label="top">上边</el-radio>
            </el-radio-group>
          </div>
          <div class="fields-header">
            <span>字段配置</span>
            <el-button size="small" type="primary" @click="addField"
              >+ 添加字段</el-button
            >
          </div>
          <div
            v-for="(field, index) in formFields"
            :key="index"
            class="field-item"
          >
            <el-input
              v-model="field.label"
              placeholder="字段名称"
              class="field-label-input"
              @change="syncFormFields"
            />
            <el-select
              v-model="field.type"
              class="field-type-select"
              @change="syncFormFields"
            >
              <el-option label="输入框" value="input" />
              <el-option label="选择框" value="select" />
              <el-option label="多选框" value="checkbox" />
            </el-select>
            <el-input
              v-if="field.type === 'select' || field.type === 'checkbox'"
              v-model="field.optionsText"
              placeholder="选项，逗号分隔"
              class="field-options-input"
              @change="syncFormFields"
            />
            <el-button size="small" type="danger" @click="removeField(index)">
              删除
            </el-button>
          </div>
        </div>
      </el-tab-pane>

      <!-- 样式 Tab -->
      <el-tab-pane label="样式">
        <el-form label-width="90px">
          <el-form-item
            v-for="field in currentStyleConfig"
            :key="field.key"
            :label="field.label"
          >
            <el-input
              v-if="field.type === 'input'"
              :model-value="getStyleValue(field.key)"
              @update:model-value="updateStyle(field.key, $event)"
              placeholder="如: 100px 或 50%"
            />
            <el-input-number
              v-else-if="field.type === 'number'"
              :model-value="Number(getStyleValue(field.key) || 0)"
              @update:model-value="updateStyle(field.key, $event)"
              :min="0"
              :max="500"
            />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useEditorStore } from "../stores/editor";
import { componentList } from "../config/componentConfig";

const store = useEditorStore();
const selectedComponent = computed(() => store.selectedComponent);

const currentPropsConfig = computed(() => {
  if (!selectedComponent.value) return [];
  const config = componentList.find(
    (c) => c.type === selectedComponent.value!.type
  );
  return config?.propsConfig || [];
});
const currentStyleConfig = computed(() => {
  if (!selectedComponent.value) return [];
  const config = componentList.find(
    (c) => c.type === selectedComponent.value!.type
  );
  return config?.styleConfig || [];
});

const isForm = computed(() => selectedComponent.value?.type === "form");

// 表单字段列表（本地状态）
interface FormFieldItem {
  label: string;
  type: string;
  optionsText: string;
}
const formFields = ref<FormFieldItem[]>([]);
const labelPosition = ref("left");

// 在 watch 中初始化 labelPosition
watch(
  () => selectedComponent.value?.id,
  () => {
    if (isForm.value && selectedComponent.value) {
      formFields.value = parseFormFields(selectedComponent.value.props);
      labelPosition.value =
        selectedComponent.value.props.labelPosition || "left";
    } else {
      formFields.value = [];
      labelPosition.value = "left";
    }
  },
  { immediate: true }
);

function syncLabelPosition() {
  if (selectedComponent.value?.type === "form") {
    store.updateProps(selectedComponent.value.id, {
      labelPosition: labelPosition.value,
    });
  }
}
// 监听选中组件变化，初始化表单字段
watch(
  () => selectedComponent.value?.id,
  () => {
    if (isForm.value && selectedComponent.value) {
      formFields.value = parseFormFields(selectedComponent.value.props);
    } else {
      formFields.value = [];
    }
  },
  { immediate: true }
);

function parseFormFields(props: Record<string, any>): FormFieldItem[] {
  // 优先从 fieldsConfig 解析
  const config = props.fieldsConfig;
  if (config && typeof config === "string") {
    try {
      const parsed = JSON.parse(config);
      if (Array.isArray(parsed)) {
        return parsed.map((item: any) => ({
          label: item.label || "字段",
          type: item.type || "input",
          optionsText: Array.isArray(item.options)
            ? item.options.join(",")
            : "",
        }));
      }
    } catch (e) {}
  }
  // 回退到 fields 简单模式
  const fields = props.fields;
  if (Array.isArray(fields)) {
    return fields.map((f: string) => ({
      label: f,
      type: "input",
      optionsText: "",
    }));
  }
  if (typeof fields === "string") {
    return fields
      .split(",")
      .map((s: string) => ({ label: s.trim(), type: "input", optionsText: "" }))
      .filter((f) => f.label);
  }
  return [];
}

function addField() {
  formFields.value.push({
    label: `字段${formFields.value.length + 1}`,
    type: "input",
    optionsText: "",
  });
  syncFormFields();
}

function removeField(index: number) {
  formFields.value.splice(index, 1);
  syncFormFields();
}

function syncFormFields() {
  if (!selectedComponent.value || selectedComponent.value.type !== "form")
    return;
  const fields = formFields.value.map((f) => ({
    label: f.label,
    type: f.type,
    options: f.optionsText
      ? f.optionsText
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s)
      : [],
  }));
  store.updateProps(selectedComponent.value.id, {
    fieldsConfig: JSON.stringify(fields),
    fields: fields.map((f) => f.label).join(","),
  });
}

function getStyleValue(key: string): string {
  if (!selectedComponent.value) return "";
  return selectedComponent.value.style?.[key] || "";
}

function updateProp(key: string, value: any) {
  if (!selectedComponent.value) return;
  const updates: Record<string, any> = { [key]: value };
  if (key === "columns" && selectedComponent.value.type === "grid") {
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

function openIconPicker() {
  if (selectedComponent.value) {
    store.openIconPicker(selectedComponent.value.id);
  }
}
</script>

<style scoped lang="scss">
.property-panel {
  width: 100%;
  box-sizing: border-box;
  background: #f5f5f5;
  padding: 15px;
  padding-right: 35px;
  border-left: 1px solid #e0e0e0;
  overflow-y: auto;

  :deep(.el-form-item__label) {
    align-items: center;
    font-size: 12px;
    line-height: 1.3;
  }
}
.no-selection {
  color: #999;
  text-align: center;
  margin-top: 40px;
}

.form-fields-editor {
  padding: 8px 0;
}
.fields-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.field-item {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
}
.field-label-input {
  flex: 1;
  min-width: 80px;
}
.field-type-select {
  width: 100px;
}
.field-options-input {
  flex: 1;
  min-width: 120px;
}
.label-position-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.label-position-row span {
  margin-right: 8px;
  font-size: 14px;
  color: #606266;
}
</style>
