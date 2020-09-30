let refreshing
navigator.serviceWorker.addEventListener('controllerchange', () => {
  // This fires when the service worker controlling this page
  // changes, eg a new worker has skipped waiting and become
  // the new active worker.
  // console.log('controllerchange called')
  if (refreshing) return
  window.location.reload()
  refreshing = true
})
