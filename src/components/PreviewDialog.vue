<template>
    <el-dialog
      title="预览"
      v-model="dialogVisible"
      width="80%"
      top="5vh"
      :append-to-body="true"
      destroy-on-close
    >
      <iframe
        :srcdoc="htmlContent"
        style="width: 100%; height: 70vh; border: none; border-radius: 4px;"
      ></iframe>
    </el-dialog>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  
  const props = defineProps<{ modelValue: boolean; htmlContent: string }>();
  const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>();
  
  const dialogVisible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
  });
  </script>