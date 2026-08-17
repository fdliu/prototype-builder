<template>
  <div class="base-input">
    <label>{{ props.label }}</label>
    <el-input :placeholder="props.placeholder" />
  </div>
</template>

<script setup lang="ts">
defineProps<{ props: Record<string, any> }>();
</script>

<style scoped>
.base-input {
  margin-bottom: 10px;
}
.base-input label {
  display: inline-block;
  width: 80px;
  text-align: right;
  margin-right: 8px;
}
</style>