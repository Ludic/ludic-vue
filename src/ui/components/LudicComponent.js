import Vue from 'vue'
import UIComponent from './UIComponent'
import {ludicEmit, mergeOptions, destroyLudicInput} from '../../util/util'

export default class LudicComponent {
  static extend(opts){
    let comp = Vue.extend(opts).extend({
      inject: [
        // this will inject the LudicApp as $app onto every LudicComponent
        '$app',
      ],
      created(){
        // setup the ludicComponents and ludicMethods from $options
        mergeOptions(this)
      },
      beforeDestroy(){
        destroyLudicInput(this)
      },
      methods: {
        $ludicEmit: ludicEmit,
      },
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
