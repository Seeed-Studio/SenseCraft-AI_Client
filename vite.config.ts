import { defineConfig, splitVendorChunkPlugin } from "vite"
import path from "path"
import wasm from "vite-plugin-wasm"
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import topLevelAwait from 'vite-plugin-top-level-await'
import { TDesignResolver } from "unplugin-vue-components/resolvers"
// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [
    vue(),
    wasm(),
    topLevelAwait(),
    AutoImport({
      resolvers: [
        TDesignResolver({
          library: "vue-next"
        })
      ]
    }),
    Components({
      resolvers: [
        TDesignResolver({
          library: "vue-next"
        })
      ]
    }),
    splitVendorChunkPlugin()
  ],
  resolve: {
    alias: {
      "@renderer": path.resolve("src"),
      // 'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
    },
    extensions: [".ts", ".js", ".vue"]
  },
  define: {
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: false,
    __INTLIFY_PROD_DEVTOOLS__: false
  },

  // prevent vite from obscuring rust errors
  clearScreen: false,
  server: {
    port: 1430,
    strictPort: true,
    host: true
  },
  preview: {
    host: true
  },
  envPrefix: ["VITE_"],
  build: {
    target: "chrome105",
    // don't minify for debug builds
    minify: true,
    // produce sourcemaps for debug builds
    sourcemap: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        frame: path.resolve(__dirname, 'frame.html'),
      },
    },
  },
}));
