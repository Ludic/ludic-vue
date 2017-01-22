import LudicAppComponent from './components/ludicAppComponent'
export default class LudicVue {
  static install(Vue){
    Vue.component('ludic-app', LudicAppComponent)
  }
}
