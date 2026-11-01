/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-25613826'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "pwa-maskable-512x512.png",
    "revision": "dcb250849d66f5a96399863c7e2eb017"
  }, {
    "url": "pwa-512x512.png",
    "revision": "73ecd35e090eb81de24f655c9d073edd"
  }, {
    "url": "pwa-192x192.png",
    "revision": "c8690291416b827815c227466ff34e92"
  }, {
    "url": "index.html",
    "revision": "4a91704e22dd4a47b96520881f05ab8a"
  }, {
    "url": "favicon.png",
    "revision": "3051ac4097767205973f62fb7da8ac08"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "8718c1f5b52a60be09228da0f9d2c735"
  }, {
    "url": "assets/workbox-window.prod.es5-Bd17z0YL.js",
    "revision": null
  }, {
    "url": "assets/index-v5m1ZeqT.js",
    "revision": null
  }, {
    "url": "assets/index-DULX0Y60.css",
    "revision": null
  }, {
    "url": "assets/aistudio/photo_6201466797702187888_y_ad526240.jpg",
    "revision": null
  }, {
    "url": "assets/aistudio/photo_6127375197347187989_y_dc2e5816.jpg",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "8718c1f5b52a60be09228da0f9d2c735"
  }, {
    "url": "favicon.png",
    "revision": "3051ac4097767205973f62fb7da8ac08"
  }, {
    "url": "pwa-192x192.png",
    "revision": "c8690291416b827815c227466ff34e92"
  }, {
    "url": "pwa-512x512.png",
    "revision": "73ecd35e090eb81de24f655c9d073edd"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "dcb250849d66f5a96399863c7e2eb017"
  }, {
    "url": "manifest.webmanifest",
    "revision": "afdae433df7fe5a860aa72e52fce2cab"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));
  workbox.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "google-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/fonts\.gstatic\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "gstatic-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    })]
  }), 'GET');

}));
