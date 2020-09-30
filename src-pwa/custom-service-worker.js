/* eslint-disable no-undef */
/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.conf > pwa > workboxPluginMode is set to "InjectManifest"
 */
import { precacheAndRoute } from 'workbox-precaching'
self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') {
    // console.log('skipwaiting called')
    self.skipWaiting()
  }
})

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('push', (event) => {
  const title = 'AMPA'
  const options = {
    body: event.data.text(),
    renotify: true,
    icon: event.data.notification.icon || '/statics/icons/icon-512x512.png',
    badge: event.data.notification.badge || '/statics/icons/icon-128x128.png',
    image: event.data.notification.image || '',
    timestamp: event.data.notification.timestamp || Date.parse(new Date()),
    vibrate: event.data.notification.vibrate || [200, 100, 200, 100, 200, 100, 200],
    tag: event.data.notification.tag || 'ampa-tag',
    click_action: event.data.notification.click_action || `${functions.config().app.baseurl}`
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', function (event) {
  const url = event.click_action || `${functions.config().app.baseurl}`
  event.notification.close() // Android needs explicit close.
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      // Check if there is already a window/tab open with the target URL
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i]
        // If so, just focus it.
        if (client.url === url && 'focus' in client) {
          return client.focus()
        }
      }
      // If not, then open the target URL in a new window/tab.
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    })
  )
})

precacheAndRoute(self.__WB_MANIFEST || [])

// workbox.precaching.precacheAndRoute(self.__precacheManifest || [])
