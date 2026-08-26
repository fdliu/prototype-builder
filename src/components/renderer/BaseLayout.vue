<template>
  <div class="base-layout">
    <!-- 顶部插槽区域 -->
    <div class="layout-header">
      <slot name="header">
        <span>{{ props.props.header }}</span>
      </slot>
    </div>

    <div class="layout-body">
      <!-- 侧边栏插槽区域 -->
      <div v-if="showSidebar" class="layout-sidebar" :style="{ width: props.props.sidebarWidth || '200px' }">
        <slot name="sidebar">
          <div class="sidebar-item">菜单项 1</div>
          <div class="sidebar-item">菜单项 2</div>
        </slot>
      </div>

      <!-- 内容插槽区域 -->
      <div class="layout-content">
        <slot name="content">
          <span>内容区域</span>
        </slot>
      </div>
    </div>

    <!-- 底部插槽区域 -->
    <div class="layout-footer">
      <slot name="footer">
        <span>底部区域</span>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ props: { header?: string; sidebarWidth?: string; showSidebar?: boolean | string };   }>();

const showSidebar = computed(() => {
  const val = props.props.showSidebar;
  // 默认显示侧边栏
  if (val === undefined || val === null) return true;
  return val === 'true' || val === true;
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

.layout-header {
  min-height: 50px;
  background: #409eff;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 16px;
  font-weight: bold;
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