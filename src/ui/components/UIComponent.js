const RESTRICTED_PROPERTIES = ['$componentDef']

// we want to hold the Vue component in a WeakMap to prevent possible memleaks
const VM_MAPPER = new WeakMap()

class SuperClass {meta() {return {}}}

export default class UIComponent extends SuperClass {
  constructor() {
    super()
    // return a Proxy wrapper for this object from the constructor to catch set/get
    // we use this to pass get/sets along to the Vue component that is merged with this object
    return new Proxy(this, {
      set(target, property, value, receiver){
        if(!RESTRICTED_PROPERTIES.includes(property) && target.$vm && target.$vm.$data.hasOwnProperty(property)){
          target.$vm[property] = value
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
  }

  /*
    component bound methods to be overridden
   */


  meta(){
    return {}
  }

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
    let self = this
    // return the same or create a new component definition
    return this._componentDef || (this._componentDef = {
      mixins: [{
        data(){
          return self.data.call(this, self)
        },
      }],
      beforeCreate(){
        VM_MAPPER.set(self, this)
      },
      data(){
        return {
          children: [],
        }
      },
      render(...args){
        return self.render.call(this, self, ...args)
      }
    })
  }

  get $meta(){
    return Object.assign(super.meta(), this.meta())
  }
}
