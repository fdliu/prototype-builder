<template>
  <div v-if="modelValue" class="intro-overlay">
    <button class="intro-close" aria-label="关闭" @click="close">×</button>

    <div class="intro-page">
      <!-- Hero -->
      <section class="hero">
        <div class="hero-inner">
          <span class="hero-badge">后台原型 · 页面脚手架工具</span>
          <h1 class="hero-title">拖拽搭后台原型，一键导出可运行源码</h1>
          <p class="hero-sub">产出可直接打开、可二次开发的 HTML / Vue 页面，而不是只能看的原型稿。</p>
          <div class="hero-cta">
            <button class="btn btn-primary" @click="close">开始创作</button>
            <button class="btn btn-ghost" @click="scrollTo('pricing')">查看付费方案</button>
          </div>
          <p class="hero-note">本地优先 · 离线可用 · 可私有化部署</p>
        </div>
      </section>

      <!-- 核心价值 -->
      <section class="section">
        <h2 class="section-title">和传统原型工具不一样</h2>
        <div class="feature-grid">
          <div class="feature-card">
            <div class="feature-icon">🔒</div>
            <h3>本地优先</h3>
            <p>原型数据保存在浏览器本地，方案不上云、不泄密。</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">⚡</div>
            <h3>源码级导出</h3>
            <p>一键导出干净 HTML / Vue3 代码，前端直接继续开发。</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📦</div>
            <h3>可私有化</h3>
            <p>轻量 PWA，内网离线可用，支持独立部署到自有环境。</p>
          </div>
        </div>
      </section>

      <!-- 谁在用 -->
      <section class="section section-alt">
        <h2 class="section-title">适合谁</h2>
        <div class="audience-list">
          <span class="audience-chip">👨‍💻 独立外包 / 前端工作室</span>
          <span class="audience-chip">🏢 无专职 UI 的小团队</span>
          <span class="audience-chip">📋 ToB 服务商 / 实施商</span>
          <span class="audience-chip">🏛️ 政企 / 工厂信息化</span>
          <span class="audience-chip">📦 低代码平台集成</span>
        </div>
      </section>

      <!-- 版本与付费 -->
      <section id="pricing" class="section">
        <h2 class="section-title">版本与付费</h2>
        <div class="pricing-grid">
          <div class="price-card">
            <h3>免费版</h3>
            <div class="price">¥0</div>
            <ul>
              <li>基础组件库</li>
              <li>本地保存、JSON 导入导出</li>
              <li>导出带水印 HTML</li>
            </ul>
            <button class="btn btn-outline" @click="close">免费体验</button>
          </div>
          <div class="price-card hot">
            <span class="hot-badge">推荐</span>
            <h3>专业会员</h3>
            <div class="price">¥69<span class="price-unit">/月</span></div>
            <ul>
              <li>无水印干净源码导出</li>
              <li>全部后台组件解锁</li>
              <li>项目快照、版本回滚</li>
              <li>密码分享原型链接</li>
            </ul>
            <button class="btn btn-primary" @click="close">立即升级</button>
          </div>
          <div class="price-card">
            <h3>团队授权</h3>
            <div class="price">¥1999<span class="price-unit">/年</span></div>
            <ul>
              <li>含专业会员全部能力</li>
              <li>团队空间、成员权限</li>
              <li>批量导出与模板</li>
            </ul>
            <button class="btn btn-outline" @click="close">联系开通</button>
          </div>
          <div class="price-card">
            <h3>私有化部署</h3>
            <div class="price">报价<span class="price-unit">/次</span></div>
            <ul>
              <li>独立部署包、内网离线</li>
              <li>可嵌入自有系统</li>
              <li>定制行业组件包</li>
            </ul>
            <button class="btn btn-outline" @click="scrollTo('contact')">咨询报价</button>
          </div>
        </div>
      </section>

      <!-- 行业模板 -->
      <section class="section section-alt">
        <h2 class="section-title">行业模板</h2>
        <div class="template-tags">
          <span>政务审批</span>
          <span>工厂 MES</span>
          <span>进销存</span>
          <span>OA 审批</span>
          <span>项目工单</span>
        </div>
      </section>

      <!-- FAQ -->
      <section class="section">
        <h2 class="section-title">常见问题</h2>
        <div class="faq-list">
          <div class="faq-item">
            <h3>这是低代码平台吗？</h3>
            <p>不是，我们定位「原型 + 脚手架」，优先做方案演示和快速生成初始页面源码。</p>
          </div>
          <div class="faq-item">
            <h3>数据安全吗？</h3>
            <p>默认本地存储；云分享是可选功能，私有化版本数据完全在你内网。</p>
          </div>
          <div class="faq-item">
            <h3>会做精细设计协同吗？</h3>
            <p>不会，我们聚焦「可运行原型 + 源码导出」，不跟专业设计工具内卷。</p>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section id="contact" class="cta">
        <h2>给甲方演示，直接交付能跑的原型</h2>
        <button class="btn btn-light" @click="close">立即开始</button>
      </section>

      <footer class="intro-footer">原型工场 BuilderPro · Vue3 + Vite · 本地优先</footer>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>();

function close() {
  emit('update:modelValue', false);
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}
</script>

<style scoped>
.intro-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #f5f7fa;
  overflow-y: auto;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Microsoft YaHei', sans-serif;
  color: #1f2937;
}
.intro-close {
  position: fixed;
  top: 16px;
  right: 20px;
  z-index: 10000;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: rgba(31, 41, 55, 0.75);
  color: #fff;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  transition: background 0.2s;
}
.intro-close:hover {
  background: #111827;
}
.intro-page {
  max-width: 1080px;
  margin: 0 auto;
}

/* Hero */
.hero {
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  color: #fff;
  padding: 64px 24px;
  text-align: center;
}
.hero-inner {
  max-width: 720px;
  margin: 0 auto;
}
.hero-badge {
  display: inline-block;
  padding: 6px 14px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 999px;
  font-size: 13px;
}
.hero-title {
  margin: 18px 0 14px;
  font-size: 36px;
  line-height: 1.25;
  font-weight: 700;
}
.hero-sub {
  font-size: 16px;
  line-height: 1.7;
  opacity: 0.92;
  margin: 0 auto;
  max-width: 560px;
}
.hero-cta {
  margin-top: 24px;
  display: flex;
  gap: 14px;
  justify-content: center;
  flex-wrap: wrap;
}
.hero-note {
  margin-top: 18px;
  font-size: 13px;
  opacity: 0.75;
}

/* Buttons */
.btn {
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-primary {
  background: #2563eb;
  color: #fff;
}
.btn-primary:hover {
  background: #1d4ed8;
}
.btn-ghost {
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.5);
}
.btn-ghost:hover {
  background: rgba(255, 255, 255, 0.26);
}
.btn-outline {
  background: #fff;
  color: #2563eb;
  border: 1px solid #2563eb;
}
.btn-outline:hover {
  background: #eff6ff;
}
.btn-light {
  background: #fff;
  color: #2563eb;
}
.btn-light:hover {
  background: #f0f5ff;
}

/* Sections */
.section {
  padding: 44px 24px;
}
.section-alt {
  background: #fff;
}
.section-title {
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  margin: 0 0 24px;
}

/* Features */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}
.feature-card {
  background: #fff;
  border: 1px solid #eef0f3;
  border-radius: 12px;
  padding: 22px;
}
.feature-icon {
  font-size: 28px;
  margin-bottom: 10px;
}
.feature-card h3 {
  font-size: 16px;
  margin: 0 0 8px;
}
.feature-card p {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

/* Audience */
.audience-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}
.audience-chip {
  padding: 10px 18px;
  background: #f8fafc;
  border: 1px solid #e5e9f0;
  border-radius: 999px;
  font-size: 14px;
}

/* Pricing */
.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  align-items: stretch;
}
.price-card {
  position: relative;
  background: #fff;
  border: 1px solid #eef0f3;
  border-radius: 12px;
  padding: 22px 18px;
  display: flex;
  flex-direction: column;
}
.price-card.hot {
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
.price-card h3 {
  font-size: 16px;
  margin: 0 0 8px;
  text-align: center;
}
.price {
  font-size: 30px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 14px;
}
.price-unit {
  font-size: 14px;
  font-weight: 400;
  color: #6b7280;
}
.price-card ul {
  list-style: none;
  padding: 0;
  margin: 0 0 18px;
  flex: 1;
}
.price-card li {
  font-size: 13px;
  color: #374151;
  padding: 5px 0 5px 20px;
  position: relative;
}
.price-card li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #16a34a;
}

/* Templates */
.template-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}
.template-tags span {
  padding: 10px 18px;
  background: #f8fafc;
  border: 1px solid #e5e9f0;
  border-radius: 999px;
  font-size: 14px;
}

/* FAQ */
.faq-list {
  max-width: 720px;
  margin: 0 auto;
}
.faq-item {
  padding: 16px 0;
  border-bottom: 1px solid #eef0f3;
}
.faq-item h3 {
  font-size: 15px;
  margin: 0 0 6px;
}
.faq-item p {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.7;
  margin: 0;
}

/* CTA */
.cta {
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  color: #fff;
  text-align: center;
  padding: 56px 24px;
}
.cta h2 {
  font-size: 24px;
  margin: 0 0 20px;
}
.intro-footer {
  text-align: center;
  padding: 22px;
  color: #9ca3af;
  font-size: 13px;
}
</style>
