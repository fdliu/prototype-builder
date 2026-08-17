<template>
  <el-button :type="props.type">{{ props.text }}</el-button>
</template>

<script setup lang="ts">
defineProps<{ props: Record<string, any> }>();
</script>