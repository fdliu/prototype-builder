<template>
  <el-dialog title="导出" v-model="dialogVisible" width="460px">
    <div class="export-buttons">
      <el-button type="primary" @click="handleExportJSON">导出 JSON</el-button>
      <el-button type="success" @click="handleExportHTML">
        {{ memberStore.isMember ? '导出 HTML（无水印）' : '导出 HTML（带水印）' }}
      </el-button>
      <el-button type="warning" @click="handleExportPassword">密码分享导出</el-button>
    </div>
    <p v-if="!memberStore.isMember" class="export-tip">
      🔒 升级会员可导出无水印 HTML、使用密码分享。
    </p>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ElMessageBox } from 'element-plus';
import { useEditorStore } from '../stores/editor';
import { useMemberStore } from '../stores/member';
import { exportJSON, exportHTML, exportPasswordHTML } from '../utils/export';

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'open-member'): void;
}>();

const store = useEditorStore();
const memberStore = useMemberStore();

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

function handleExportJSON() {
  exportJSON(store.components);
}

function handleExportHTML() {
  exportHTML(store.components, {
    watermark: memberStore.isMember ? undefined : '原型工厂',
  });
}

function handleExportPassword() {
  if (!memberStore.isMember) {
    emit('open-member');
    return;
  }
  ElMessageBox.prompt('请输入访问密码（用于加密分享）', '密码分享', {
    inputType: 'password',
    confirmButtonText: '导出',
    cancelButtonText: '取消',
  })
    .then(({ value }) => {
      if (value) exportPasswordHTML(store.components, value);
    })
    .catch(() => {});
}
</script>

<style scoped>
.export-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  padding: 16px 0 8px;
}
.export-tip {
  text-align: center;
  color: #e6a23c;
  font-size: 13px;
  margin: 0 0 8px;
}
</style>
