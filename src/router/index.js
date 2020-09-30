import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'
import { auth } from 'src/boot/firebase'

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

  Router.beforeEach(async (to, from, next) => {
    auth.onAuthStateChanged(async (firebaseUser) => {
      const user = firebaseUser
      // console.log('user des de router guard', user)
      const redirectUrl = to.fullPath.substr(1)
      if (to.name === 'login' && user) next({ path: '/' }) // prevents going to login if there is a user already
      const requireScope = to.matched.some(record => record.meta.requiresScope)
      const requireAuth = to.matched.some(record => record.meta.requiresAuth)
      if (requireAuth || requireScope) {
      // this route requires auth, check if logged in
      // if not, redirect to login page.
        if (!user) {
          next({
            path: '/login',
            query: { redirect: redirectUrl }
          })
          // } else if (!user.emailVerified && to.path !== '/verifyEmail' && to.path !== '/completeAccount') {
          //   next('/verifyEmail')
          //
        } else {
          if (requireScope) {
            const permissionRequired = to.matched.find(record => record.meta.requiresScope).meta.requiresScope
            console.log('scope required', permissionRequired)
            // const idToken = await user.getIdToken(true)
            const tokenResult = await user.getIdTokenResult(true)
            console.log('tokenResult', tokenResult)
            const permissionsGranted = tokenResult.claims['https://hasura.io/jwt/claims']['x-hasura-default-role']
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
  })
  return Router
}
