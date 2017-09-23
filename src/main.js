import LudicAppComponent from './components/ludicAppComponent'
import LudicUI from './ui'
export default class LudicVue {
  static install(Vue){
    Vue.component('ludic-app', LudicAppComponent)
    Vue.component('ludic-ui', LudicUI)
  }
}
export * from './ui/index.js'
