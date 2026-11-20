// 产物检查的「应通过」样例：字符串里的 (?<=、先行断言、可选链等 ES2020 语法、数字分隔符
export const s = "(?<=a)"
export const r = /\d+(?=px)/g
export const o = ({}).a?.b ?? 1
export const p = import("./x.js")
export const n = 10_000 // 数字分隔符：Safari 13 / Chrome 75 / Firefox 70 起支持，在支持范围内
