import Vue from 'vue'
import UIComponent from './UIComponent'
import {ludicMethod} from '../../util/util'

class LudicComponent {
  static extend(opts){
    let comp = Vue.extend(opts).extend({
      mixins: [{
        beforeCreate(){
          // setup the ludicComponents and ludicMethods from $options
          if(this.$options.ludicComponents != null){
            for(let compKey in this.$options.ludicComponents){
              this.$options.components = Object.assign(this.$options.components || {}, {
                [compKey]: this.$options.ludicComponents[compKey].$raw
              })
            }
          }
          if(this.$options.ludicMethods != null){
            for(let methodKey in this.$options.ludicMethods){
              this.$options.methods = Object.assign(this.$options.methods || {}, {
                [methodKey]: ludicMethod(methodKey, this.$options.ludicMethods[methodKey])
              })
            }
          }
        }
      }]
    })


    return new Proxy(comp, {
      construct(target, args) {
        return new UIComponent(target, args)
      },
      get(target, property){
        return property == '$raw' ? comp : target[property]
      },
    })
  }
}

export default LudicComponent
