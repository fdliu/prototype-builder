<template>
  <el-card>
    <template #header>{{ props.title }}</template>
    <div>{{ props.content }}</div>
  </el-card>
</template>

<script setup lang="ts">
defineProps<{ props: Record<string, any> }>();
</script>