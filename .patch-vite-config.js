// patch-vite-config.js — 一次性脚本，用后删除
const fs = require('fs')
const file = 'D:/gs/x9-web-pc/vite.config.ts'
let c = fs.readFileSync(file, 'utf8')
const nl = c.includes('\r\n') ? '\r\n' : '\n'

// 1. 替换 VitePWA import 行
c = c.replace(
  /^import \{ VitePWA \} from 'vite-plugin-pwa'\r?\n/m,
  "import { pwa } from '@pwa-platform/vite'" + nl +
  "import { IDENTITY, INSTALL, POLICY, REGISTRY } from './pwa.config.ts'" + nl
)

// 2. 替换 VitePWA(...) 插件块（多行）
c = c.replace(
  /      VitePWA\(\{[\s\S]*?\}\),\r?\n/,
  "      pwa({" + nl +
  "        deployment: { kind: 'portable' }," + nl +
  "        identity: IDENTITY," + nl +
  "     policy: POLICY," + nl +
  "   install: INSTALL," + nl +
  "        topology: { kind: 'shared-origin', registry: REGISTRY }," + nl +
  "        offlinePage: { locale: 'zh-CN' }," + nl +
  "      })," + nl
)

// 3. 关闭混淆插件（enable: true → enable: false）
c = c.replace(/(\s+enable:\s*)true,/, '$1false, // 临时关闭：PWA 验收期间禁用，待混淆 seed 问题解决后重新开启')

fs.writeFileSync(file, c)
console.log('patch OK')
