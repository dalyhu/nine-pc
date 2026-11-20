import { setCacheNameDetails, clientsClaim } from 'workbox-core'
import { registerRoute } from 'workbox-routing'
import { CacheFirst } from 'workbox-strategies'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { ExpirationPlugin } from 'workbox-expiration'
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'

declare const self: ServiceWorkerGlobalScope

const prefix = 'x9-pc'
const version = 'v1.0.4'
const cacheNameMap = {
  preCache: `${prefix}-precache-v2-${version}`,
  jsCache: `${prefix}-js-${version}`,
  cssCache: `${prefix}-css-${version}`,
  imgCache: `${prefix}-img-${version}`
}
const day7 = 60 * 60 * 24 * 7
const cacheNameList = Object.values(cacheNameMap)
const jsCodeRegex =
  /^[\s\S]*?(function|var|let|const|class|if|else|for|while|do|switch|try|catch|finally|throw|new|return|typeof|instanceof|import|export)[\s\S]*?$/
const cssCodeRegex = /^[\s\S]*?([a-zA-Z0-9-]+)\s*:\s*([^;]+);[\s\S]*?$/

setCacheNameDetails({
  prefix,
  suffix: version
})

registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg|svga)$/,
  new CacheFirst({
    cacheName: cacheNameMap.imgCache,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxEntries: 600,
        maxAgeSeconds: day7,
        purgeOnQuotaError: true
      })
    ]
  })
)

registerRoute(
  /\.(?:css)$/,
  new CacheFirst({
    cacheName: cacheNameMap.cssCache,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      {
        cacheWillUpdate: async ({ response }) => {
          if (response) {
            const text = await response.clone().text()
            if (cssCodeRegex.test(text)) return response
          }

          return null
        }
      },
      new ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: day7,
        purgeOnQuotaError: true
      })
    ]
  })
)

registerRoute(
  /\.(?:js)$/,
  new CacheFirst({
    cacheName: cacheNameMap.jsCache,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      {
        cacheWillUpdate: async ({ response }) => {
          if (response) {
            const text = await response.clone().text()
            if (jsCodeRegex.test(text)) return response
          }

          return null
        }
      },
      new ExpirationPlugin({
        maxEntries: 450,
        maxAgeSeconds: day7,
        purgeOnQuotaError: true
      })
    ]
  })
)

cleanupOutdatedCaches()

precacheAndRoute(self.__WB_MANIFEST)

// @ts-ignore
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      keys.forEach((key) => {
        if (!cacheNameList.includes(key)) caches.delete(key)
      })
    })
  )
})

// @ts-ignore
self.skipWaiting()
clientsClaim()
