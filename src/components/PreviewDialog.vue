<template>
  <el-dialog
    :title="isFullscreen ? '预览（全屏）' : '预览'"
    v-model="dialogVisible"
    :width="isFullscreen ? '100%' : '80%'"
    :top="isFullscreen ? '0' : '5vh'"
    :fullscreen="isFullscreen"
    :append-to-body="true"
    destroy-on-close
    class="preview-dialog"
  >
    <template #header>
      <div class="preview-header">
        <span class="preview-title">预览</span>
        <div class="preview-actions">
          <el-button size="small" @click="toggleFullscreen">
            {{ isFullscreen ? "还原" : "全屏" }}
          </el-button>
        </div>
      </div>
    </template>

    <iframe :srcdoc="htmlContent" :style="iframeStyle"></iframe>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps<{ modelValue: boolean; htmlContent: string }>();
const emit = defineEmits<{ (e: "update:modelValue", value: boolean): void }>();

const isFullscreen = ref(false);

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const iframeStyle = computed(() => {
  if (isFullscreen.value) {
    return "width: 100%; height: calc(100vh - 120px); border: none;";
  }
  return "width: 100%; height: 70vh; border: none; border-radius: 4px;";
});

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value;
}
</script>

<style scoped>
.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.preview-title {
  font-size: 16px;
  font-weight: bold;
}
.preview-actions {
  margin-right: 30px;
}

/* 全屏时调整弹窗内容区域高度 */
:deep(.el-dialog__body) {
  padding: 10px 20px;
}
</style>
