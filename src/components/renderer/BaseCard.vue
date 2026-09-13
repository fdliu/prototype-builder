<template>
  <el-card style="width: 100%; height: 100%">
    <template #header>{{ props.title }}</template>
    <div style="height: 100%">{{ props.content }}</div>
  </el-card>
</template>

<script setup lang="ts">
defineProps<{ props: Record<string, any> }>();
</script>
