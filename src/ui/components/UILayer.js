import UIComponent from './UIComponent'
import LudicComponent from './LudicComponent'

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
    this.$children = []
    this.__refs = {}
    this.$refs = new Proxy(this.__refs, {
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

  data(component){
    return {
      children: component.$children,
      refs: component.$refs,
    }
  }

  $mouseEvent(event){
    if(this.onMouseEvent != null){
      this.onMouseEvent(event)
    }
  }

  render(component, h){
    return h('div', {
      class: {
        'ludic--ui-layer': true,
      },
      style: {
        position: 'relative',
        overflow: 'hidden',
      },
      on: {
        ...(mouseEvents(component))
      },
    },
    [...this.children, ...Object.values(this.refs)].filter(child => child != null).map((child)=>{
      if(child instanceof UIComponent){
        return h(child.$componentDef)
      } else if(child.constructor.name === 'VueComponent') {
        return h(child)
      } else {
        console.warn('UILayer', 'Unknown child instance type', child)
      }
      return child
    })
    )
  }

  // /**
  //  * Returns the combination of $children and $refs to represent everything that
  //  * is going to be rendered as children of this component.
  //  */
  // get children(){
  //   return [...this.$children, ...Object.values(this.$refs)]
  // }

  // user methods
  push(comp){
    this.$children.push(comp)
  }
  set(name, comp){
    if(this.$vm != null){
      this.$vm.$set(this.$refs, name, comp)
    } else {
      this.$refs = Object.assign({}, this.$refs, {name: comp})
    }
  }

}
