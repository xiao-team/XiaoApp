import { createStore } from 'vuex'

export interface StateType {
  menu: 'music' | 'setting' | 'love' | 'player' | 'video' | 'stock'
  windowIsOnTop: boolean
}
export default createStore<StateType>({
  state: {
    menu: 'video',
    windowIsOnTop: false
  },
  mutations: {
    SET_MENU(state: any, menu: string) {
      state.menu = menu
    },
    SET_WINDOWISONTOP(state, windowIsOnTop: boolean) {
      state.windowIsOnTop = windowIsOnTop
    },
  },
  actions: {
  },
  modules: {
  }
})
