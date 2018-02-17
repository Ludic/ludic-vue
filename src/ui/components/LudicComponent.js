import Vue from 'vue'
import UIComponent from './UIComponent'

// const LudicComponent = Vue.extend({})

class LudicComponent {
  static extend(opts){
    let comp = Vue.extend(opts)

    return new Proxy(comp, {
      construct(target, args) {
        return new UIComponent(target)
      },
      get(target, property){
        return property == '$raw' ? comp : target[property]
      },
    })
  }
}

export default LudicComponent
