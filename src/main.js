import LudicAppComponent from './components/ludicAppComponent'
export default class LudicVue {
  static install(Vue){
    Vue.component('ludic-app', LudicAppComponent)
  }
}

export {default as UILayer} from './ui/components/UILayer'
export {default as UIText} from './ui/components/UIText'
