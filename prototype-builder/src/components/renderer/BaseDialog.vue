<template>
  <div>
    <el-button @click="dialogVisible = true">{{ props.triggerText }}</el-button>
    <el-dialog v-model="dialogVisible" :title="props.title">
      <!-- 默认插槽接收外部传入的内容 -->
      <slot />
      <!-- 如果没有传入内容，显示默认占位 -->
      <p v-if="!$slots.default">弹窗内容</p>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{ props: Record<string, any> }>();
const dialogVisible = ref(false);
</script>