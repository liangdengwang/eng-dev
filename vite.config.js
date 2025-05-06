import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import viteCompression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  const env = loadEnv(mode, process.cwd())
  const isAnalyze = mode === 'analyze'

  const plugins = [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: ['vue', 'vue-router']
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    tailwindcss(),
    // gzip压缩
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz',
    }),
  ]

  // 在分析模式下添加可视化插件
  if (isAnalyze) {
    plugins.push(
      visualizer({
        open: true,
        filename: 'stats.html',
        gzipSize: true,
        brotliSize: true,
      })
    )
  }

  return {
    plugins,
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    build: {
      // 启用压缩
      minify: 'terser',
      terserOptions: {
        compress: {
          // 移除 console
          drop_console: true,
          drop_debugger: true,
        },
      },
      // 分块策略
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          manualChunks: {
            vue: ['vue', 'vue-router'],
            elementPlus: ['element-plus'],
            echarts: ['echarts'],
          }
        }
      },
      // 启用 CSS 代码分割
      cssCodeSplit: true,
      // 启用源码映射（生产环境可以设为 false）
      sourcemap: false,
      // 设置块大小警告的限制（单位：kb）
      chunkSizeWarningLimit: 1000
    },
    server: {
      port: 3000,
      open: true,
      cors: true,
    },
    base: '/eng-dev'
  }
})

