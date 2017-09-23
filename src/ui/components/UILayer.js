import UIComponent from './UIComponent'

let mouseEvents = function mouseEvents(binder){
  let f = function(){
    binder.$mouseEvent.call(binder, event)
  }
  let events = {}
  return ['click', 'mousedown', 'mouseup', 'mousemove', 'mouseout', 'mouseenter', 'mouseleave']
    .reduce((obj, event)=>((obj[event] = f) && obj), events)
}

export default class UILayer extends UIComponent {

  constructor(){
    super()
    this.children = []
    this.named = new Proxy({}, {
      set: (target, property, value, receiver)=>{
        if(this.$vm != null){
          this.$vm.$set(target, property, value)
        } else {
          target[property] = value
        }
        return true
      }
    })
  }

  data(self){
    return {
      children: self.children,
      named: self.named,
    }
  }

  $mouseEvent(event){
    if(this.onMouseEvent != null){
      this.onMouseEvent(event)
    }
  }

  render(self, h){
    return h('div', {
      class: {
        'ludic--ui-layer': true,
      },
      style: {
        position: 'relative',
        overflow: 'hidden',
      },
      on: {
        ...(mouseEvents(self))
      },
    }, [...this.children, ...Object.values(this.named)].map((child)=>{
      if(child instanceof UIComponent){
        return h(child.$componentDef)
      }
      return child
    }))
  }

  // user methods
  push(comp){
    this.children.push(comp)
  }
  set(name, comp){
    if(this.$vm != null){
      this.$vm.$set(this.named, name, comp)
    } else {
      this.named = Object.assign({}, this.named, {name: comp})
    }
  }

}
