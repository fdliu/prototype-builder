<template>
  <!-- 文字链接类型 -->
  <template v-if="isTextLink">
    <a
      :href="props.props.link"
      :target="props.props.target || '_self'"
      :style="textLinkStyle"
      @click="handleClick"
    >
      {{ props.props.text }}
    </a>
  </template>

  <!-- 普通按钮 -->
  <el-button
    v-else
    :type="props.props.type === 'text' ? 'primary' : props.props.type"
    :link="props.props.type === 'text'"
    @click="handleClick"
  >
    {{ props.props.text }}
  </el-button>
</template>

<script setup lang="ts">
import { computed, inject } from "vue";

// 判断是否在编辑器中
const isEditing = inject("isEditing", false);
const props = defineProps<{ props: Record<string, any> }>();

const isTextLink = computed(() => {
  return props.props.type === "text" && props.props.link;
});

const textLinkStyle = computed(() => {
  return {
    color: props.props.linkColor || "#409eff",
    fontSize: (props.props.linkFontSize || 14) + "px",
    fontWeight: props.props.linkFontWeight || "normal",
    textDecoration: props.props.linkTextDecoration || "none",
    cursor: "pointer",
  };
});

function handleClick(e: MouseEvent) {
  if (isEditing || !props.props.link) {
    e.preventDefault();
    return;
  }
  // 如果有 target 为 _self，使用默认跳转；_blank 由浏览器默认处理
}
</script>

<style scoped>
.text-link {
  color: #409eff;
  text-decoration: none;
  cursor: pointer;
  font-size: 14px;
}
.text-link:hover {
  text-decoration: underline;
}
</style>
