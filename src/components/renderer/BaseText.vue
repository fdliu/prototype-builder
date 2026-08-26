<template>
    <div
      class="base-text"
      :style="textStyle"
    >
      {{ props.props.content }}
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  
  const props = defineProps<{ props: Record<string, any> }>();
  
  const textStyle = computed(() => {
    return {
      fontSize: (props.props.fontSize || 14) + 'px',
      color: props.props.color || '#333333',
      textAlign: props.props.textAlign || 'left',
      fontWeight: props.props.fontWeight || 'normal',
    };
  });
  </script>
  
  <style scoped>
  .base-text {
    word-break: break-word;
    line-height: 1.5;
  }
  </style>