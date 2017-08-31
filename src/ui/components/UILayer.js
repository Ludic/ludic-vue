import UIComponent from './UIComponent'
export default class UILayer extends UIComponent {

  constructor(){
    super()
  }

  meta(){
    return {
      class: {
        'ludic--ui-layer': true,
      },
      style: {
        position: 'relative',
      },
    }
  }

  render(self, h){
    return h('div', self.$meta, this.children.map((child)=>{
      if(child instanceof UIComponent){
        return h(child.$componentDef)
      }
      return child
    }))
  }
}
