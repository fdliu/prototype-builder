<template>
  <el-form label-width="80px">
    <el-form-item v-for="(field, index) in fields" :key="index" :label="field">
      <el-input />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ props: Record<string, any> }>();

const fields = computed(() => {
  const f = props.props.fields;
  if (Array.isArray(f)) return f;
  if (typeof f === 'string') return f.split(',').map((s: string) => s.trim());
  return [];
});
</script>