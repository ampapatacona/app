import { link } from './apollo-link'

export function apolloClientBeforeCreate ({ store, apolloClientConfigObj }) {
  // if needed you can modify here the config object used for apollo client
  // instantiation
  apolloClientConfigObj.link = link
}

export function apolloClientAfterCreate (/* { apolloClient, app, router, store, ssrContext, urlPath, redirect } */) {
  // if needed you can modify here the created apollo client
}
