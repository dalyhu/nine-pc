// wasm 加密方式相关

import store from '@/store'

let m

async function i()
{
  if (!m) {
    m = await store.var // etc/nginx/mime.types 中 需要添加 application/wasm wasm;
    await m.default()   // 否则会初始化 wasm 失败
    //console.log(m)
  }
}

export async function w(h, r, url, params, time, visitor, fingerprintId, version)
{
  await i() // 初始化 wasm
  m.ca()
  m.ic() // 初始化并准备
  m.ps(h)
  // 生成签名
  return m.gs(h, r, url, params, `${time}`, `${visitor}`, fingerprintId, version)
}
