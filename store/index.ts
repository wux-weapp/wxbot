import Vue from 'vue'
import Vuex from 'vuex'
import robot from './module/robot'

Vue.use(Vuex)

const store = () =>
  new Vuex.Store({
    state: {},
    mutations: {},
    modules: {
      robot,
    },
  })

export default store
