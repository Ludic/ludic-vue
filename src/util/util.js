import LudicAppComponent from '../components/ludicAppComponent'
import UILayer from '../ui/components/UILayer'
import { LudicUI } from '../ui/index'

export function ludicEmit(name, arg){
  this.$emit(`ludic:${name}`, arg)
}
export function ludicMethod(name, cb){
  return function(...args){
    ludicEmit(name, [this, (cb && cb.call(null, ...args))])
  }
}
export function method(name, cb){
  return {
    [name]: ludicMethod(name, cb),
  }
}
export function methods(obj){
  return Object.keys(obj).reduce((ret, name)=>{
    ret[name] = method(name, obj[name])[name]
    return ret
  }, {})
}

export function mergeOptions(vm){
  mergeLudicMethods(vm)
  mergeLudicComponents(vm)
  mergeLudicInput(vm)
}

export function mergeLudicMethods({$options}){
  let {ludicMethods={}} = $options
  for(let methodKey in ludicMethods){
    $options.methods = Object.assign($options.methods || {}, {
      [methodKey]: ludicMethod(methodKey, ludicMethods[methodKey])
    })
  }
}

export function mergeLudicComponents({$options}){
  let {ludicComponents={}} = $options
  for(let compKey in ludicComponents){
    $options.components = Object.assign($options.components || {}, {
      [compKey]: ludicComponents[compKey].$raw
    })
  }
}

export function mergeLudicInput(vm){
  let {ludicInput} = vm.$options
  if(typeof ludicInput === 'function'){
    let ludicInputs = ludicInput.call(vm)
    for(let inputKeyName in ludicInputs){
      vm[inputKeyName] = vm.$app.$input.newInputListener(ludicInputs[inputKeyName], vm, true)
    }
  }
}

export function ludicInstall(app){
  app.$ui = new UILayer(app)
  // allow click events to pass through to the canvas
  app.$ui.onMouseEvent = (e)=>{
    app.$canvas.el.dispatchEvent(new e.constructor(e.type, e))
  }
}
export function vueInstall(Vue){
  Vue.component('ludic-app', LudicAppComponent)
  Vue.component('ludic-ui', LudicUI)
}
