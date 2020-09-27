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
    if (firebaseUser) {
      let token = await firebaseUser.getIdToken(true)
      const tokenResult = await firebaseUser.getIdTokenResult(true)
      const hasuraClaim = tokenResult.claims ? tokenResult.claims['https://hasura.io/jwt/claims'] : null
      const { uid, email, emailVerified, photoURL } = firebaseUser
      if (hasuraClaim) {
        const user = { uid, email, emailVerified, photoURL, token, role: hasuraClaim['x-hasura-default-role'] }
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
      if (store.state.user.user) {
        store.dispatch('user/LOGOUT')
      }
      // const redirectUrl = router.currentRoute.path
      // if (!urlPath.startsWith('/login')) {
      //   redirect({
      //     path: '/login',
      //     query: { redirect: redirectUrl }
      //   })
      // }
    }
  })
}
