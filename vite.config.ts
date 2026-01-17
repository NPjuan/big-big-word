import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import vuetify from 'vite-plugin-vuetify'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    tailwindcss(),
    vuetify({
      styles: {
        configFile: 'src/styles/settings.scss',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // 隐藏构建警告
    rollupOptions: {
      onwarn(warning, warn) {
        // 忽略所有警告
        // 如果你想只忽略特定警告，可以这样写：
        // if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return
        // if (warning.code === 'CIRCULAR_DEPENDENCY') return
        // 否则显示警告
        // warn(warning)

        // 完全忽略所有警告
        return
      },
    },
    // 减少控制台输出，提高 chunk 大小警告阈值
    chunkSizeWarningLimit: 1000,
    // 静默模式
    reportCompressedSize: false,
  },
  // 开发服务器也减少日志
  logLevel: 'error',
})
