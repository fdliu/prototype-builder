<template>
    <div class="base-icon" :style="iconStyle">
      <el-icon :size="size" :color="color">
        <component :is="iconComponent" v-if="iconComponent" />
        <span v-else>图标不存在</span>
      </el-icon>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  import * as Icons from '@element-plus/icons-vue';
  
  const props = defineProps<{ props: Record<string, any> }>();
  
  const iconName = computed(() => props.props.iconName || '');
  const size = computed(() => Number(props.props.size) || 16);
  const color = computed(() => props.props.color || '#333333');
  
  const iconComponent = computed(() => {
    if (!iconName.value) return null;
    return (Icons as any)[iconName.value] || null;
  });
  
  const iconStyle = computed(() => {
    return {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size.value + 'px',
      color: color.value,
    };
  });
  </script>
  
  <style scoped>
  .base-icon {
    line-height: 1;
  }
  </style>