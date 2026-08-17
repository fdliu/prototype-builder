import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    open: false,  // 禁用自动打开浏览器
    host: '0.0.0.0',  // 允许外部访问（如果是远程服务器）
    port: 5173,
    allowedHosts: [
      '5173.app.cloudstudio.work',
      '.cloudstudio.work',  // 允许所有 cloudstudio.work 子域名
    ],
  },
});