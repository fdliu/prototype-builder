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
          {{ plan.price }}<span v-if="plan.unit" class="plan-unit">{{ plan.unit }}</span>
        </div>
        <ul class="plan-features">
          <li v-for="f in plan.features" :key="f">{{ f }}</li>
        </ul>
        <button
          class="plan-btn"
          :class="{ primary: plan.hot }"
          @click="close"
        >
          {{ plan.button }}
        </button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Plan {
  name: string;
  price: string;
  unit: string;
  features: string[];
  button: string;
  hot: boolean;
}

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>();

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

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
    unit: '/月',
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
</style>
