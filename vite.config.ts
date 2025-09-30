import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import legacy from '@vitejs/plugin-legacy'
import vueDevTools from 'vite-plugin-vue-devtools'
import autoprefixer from 'autoprefixer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    legacy({
      // 指定目标浏览器范围
      targets: ['defaults', 'not IE 11', 'chromeAndroid>=52', 'iOS>=13.1'],
      // 为现代浏览器添加必要的 Polyfill（此处需结合业务场景）
      modernPolyfills: ['es/promise', 'es/array'],
    }),
    vueDevTools(),
    AutoImport({
      imports: [
        'vue',
        /** 详见vue3--响应性语法糖（注：实验性功能） */
        // 'vue/macros',
        'vue-router',
      ],
      dirs: ['src/hooks/**/*'],
      eslintrc: {
        enabled: true,
        filepath: './.eslintrc-auto-import.json',
        globalsPropValue: true,
      },
      dts: './auto-import.d.ts',
    }),
    Components({
      // 指定组件位置，默认是src/components
      dirs: [
        'src/components/Model',
        'src/components/TableList',
        'src/components/Teleports',
        'src/components/Pagination',
        'src/components/Timer',
      ],
      // ui库解析器
      // resolvers: [ElementPlusResolver()],
      extensions: ['vue'],
      // 搜索子目录
      deep: false,

      // 配置文件生成位置
      dts: './components.d.ts',
    }),
  ],
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        additionalData: '@import "./src/styles/common.less";',
      },
    },
    postcss: {
      plugins: [
        /** 自动添加样式前缀 */
        autoprefixer({
          overrideBrowserslist: ['Android 4.1', 'iOS 7.1', 'Chrome > 31', 'ff > 31', 'ie > 10'],
          grid: true,
        }),
      ],
    },
  },
  // define: {
  //   // enable hydration mismatch details in production build
  //   __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true',
  // },
})
