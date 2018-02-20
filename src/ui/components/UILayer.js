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

  constructor(app){
    super()
    this.$app = app
    this.$children = []
    this.$refs = new Proxy({}, {
      set: (target, property, value, receiver)=>{
        if(this.$vm != null){
          this.$vm.$set(target, property, value)
          return true
        } else {
          target[property] = value
          return true
        }
        return false
      },
      deleteProperty: (target, property)=>{
        if(this.$vm != null){
          this.$vm.$delete(target, property)
          return true
        } else if(property in target){
          delete target[property]
          return true
        }
        return false
      },
    })

  }

  options(componentDef){
    let component = this
    return {
      provide: {
        // This provides the LudicApp as $app onto every child of this component.
        '$app': component.$app,
      },
      data(){
        return {
          children: component.$children,
          refs: component.$refs,
        }
      },
      beforeCreate(){
        // we dont want this to be reactive because changes on it will cause
        // unwanted render cycles
        // this.$app = component.$app
      },
      render(h){
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
    }
  }

  $mouseEvent(event){
    if(this.onMouseEvent != null){
      this.onMouseEvent(event)
    }
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
