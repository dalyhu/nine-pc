import { createHash } from 'node:crypto'

export function versionTabletProfileHtml(html, profileContents) {
  const source = '/static/assets/tablet-profile.js'
  const parts = html.split(`src="${source}"`)
  if (parts.length !== 2) throw new Error('Expected exactly one tablet profile script in index.html')
  const version = createHash('sha256').update(profileContents).digest('hex')
  return parts.join(`src="${source}?v=${version}"`)
}
