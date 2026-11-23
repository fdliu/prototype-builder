<template>
  <el-dialog title="项目快照" v-model="dialogVisible" width="500px">
    <div class="snapshot-new">
      <el-input
        v-model="snapName"
        placeholder="快照名称（可选）"
        @keyup.enter="saveSnapshot"
      />
      <el-button type="primary" @click="saveSnapshot">保存当前</el-button>
    </div>

    <div class="snapshot-list">
      <div v-if="store.snapshots.length === 0" class="empty">
        暂无快照，点击上方「保存当前」创建第一个版本。
      </div>
      <div v-for="s in store.snapshots" :key="s.id" class="snapshot-item">
        <div class="snapshot-meta">
          <div class="snapshot-name">{{ s.name }}</div>
          <div class="snapshot-time">{{ formatTime(s.time) }}</div>
        </div>
        <el-button size="small" @click="restore(s.id)">恢复</el-button>
        <el-button size="small" type="danger" @click="remove(s.id)">删除</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useEditorStore } from '../stores/editor';

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>();

const store = useEditorStore();
const snapName = ref('');

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

function saveSnapshot() {
  store.saveSnapshot(snapName.value.trim());
  snapName.value = '';
}

function restore(id: string) {
  store.restoreSnapshot(id);
  emit('update:modelValue', false);
}

function remove(id: string) {
  store.deleteSnapshot(id);
}

function formatTime(t: number): string {
  const d = new Date(t);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}
</script>

<style scoped>
.snapshot-new {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}
.snapshot-list {
  max-height: 320px;
  overflow-y: auto;
}
.empty {
  text-align: center;
  color: #909399;
  padding: 24px 0;
}
.snapshot-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 4px;
  border-bottom: 1px solid #f0f0f0;
}
.snapshot-meta {
  flex: 1;
  min-width: 0;
}
.snapshot-name {
  font-size: 14px;
  color: #303133;
}
.snapshot-time {
  font-size: 12px;
  color: #909399;
  margin-top: 2px;
}
</style>
