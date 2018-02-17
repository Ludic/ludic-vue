import Vue from 'vue'

const RESTRICTED_PROPERTIES = ['$componentDef', '$vm', '$refs']

// we want to hold the Vue component in a WeakMap to prevent possible memleaks
const VM_MAPPER = new WeakMap()
const PROXY_MAPPER = new WeakMap()

export default class UIComponent {
  constructor(_componentDef={}) {
    let self = this
    this._componentDef = this._applyMixin(_componentDef)
    // return a Proxy wrapper for this object from the constructor to catch set/get
    // we use this to pass get/sets along to the Vue component that is merged with this object
    let proxy = new Proxy(self, {
      set(target, property, value, receiver){
        if(!RESTRICTED_PROPERTIES.includes(property) && target.$vm && target.$vm.$data.hasOwnProperty(property)){
          target.$vm[property] = value
          // we want to set both the vm's data and our local data in the case that
          // target[property] = value
          return true
        } else {
          target[property] = value
          return true
        }
        return false
      },
      get(target, property, receiver){
        if(!RESTRICTED_PROPERTIES.includes(property) && target.$vm && target.$vm.$data.hasOwnProperty(property)){
          // check if property belongs to target.$vm.$data
          // return the $vm's data
          return target.$vm[property]
        } else {
          // else return the target prop
          return target[property]
        }
      }
    })

    // this is a proxy that we can register events onto to capture methods from
    // the component
    this._eventProxy = {}
    this.eventProxy = new Proxy(this._eventProxy, {
      set(target, property, value, receiver){
        let eventName = `ludic:${property}`
        if(VM_MAPPER.get(self) != null){
          VM_MAPPER.get(self).$on(eventName, value)
        } else {
          target[eventName] = value
        }
        return true
      },
      // get(target, property, receiver){
      //
      // },
    })
    // before we proxy, we want to make sure we keep a reference to the non-proxied object
    PROXY_MAPPER.set(proxy, this)
    return proxy
  }

  /*
    component bound methods to be overridden
   */


  /*
    vm bound methods to be overridden
   */

  /**
   * $vm data. define reactive properties for this component here
   * @param  {UIComponent} self the UIComponent since 'this' is bound to the vm here
   * @return {Object} reactive vm properties
   */
  data(self){
    return {}
  }

  /**
   * The vm's render function. use the 'h' or 'createElement' callback that is passed
   * in to return a dynamic template for this component
   * @param  {UIComponent} self the UIComponent since 'this' is bound to the vm here
   * @param  {[type]} h    also known as 'createElement' (https://vuejs.org/v2/guide/render-function.html#createElement-Arguments)
   * @return {[type]}      a VNode for this component
   */
  render(self, h){
    return h()
  }

  /*
    Dynamic Getters
   */

  get $vm(){
    // expose the vm, for now...
    return VM_MAPPER.get(this)
  }

  get ['$componentDef'](){
    // return the same or create a new component definition
    return this._componentDef || (this._componentDef = this._applyMixin({},this))
  }

  get $on(){
    // return VM_MAPPER.get(this)
    return this.eventProxy
  }

  _applyMixin(componentDef, component=this){
    // inside each of the Vue methods here, `this` refers to the vm
    return Vue.extend({
      data(){
        console.log('> data', this, component)
        return component.data.call(this, component)
      },
      beforeCreate(){
        VM_MAPPER.set(component, this)
        for(let event in component._eventProxy){
          this.$on(event, component._eventProxy[event])
        }
      },
      beforeDestroy(){
        // copy vm data to local in case this object is re-created
        for(let key in this.$data){
          component[key] = this[key]
        }
      },
      render(...args){
        return component.render.call(this, component, ...args)
      },
    }).extend(componentDef)
  }
}
