export function method(name, cb){
  return {
    [name](...args){
      this.$emit(`ludic:${name}`, [this, (cb && cb.call(null, ...args))])
    }
  }
}
export function methods(obj){
  return Object.keys(obj).reduce((ret, name)=>{
    ret[name] = method(name, obj[name])[name]
    return ret
  }, {})
}
