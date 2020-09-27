import { auth } from 'src/boot/firebase'

export function LOGOUT ({ commit }) {
  auth.signOut()
  commit('SET_USER', null)
  commit('SET_TOKEN', null)
}
