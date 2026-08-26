<template>
    <el-dialog
      title="选择图标"
      v-model="dialogVisible"
      width="600px"
      :append-to-body="true"
    >
      <el-input
        v-model="searchText"
        placeholder="搜索图标名称"
        clearable
        style="margin-bottom: 12px;"
      />
      <div class="icon-grid">
        <div
          v-for="iconName in filteredIcons"
          :key="iconName"
          class="icon-item"
          :class="{ active: iconName === selectedIcon }"
          @click="handleSelect(iconName)"
        >
          <el-icon :size="24">
            <component :is="getIcon(iconName)" />
          </el-icon>
          <span class="icon-name">{{ iconName }}</span>
        </div>
      </div>
    </el-dialog>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import * as Icons from '@element-plus/icons-vue';
  
  const props = defineProps<{ modelValue: boolean }>();
  const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void; (e: 'select', iconName: string): void }>();
  
  const dialogVisible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
  });
  
  const searchText = ref('');
  const selectedIcon = ref('');
  
  const allIcons = Object.keys(Icons);
  
  const filteredIcons = computed(() => {
    const keyword = searchText.value.trim().toLowerCase();
    if (!keyword) return allIcons;
    return allIcons.filter(name => name.toLowerCase().includes(keyword));
  });
  
  function getIcon(name: string) {
    return (Icons as any)[name];
  }
  
  function handleSelect(iconName: string) {
    selectedIcon.value = iconName;
    emit('select', iconName);
    dialogVisible.value = false;
  }
  </script>
  
  <style scoped>
  .icon-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    max-height: 400px;
    overflow-y: auto;
  }
  .icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 80px;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .icon-item:hover {
    border-color: #409eff;
    background: #ecf5ff;
  }
  .icon-item.active {
    border-color: #409eff;
    background: #ecf5ff;
  }
  .icon-name {
    font-size: 12px;
    margin-top: 4px;
    word-break: break-all;
    text-align: center;
  }
  </style>