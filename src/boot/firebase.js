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

export default ({ urlPath, redirect, store }) => {
  auth.onAuthStateChanged((firebaseUser) => {
    if (firebaseUser) {
      return firebaseUser
        .getIdToken()
        .then((token) =>
          auth.currentUser.getIdTokenResult().then((result) => {
            if (result.claims['https://hasura.io/jwt/claims']) {
              // console.log(result.claims)
              return token
            }
            const { uid, email } = firebaseUser
            return axiosInstance
              .post('/refresh-token', { uid, email })
              .then((res) => {
                if (res.status === 200) {
                  return firebaseUser.getIdToken(true)
                }
                return res.json().then((e) => {
                  throw e
                })
              })
          })
        )
        .then((validToken) => {
          // console.log('valid token', validToken)
          const { uid, email, emailVerified, photoURL } = firebaseUser
          const user = { uid, email, emailVerified, photoURL }
          store.commit('user/SET_TOKEN', validToken)
          store.commit('user/SET_USER', user)
          // Store Token / Or create Apollo with your new token!
          if (urlPath.startsWith('/login')) {
            return redirect('/')
          }
        })
        .catch((err) => console.error(err))
    } else {
      // console.log('ja no hi ha usuari')
    }
  })
}
