import type {
  PwaInstallMetadata,
  PwaPolicyV3,
  PwaPortableIdentity,
  PwaPortableOriginRegistry,
} from "@pwa-platform/contracts";

export const IDENTITY: PwaPortableIdentity = {
  appId: "x9-pc",
  manifestId: "/",
  scope: "/",
  mountPath: "/",
  serviceWorkerUrl: "/sw.js",
  manifestUrl: "/manifest.webmanifest",
  environment: "production",
    cacheNamespaceSeed: "r5",
};

export const REGISTRY: PwaPortableOriginRegistry = {
  schemaVersion: 2,
  registryVersion: 1,
  environment: IDENTITY.environment,
  root: {
    appId: IDENTITY.appId,
    scope: IDENTITY.scope,
    serviceWorkerUrl: IDENTITY.serviceWorkerUrl,
    manifestId: IDENTITY.manifestId,
  manifestUrl: IDENTITY.manifestUrl,
  },
  children: [
    {
      appId: "x9-h5",
      scope: "/m/",
      serviceWorkerUrl: "/m/sw.js",
      manifestId: "/m/",
      manifestUrl: "/m/manifest.webmanifest",
    },
  ],
};

export const INSTALL: PwaInstallMetadata = {
  startUrl: "/",
  display: "standalone",
  name: "小9直播",
  shortName: "小9直播",
  themeColor: "#d02d54",
  backgroundColor: "#ffffff",
  icons: [
 { src: "/static/icons/icon-192-any.png", sizes: "192x192", type: "image/png", purpose: "any" },
    { src: "/static/icons/icon-192-maskable.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
    { src: "/static/icons/icon-512-any.png", sizes: "512x512", type: "image/png", purpose: "any" },
    { src: "/static/icons/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
  ],
};

export const POLICY: PwaPolicyV3 = {
  schemaVersion: 3,
  install: { enabled: true },
  updateMode: "prompt",
  offlineFallback: { enabled: true, path: "/offline.html" },
  networkTimeoutSeconds: 5,
  navigationRetry: { delayMilliseconds: 1000 },
  resources: [
    { pathPrefix: "/", resourceClass: "navigation-public-static", cache: "network-first" },
  ],
  offlineWrites: { enabled: false, maxEntries: 0, maxTotalBodyBytes: 0, targets: [] },
  runtimeCache: { enabled: false, maxEntries: 0, maxEntryBytes: 0, maxAgeSeconds: 0 },
};
