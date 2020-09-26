import { auth } from 'src/boot/firebase'

export function LOGOUT ({ commit }) {
  auth.signOut()
  commit('SET_USER', null)
  commit('SET_TOKEN', null)
  // console.log(this.$router.currentRoute.fullPath)
  // const home = `/${this.$i18n.locale}/`
  // if (this.$router.currentRoute.fullPath !== home) {
  //   return this.$router.replace(`/${this.$i18n.locale}/`)
  // }
  return this.$router.push('/login')
}
