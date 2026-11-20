import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// 必须锁定 5.4.1：5.4.2+ 依赖 Vite 5.0.0 没有的 config.decodedBase，polyfill 路径会丢掉开头的 /，深层路径白屏
import legacy from '@vitejs/plugin-legacy'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import dotenv from 'dotenv'
import purgeCss from 'rollup-plugin-purgecss'
// import { visualizer } from 'rollup-plugin-visualizer'
import { pwa } from '@pwa-platform/vite'
import { IDENTITY, INSTALL, POLICY, REGISTRY } from './pwa.config.ts'

import vitePluginBundleObfuscator from 'vite-plugin-bundle-obfuscator'
import JSConfuser from 'js-confuser'
import { readFileSync, writeFileSync } from 'fs'
import { versionTabletProfileHtml } from './build/tablet-profile-version.mjs'
import browserslist from 'browserslist'
import { resolveUpgradeBanner } from './scripts/upgrade-banner.mjs'

const pathSrc = path.resolve(__dirname, 'src')

// 浏览器支持下限，唯一来源是根目录的 browser-support.json（兼容检测脚本等也读它）：
// Safari 13.1 / iOS 13.4（2020-03）、Chrome 80（2020-02）、Edge 80（2020-02）、Firefox 74（2020-03）
// 改它会同时改三处：要补的 polyfill、语法转换目标、index.html 兜底页上显示的最低版本
// 这组版本正好是 index.html 检测脚本的判断边界（可选链 ?. 与 ResizeObserver 的首个支持版本），
// 低于它的浏览器一定会被检测出来并展示「版本过低」兜底页；调整时要同步核对检测项，否则会出现检测不到的灰区
const { safari, ios, chrome, edge, firefox } = JSON.parse(
  readFileSync(path.resolve(__dirname, 'browser-support.json'), 'utf8')
)
const MIN_BROWSERS = { safari, ios, chrome, edge, firefox }
// browserslist 写法：给 plugin-legacy 判断要补哪些 API（polyfill）
const SUPPORTED_BROWSERS = [
  `safari >= ${MIN_BROWSERS.safari}`,
  `ios_saf >= ${MIN_BROWSERS.ios}`,
  `chrome >= ${MIN_BROWSERS.chrome}`,
  `edge >= ${MIN_BROWSERS.edge}`,
  `firefox >= ${MIN_BROWSERS.firefox}`
]
// esbuild 写法：给 build.target 决定把新语法转成哪一代写法（Safari 只取主版本，转换得更保守一点）
const ESBUILD_TARGET = [
  'es2020',
  `safari${parseInt(MIN_BROWSERS.safari)}`,
  `ios${MIN_BROWSERS.ios}`,
  `chrome${MIN_BROWSERS.chrome}`,
  `edge${MIN_BROWSERS.edge}`,
  `firefox${MIN_BROWSERS.firefox}`
]


function origin2crypt(fullFilePath: string) {
// Read input code
  JSConfuser.obfuscate(readFileSync(fullFilePath, 'utf8'), {
    target: 'browser',
    preset: 'low',
    pack: false
  }).then((result) => {
 const targetFile = fullFilePath.replace('-o.', '.')
    // Write output code
    console.log(`[Gen Crypted File]: ${targetFile}`)
    writeFileSync(targetFile, result.code)
  }).catch((err) => {
    // Error occurred
    console.error(err)
  })
}

const originFiles = [
  'store'+path.sep+'c'+path.sep+'index-o.js',
  'store'+path.sep+'c'+path.sep+'s-o.js',
  //
  'utils'+path.sep+'c'+path.sep+'index-o.js',
  'utils'+path.sep+'c'+path.sep+'w-o.js',
  'utils'+path.sep+'c'+path.sep+'j-o.js',
  'utils'+path.sep+'c'+path.sep+'u-o.js',
  //
  'utils'+path.sep+'request-o.js'
]
const genCryptFile = function(fullPath: string) {
  if(!fullPath.endsWith('-o.js')) {return; }// 如果不是 原始待加密文件 则 直接返回
  originFiles.forEach((p) => {
    // 排除 node_modules 目录、 Vite 配置文件本身（避免无限循环）
    if (fullPath.includes('node_modules') || fullPath.includes('vite.config.js')) return
    if (fullPath.endsWith('src'+ path.sep + p)) {
      origin2crypt(fullPath)
  }
  })
}
// originFiles.forEach((p) => genCryptFile(pathSrc +'/'+ p)) // 不注解 则是 全部再生成 一次


export default defineConfig(({ mode }) => {
  const envData = loadEnv(mode, 'env')

  dotenv.populate(envData, genVersionCode('pc'))
  Object.assign(process.env, envData)

  // 软性升级提示条的阈值（构建时按 caniuse 数据算好，开关在 env/.env.*）；关闭时为 null，提示条不会打进产物
  const upgradeBanner = resolveUpgradeBanner(envData, browserslist)

  return {
    base: '/',
    define: {
      __X9_UPGRADE_BANNER__: JSON.stringify(upgradeBanner)
    },
    plugins: [
      {
        name: 'tablet-profile-content-version',
        apply: 'build',
        transformIndexHtml(html) {
          return versionTabletProfileHtml(html, readFileSync(path.resolve(__dirname, 'public/static/assets/tablet-profile.js')))
        }
      },
      {
        name: 'origin-file-watcher',
        configureServer(server) {
     const watcher = server.watcher
     const watchPath = path.resolve(__dirname, 'src')
          watcher.add(watchPath)
   watcher.on('change', genCryptFile)
  }
   },
vue(),
vueJsx(),
      // 把 index.html 兜底页里的 __X9_MIN_XXX__ 换成 MIN_BROWSERS，保证页面上显示的最低版本和实际配置一致
      {
        name: 'x9-browser-min-versions',
        transformIndexHtml: (html: string) =>
          html.replace(
            /__X9_MIN_(SAFARI|IOS|CHROME|EDGE|FIREFOX)__/g,
            (_: string, key: string) => MIN_BROWSERS[key.toLowerCase() as keyof typeof MIN_BROWSERS]
          )
      },
      // 只给现代产物补 polyfill，不生成 nomodule 老包（Safari 13.1 支持 ES Module，老包不会被加载）
      legacy({
        modernTargets: SUPPORTED_BROWSERS,
        modernPolyfills: true,
        renderLegacyChunks: false
      }),
      AutoImport({
        dts: 'auto-imports.d.ts',
    imports: ['vue'],
   resolvers: [
          ElementPlusResolver({
            importStyle: 'sass'
})
        ]
      }),
      Components({
        resolvers: [
          ElementPlusResolver({
importStyle: 'sass'
   })
        ]
   }),
      // @ts-ignore
      purgeCss({
        content: [`./src/**/*.vue`],
  safelist: [
 /-(leave|enter|appear)(|-(to|from|active))$/,
      /^(?!(|.*?:)cursor-move).+-move$/,
      /^router-link(|-exact)-active$/,
  /data-v-.*/,
          /^el([-_])/,
   /^is-/
      ]
      }),
  // visualizer({
      //   open: true
      // }),
      pwa({
    deployment: { kind: 'portable' },
   identity: IDENTITY,
        policy: POLICY,
        install: INSTALL,
topology: { kind: 'shared-origin', registry: REGISTRY },
        offlinePage: { locale: 'zh-CN' },
    }),
      {
        ...vitePluginBundleObfuscator({
      excludes: [],
    enable: false, // 保持关闭，不得开启（2026-11-11 定）：开启需单独立项，并完整复验浏览器兼容（见 CLAUDE.md「不能动的地方」）
    log: true,
          autoExcludeNodeModules: true,
  // autoExcludeNodeModules: { enable: true, manualChunks: ['vue'] }
     threadPool: false,
          // threadPool: { enable: true, size: 4 }
      options: {
     seed: 20241001,
    compact: true,
            controlFlowFlattening: false,
            controlFlowFlatteningThreshold: 0.75,
  deadCodeInjection: false,
       deadCodeInjectionThreshold: 0.4,
debugProtection: false,
  debugProtectionInterval: 4000,
disableConsoleOutput: false,
      identifierNamesGenerator: 'mangled-shuffled',
       log: false,
   numbersToExpressions: false,
            renameGlobals: false,
 selfDefending: true,
    simplify: true,
  splitStrings: false,
  splitStringsChunkLength: 5,
   stringArray: false,
    stringArrayCallsTransform: false,
            stringArrayEncoding: ['rc4'],
     stringArrayIndexShift: false,
     stringArrayRotate: false,
  stringArrayShuffle: false,
  stringArrayWrappersCount: 5,
    stringArrayWrappersChainedCalls: false,
     stringArrayWrappersParametersMaxCount: 5,
      stringArrayWrappersType: 'function',
         stringArrayThreshold: 1,
  transformObjectKeys: false,
  unicodeEscapeSequence: false
    }
   }),
   apply: 'build', // 仅在生产构建时生效
        enforce: 'post' // 关键！强制在所有插件之后运行
   }
    ],
    resolve: {
      extensions: ['.js', '.json', '.ts', 'tsx', 'jsx'],
      alias: {
        '@': pathSrc
      }
 },
    css: {
  preprocessorOptions: {
  scss: {
          additionalData: `@use "@/styles/global" as *;`
    }
      }
    },
    server: {
  proxy: {
    '/api/': {
  target: envData.VITE_API_HOST,
    changeOrigin: true
},
        '/bbs/': {
   target: envData.VITE_API_HOST,
      changeOrigin: true
 },
   // 图片 等后端的 共享资源
        '/upload/': {
      target: envData.VITE_API_HOST,
  changeOrigin: true
     }
      }
    },
    build: {
      target: ESBUILD_TARGET,
      minify: 'terser',
      assetsDir: 'static/assets',
      terserOptions: {
        format: {
     comments: false
  },
        compress: {
   drop_console: true
          // pure_funcs: ['console.log']
        }
      },
      rollupOptions: {
        output: {
          // 在这里使用插件，确保它处理的是最终生成的 Chunk
          plugins: [],
        // PWA 兼容：@pwa-platform/core 要求产物路径是 URL-canonical（不含中文/空格/括号等）。
  // 默认 assetFileNames 会把原始文件名带进输出路径，含特殊字符时触发 compile.invalid-host-output。
          // 改为仅保留扩展名 + hash，彻底规避。
          assetFileNames: 'static/assets/[hash][extname]',


          // 设置打包输入的文件路径名，为了查看资源文件的大小
       //     entryFileNames: 'js/[name].[hash].js',
    //     assetFileNames: '[ext]/[name].[hash].[ext]',
    //     chunkFileNames(chunkInfo) {
          //const facedeModuleId = chunkInfo.facadeModuleId
   //         ? chunkInfo.facadeModuleId.split('/')
     // : []
    //       const fileName = facedeModuleId[facedeModuleId.length - 2] || '[name]'
  //     return `js/${fileName}/[name].[hash].js`
   //     }
        }
      }

    }
  }
})

function genVersionCode(prefix: string) {
  const releaseDate = new Date()
  const year = releaseDate.getFullYear().toString()
  const month = String(releaseDate.getMonth() + 1).padStart(2, '0')
  const day = releaseDate.getDate().toString().padStart(2, '0')

  return {
    VITE_RELEASE_DATE: releaseDate.getTime().toString(),
    VITE_VERSION_CODE: `${prefix}-${year}-${month}-${day}`
  }
}
