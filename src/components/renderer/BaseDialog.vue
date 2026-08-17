<template>
  <div>
    <el-button @click="dialogVisible = true">{{ props.triggerText }}</el-button>
    <el-dialog v-model="dialogVisible" :title="props.title">
      <p>弹窗内容</p>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{ props: Record<string, any> }>();
const dialogVisible = ref(false);
</script>