import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/database'
import Vue from 'vue'
import { axiosInstance } from 'src/boot/axios'

const config = {
  apiKey: process.env.FB_API_KEY,
  authDomain: process.env.FB_AUTH_DOMAIN,
  databaseURL: process.env.FB_DATABASE_URL,
  projectId: process.env.FB_PROJECT_ID,
  storageBucket: process.env.FB_STORAGE_BUKET,
  messagingSenderId: process.env.FB_MESSAGING_SENDER_ID,
  appId: process.env.FB_APP_ID
}

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

export const authProviders = {
  Google: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  email: firebase.auth.EmailAuthProvider.PROVIDER_ID
}
const auth = firebase.auth()
Vue.prototype.$auth = firebase.auth()
export { auth }
/* export const db = firebase.database()
export const store = firebase.firestore() */

export default ({ urlPath, redirect, store, router }) => {
  auth.onAuthStateChanged(async (firebaseUser) => {
    routerGuard(firebaseUser)
    if (firebaseUser) {
      let token = await firebaseUser.getIdToken(true)
      const tokenResult = await firebaseUser.getIdTokenResult(true)
      const hasuraClaim = tokenResult.claims ? tokenResult.claims['https://hasura.io/jwt/claims'] : null
      const { uid, email, emailVerified, photoURL } = firebaseUser
      if (hasuraClaim) {
        const user = { uid, email, emailVerified, photoURL, token }
        return store.commit('user/SET_USER', user)
      }
      const refreshTokenResult = await axiosInstance.post('/refresh-token', { uid, email })

      if (refreshTokenResult.status === 200) {
        token = firebaseUser.getIdToken(true)
        const user = { uid, email, emailVerified, photoURL, token }
        return store.commit('user/SET_USER', user)
      } else {
        throw refreshTokenResult
      }
    } else {
      // console.log('ja no hi ha usuari')
      routerGuard(firebaseUser)
      store.dispatch('user/LOGOUT')
    }
  })

  // Router guard
  function routerGuard (firebaseUser) {
    router.beforeEach(async (to, from, next) => {
      const user = firebaseUser
      const redirect = to.fullPath.substr(1)
      if (to.name === 'login' && user) next({ path: '/' }) // prevents going to login if there is a user already
      const requireScope = to.matched.some(record => record.meta.requiresScope)
      const requireAuth = to.matched.some(record => record.meta.requiresAuth)
      if (requireAuth || requireScope) {
        // this route requires auth, check if logged in
        // if not, redirect to login page.
        if (!user) {
          next({
            path: '/login',
            query: { redirect: redirect }
          })
        } else if (!user.emailVerified && to.path !== '/verifyEmail' && to.path !== '/completeAccount') {
          next('/verifyEmail')
        } else {
          if (requireScope) {
            const permissionRequired = to.matched.find(record => record.meta.requiresScope).meta.requiresScope
            // console.log('scope required', permissionRequired)
            // const idToken = await user.getIdToken(true)
            const tokenResult = await user.getIdTokenResult(true)
            const permissionsGranted = tokenResult['https://hasura.io/jwt/claims']['x-hasura-default-role']
            if (permissionsGranted && permissionsGranted.includes(permissionRequired)) {
              next()
            } else {
              next({
                path: '/'
              })
            }
          } else {
            next() // requiresAuth passed
          }
        }
      } else {
        next() // make sure to always call next()!
      }
    })
  } // End router guard
}
