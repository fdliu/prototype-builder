<template>
  <div class="base-layout">
    <div class="layout-header" :style="headerStyle">
      <slot name="header">
        <span>{{ props.header }}</span>
      </slot>
    </div>
    <div class="layout-body">
      <div
        v-if="showSidebar"
        class="layout-sidebar"
        :style="{ width: props.sidebarWidth || '200px' }"
      >
        <slot name="sidebar">
          <div class="sidebar-item">菜单项 1</div>
          <div class="sidebar-item">菜单项 2</div>
        </slot>
      </div>
      <div class="layout-content">
        <slot name="content">
          <span>内容区域</span>
        </slot>
      </div>
    </div>
    <div class="layout-footer">
      <slot name="footer">
        <span>底部区域</span>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ props: Record<string, any> }>();

const showSidebar = computed(() => {
  const val = props.props.showSidebar;
  if (val === undefined || val === null) return true;
  return val === "true" || val === true;
});

const headerStyle = computed(() => {
  const p = props.props;
  return {
    height: p.headerHeight || "50px",
    fontSize: (p.headerFontSize || 16) + "px",
    color: p.headerColor || "#ffffff",
    background: p.headerBgColor || "#409eff",
    padding: p.headerPadding || "0 16px",
    fontWeight: p.headerFontWeight || "bold",
    textAlign: p.headerTextAlign || "left",
    display: "flex",
    alignItems: "center",
  };
});
</script>

<style scoped>
.base-layout {
  width: 100%;
  min-height: 300px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.layout-body {
  display: flex;
  flex: 1;
  min-height: 200px;
}
.layout-sidebar {
  background: #f5f5f5;
  border-right: 1px solid #e0e0e0;
  padding: 10px 0;
  flex-shrink: 0;
}
.sidebar-item {
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
}
.sidebar-item:hover {
  background: #e0e0e0;
}
.layout-content {
  flex: 1;
  padding: 16px;
  background: #fff;
}
.layout-footer {
  min-height: 40px;
  background: #f5f5f5;
  border-top: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  padding: 0 16px;
  font-size: 13px;
  color: #666;
}
</style>
