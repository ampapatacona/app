import Vue from 'vue'
import axios from 'axios'
const axiosInstance = axios.create({
  baseURL: process.env.SERVER_URL
})

// for use inside Vue files through this.$axios
Vue.prototype.$axios = axiosInstance

export { axiosInstance }
