<template>
  <el-dialog
    title="版本与付费"
    v-model="dialogVisible"
    width="940px"
    class="member-dialog"
  >
    <div class="plans">
      <div
        v-for="plan in plans"
        :key="plan.name"
        class="plan-card"
        :class="{ hot: plan.hot }"
      >
        <span v-if="plan.hot" class="hot-badge">推荐</span>
        <h3 class="plan-name">{{ plan.name }}</h3>
        <div class="plan-price">
          <template v-if="plan.durations">
            {{ currentPrice(plan).price }}<span class="plan-unit">{{ currentPrice(plan).unit }}</span>
          </template>
          <template v-else>
            {{ plan.price }}<span v-if="plan.unit" class="plan-unit">{{ plan.unit }}</span>
          </template>
        </div>
        <div v-if="plan.durations" class="duration-tabs">
          <span
            v-for="d in plan.durations"
            :key="d.key"
            class="duration-tab"
            :class="{ active: selectedDuration === d.key }"
            @click="selectedDuration = d.key"
          >{{ d.label }}</span>
        </div>
        <ul class="plan-features">
          <li v-for="f in plan.features" :key="f">{{ f }}</li>
        </ul>
        <button
          class="plan-btn"
          :class="{ primary: plan.hot }"
          @click="onPlanClick(plan)"
        >
          {{ plan.button }}
        </button>
      </div>
    </div>

    <div class="activate-panel">
      <template v-if="memberStore.isMember">
        <div class="activated">
          <span>✅ 已开通专业会员（{{ memberStore.expiryText }}）</span>
          <el-button size="small" @click="logout">退出登录</el-button>
        </div>
      </template>
      <template v-else>
        <div class="activate-row">
          <el-input
            v-model="licenseInput"
            placeholder="输入激活码，如 PB-XXXXXXXX-XXXXXX"
            @keyup.enter="activate"
          />
          <el-button type="primary" @click="activate">激活会员</el-button>
        </div>
        <p class="activate-hint">购买后获取激活码，输入即可解锁会员功能。</p>
      </template>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useMemberStore } from '../stores/member';

interface DurationOption {
  key: string;
  label: string;
  price: string;
  unit: string;
}

interface Plan {
  name: string;
  price: string;
  unit: string;
  features: string[];
  button: string;
  hot: boolean;
  durations?: DurationOption[];
}

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>();

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const memberStore = useMemberStore();
const licenseInput = ref('');
const selectedDuration = ref('year');

const plans: Plan[] = [
  {
    name: '免费版',
    price: '¥0',
    unit: '',
    features: ['基础组件库', '本地保存、JSON导入导出', '导出带水印HTML'],
    button: '免费体验',
    hot: false,
  },
  {
    name: '专业会员',
    price: '¥69',
    unit: '/月起',
    durations: [
      { key: 'month', label: '月卡', price: '¥69', unit: '/月' },
      { key: 'quarter', label: '季卡', price: '¥169', unit: '/季' },
      { key: 'year', label: '年卡', price: '¥599', unit: '/年' },
    ],
    features: [
      '无水印干净源码导出',
      '全部后台组件解锁',
      '项目快照、版本回滚',
      '密码分享原型链接',
    ],
    button: '立即升级',
    hot: true,
  },
  {
    name: '团队授权',
    price: '¥1999',
    unit: '/年',
    features: ['含专业会员全部能力', '团队空间、成员权限', '批量导出与模板'],
    button: '联系开通',
    hot: false,
  },
  {
    name: '私有化部署',
    price: '报价',
    unit: '/次',
    features: ['独立部署包、内网离线', '可嵌入自有系统', '定制行业组件包'],
    button: '咨询报价',
    hot: false,
  },
];

function close() {
  emit('update:modelValue', false);
}

function currentPrice(plan: Plan): { price: string; unit: string } {
  if (plan.durations && plan.durations.length > 0) {
    return (
      plan.durations.find((d) => d.key === selectedDuration.value) ||
      plan.durations[0]
    );
  }
  return { price: plan.price, unit: plan.unit };
}

function onPlanClick(plan: Plan) {
  if (plan.hot) {
    const p = currentPrice(plan);
    const label =
      plan.durations?.find((d) => d.key === selectedDuration.value)?.label || '';
    ElMessage.info(`${label} ${p.price}，付款后获取激活码，在下方输入开通`);
  } else {
    close();
  }
}

function activate() {
  const key = licenseInput.value.trim();
  if (!key) {
    ElMessage.warning('请输入激活码');
    return;
  }
  const result = memberStore.activate(key);
  if (result === 'ok') {
    ElMessage.success('会员激活成功');
    licenseInput.value = '';
  } else if (result === 'expired') {
    ElMessage.error('激活码已过期，请重新购买');
  } else {
    ElMessage.error('激活码无效，请检查后重试');
  }
}

function logout() {
  memberStore.logout();
  ElMessage.success('已退出会员');
}
</script>

<style scoped>
.member-dialog :deep(.el-dialog__header) {
  text-align: center;
  padding-bottom: 8px;
}
.member-dialog :deep(.el-dialog__title) {
  font-size: 20px;
  font-weight: 700;
}

.plans {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 14px;
  padding: 8px 0 4px;
}

.plan-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #e5e9f0;
  border-radius: 12px;
  padding: 22px 16px;
}
.plan-card.hot {
  border-color: #2563eb;
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.12);
}

.hot-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #2563eb;
  color: #fff;
  font-size: 12px;
  padding: 3px 12px;
  border-radius: 999px;
}

.plan-name {
  font-size: 16px;
  margin: 0 0 8px;
  text-align: center;
}

.plan-price {
  font-size: 30px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 14px;
}
.plan-unit {
  font-size: 14px;
  font-weight: 400;
  color: #6b7280;
}

.duration-tabs {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin: -4px 0 12px;
}
.duration-tab {
  font-size: 12px;
  padding: 4px 10px;
  border: 1px solid #dcdfe6;
  border-radius: 999px;
  color: #606266;
  cursor: pointer;
  transition: all 0.2s;
}
.duration-tab.active {
  background: #2563eb;
  border-color: #2563eb;
  color: #fff;
}

.plan-features {
  list-style: none;
  padding: 0;
  margin: 0 0 18px;
  flex: 1;
}
.plan-features li {
  font-size: 13px;
  color: #374151;
  padding: 5px 0 5px 20px;
  position: relative;
}
.plan-features li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #16a34a;
}

.plan-btn {
  width: 100%;
  padding: 10px 0;
  border-radius: 6px;
  border: 1px solid #2563eb;
  background: #fff;
  color: #2563eb;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}
.plan-btn:hover {
  background: #eff6ff;
}
.plan-btn.primary {
  background: #2563eb;
  color: #fff;
  border-color: #2563eb;
}
.plan-btn.primary:hover {
  background: #1d4ed8;
}

.activate-panel {
  margin-top: 20px;
  border-top: 1px solid #f0f0f0;
  padding-top: 16px;
}
.activate-row {
  display: flex;
  gap: 10px;
}
.activate-hint {
  color: #909399;
  font-size: 12px;
  margin: 8px 0 0;
}
.activated {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #67c23a;
  font-weight: 600;
}
</style>
