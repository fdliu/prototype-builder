<template>
  <a
    class="base-link"
    :href="props.props.href || '#'"
    target="_blank"
    :style="linkStyle"
    @click.prevent
  >
    {{ props.props.content }}
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { linkColorMap } from '../../config/componentConfig';

const props = defineProps<{ props: Record<string, any> }>();

const linkStyle = computed(() => {
  return {
    fontSize: (props.props.fontSize || 14) + 'px',
    color: linkColorMap[props.props.color] || '#409eff',
    textAlign: props.props.textAlign || 'left',
    fontWeight: props.props.fontWeight || 'normal',
    textDecoration: 'underline',
  };
});
</script>

<style scoped>
.base-link {
  cursor: pointer;
  word-break: break-word;
  line-height: 1.5;
}
</style>
