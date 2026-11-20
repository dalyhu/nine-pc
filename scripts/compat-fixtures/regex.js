// 正则新特性：构建转换不了，目标浏览器不支持（见 scripts/compat-lint.test.mjs）
export const r1 = /(?<=a)b/ // 应报错：后行断言
export const r2 = /(?<!a)b/ // 应报错：否定后行断言
export const r3 = /(?<year>\d{4})/ // 应报错：命名捕获组
export const r4 = /\p{L}/u // 应报错：Unicode 属性转义
export const r5 = /a.b/s // 应报错：s 标志
export const s1 = '(?<=a)' // 不应报错：只是字符串
export const r6 = /(?:a)b/g // 不应报错
export const r7 = /\d+(?=px)/ // 不应报错：先行断言各浏览器都支持
