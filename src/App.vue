<template>
  <div class="app-container">
    <header class="header">
      <h1>原型工场</h1>
      <div class="header-actions">
        <button class="intro-btn" @click="introVisible = true">✨ 产品介绍</button>
        <button class="member-btn" @click="memberDialogVisible = true">👑 付费会员</button>
        <button class="snapshot-btn" @click="openSnapshot">📸 快照</button>
        <el-button type="danger" @click="clearCanvas">清空内容区</el-button>
        <template v-if="store.multiSelectedIds.length > 1">
          <el-button type="warning" @click="batchCopy">批量复制</el-button>
          <el-button type="danger" @click="batchDelete">批量删除</el-button>
        </template>
        <el-button @click="undo" :disabled="!canUndo">撤销</el-button>
        <el-button @click="redo" :disabled="!canRedo">重做</el-button>
        <el-button @click="openPreview">预览</el-button>
        <el-button type="primary" @click="exportDialogVisible = true">导出</el-button>
      </div>
    </header>

    <div class="main">
      <!-- 左侧面板折叠按钮（始终可见） -->
      <div
        class="panel-toggle left-toggle"
        :style="{ left: showLeftPanel ? '200px' : '0px' }"
        @click="toggleLeftPanel"
      >
        <span v-if="showLeftPanel">⟨</span>
        <span v-else>⟩</span>
      </div>

      <!-- 左侧组件面板 -->
      <div class="left-panel" :style="{ width: showLeftPanel ? '200px' : '0px' }">
        <div class="panel-inner">
          <ComponentList @open-member="memberDialogVisible = true" />
        </div>
      </div>

      <!-- 中间画布 -->
      <CanvasArea />

      <!-- 右侧属性面板 -->
      <div class="right-panel" :style="{ width: showRightPanel ? '280px' : '0px' }">
        <div class="panel-inner">
          <PropertyPanel />
        </div>
      </div>

      <!-- 右侧面板折叠按钮（始终可见） -->
      <div
        class="panel-toggle right-toggle"
        :style="{ right: showRightPanel ? '280px' : '0px' }"
        @click="toggleRightPanel"
      >
        <span v-if="showRightPanel">⟩</span>
        <span v-else>⟨</span>
      </div>
    </div>

    <ExportDialog
      v-model="exportDialogVisible"
      @open-member="memberDialogVisible = true"
    />
    <IconPicker
      v-model="store.iconPickerVisible"
      @select="handleIconSelect"
    />
    <PreviewDialog v-model="previewVisible" :html-content="previewHTML" />
    <ProductIntro v-model="introVisible" />
    <MemberDialog v-model="memberDialogVisible" />
    <SnapshotDialog v-model="snapshotVisible" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useEditorStore } from './stores/editor';
import ComponentList from './components/ComponentList.vue';
import CanvasArea from './components/CanvasArea.vue';
import PropertyPanel from './components/PropertyPanel.vue';
import ExportDialog from './components/ExportDialog.vue';
import IconPicker from './components/IconPicker.vue';
import PreviewDialog from './components/PreviewDialog.vue';
import ProductIntro from './components/ProductIntro.vue';
import MemberDialog from './components/MemberDialog.vue';
import SnapshotDialog from './components/SnapshotDialog.vue';
import { useMemberStore } from './stores/member';
import { generateHTML } from './utils/export';

const store = useEditorStore();
const memberStore = useMemberStore();
const exportDialogVisible = ref(false);
const introVisible = ref(false);
const memberDialogVisible = ref(false);
const snapshotVisible = ref(false);

const showLeftPanel = ref(true);
const showRightPanel = ref(true);
const previewVisible = ref(false);
const previewHTML = ref('');

function toggleLeftPanel() {
  showLeftPanel.value = !showLeftPanel.value;
}
function toggleRightPanel() {
  showRightPanel.value = !showRightPanel.value;
}

// 自动展开右侧属性面板
watch(
  () => store.selectedId,
  (newId) => {
    if (newId && !showRightPanel.value) {
      showRightPanel.value = true;
    }
  }
);

const canUndo = computed(() => store.history.length > 0);
const canRedo = computed(() => store.future.length > 0);

function undo() { store.undo(); }
function redo() { store.redo(); }
function clearCanvas() { store.clearCanvas(); }
function batchCopy() { store.batchCopy(); }
function batchDelete() { store.batchDelete(); }
function openSnapshot() {
  if (memberStore.isMember) {
    snapshotVisible.value = true;
  } else {
    memberDialogVisible.value = true;
  }
}
function handleIconSelect(iconName: string) {
  store.selectIcon(iconName);
}

function openPreview() {
  previewHTML.value = generateHTML(store.components);
  previewVisible.value = true;
}
onMounted(() => {
  store.loadFromLocal();
  store.loadSnapshots();
  memberStore.init();
});
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
}

.intro-btn {
  border: none;
  background: #ecf5ff;
  color: #2563eb;
  font-size: 14px;
  padding: 6px 14px;
  margin-right: 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}
.intro-btn:hover {
  background: #d9ecff;
}

.member-btn {
  border: none;
  background: linear-gradient(135deg, #ffb03a, #ff7a00);
  color: #fff;
  font-size: 14px;
  padding: 6px 14px;
  margin-right: 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: filter 0.2s;
}
.member-btn:hover {
  filter: brightness(1.06);
}

.snapshot-btn {
  border: none;
  background: #f0f2f5;
  color: #606266;
  font-size: 14px;
  padding: 6px 14px;
  margin-right: 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}
.snapshot-btn:hover {
  background: #e4e7ed;
}

.main {
  flex: 1;
  display: flex;
  position: relative;
  overflow: hidden;
}

/* 面板折叠按钮 */
.panel-toggle {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 22px;
  height: 60px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 0 4px 4px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 50;
  user-select: none;
  transition: left 0.3s ease, right 0.3s ease, background 0.2s;
}
.panel-toggle:hover {
  background: #ecf5ff;
  border-color: #409eff;
}
.panel-toggle span {
  font-size: 16px;
  color: #606266;
}

/* 左侧面板 */
.left-panel {
  width: 200px;
  flex-shrink: 0;
  overflow: hidden;
  transition: width 0.3s ease;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
}
/* 右侧面板 */
.right-panel {
  width: 280px;
  flex-shrink: 0;
  overflow: hidden;
  transition: width 0.3s ease;
  background: #f5f5f5;
}

/* 内部内容宽度固定，避免面板变窄时挤压 */
.panel-inner {
  width: 100%;
  height: 100%;
}
.left-panel .panel-inner {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
.right-panel .panel-inner {
  width: 100%;
  height: 100%;
  overflow-y: auto;        /* 内容滚动交给内部面板 */
}

/* 画布自动占满剩余空间 */
.canvas-area {
  flex: 1;
}
</style>