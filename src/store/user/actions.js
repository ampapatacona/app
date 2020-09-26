import { auth } from 'src/boot/firebase'
import { axiosInstance } from 'src/boot/axios'

export function AUTH_CHECK ({ commit, dispatch, urlPath, redirect }) {
  const vm = this
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
          const { uid, email, emailVerified } = firebaseUser
          const user = { uid, email, emailVerified }
          commit('SET_TOKEN', validToken)
          commit('SET_USER', user)
          // Store Token / Or create Apollo with your new token!
          const redirect = vm.$router.currentRoute.query ? vm.$router.currentRoute.query.redirect : '/'
          return vm.$router.replace({ path: redirect })
        })
        .catch((err) => console.error(err))
    }
  })
}
