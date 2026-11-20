import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  // GitHub Pages 项目页部署在 /prototype-builder/ 子路径下，
  // 使用相对 base 可同时兼容根路径与子路径，避免资源 404 导致白屏
  base: "./",
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/variables.scss" as *;`,
      },
    },
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    open: false, // 禁用自动打开浏览器
    host: "0.0.0.0", // 允许外部访问（如果是远程服务器）
    port: 5173,
    allowedHosts: [
      "5173.app.cloudstudio.work",
      ".cloudstudio.work", // 允许所有 cloudstudio.work 子域名
    ],
  },
});
