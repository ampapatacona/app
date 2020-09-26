import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

import { auth } from '../boot/firebase'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function ({ store }) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  Router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      // this route requires auth, check if logged in
      // if not, redirect to login page.
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
                return vm.$axios
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
              store.commit('user/SET_TOKEN', validToken)
              store.commit('user/SET_USER', user)
              // Store Token / Or create Apollo with your new token!
              // return this.$router.replace(`/${this.$i18n.locale}/app/`)
              next()
            })
            .catch((err) => console.error(err))
        } else {
          next({
            path: '/login',
            query: { redirect: to.fullPath }
          })
        }
      })
    } else {
      next()
    }
  })
  return Router
}
