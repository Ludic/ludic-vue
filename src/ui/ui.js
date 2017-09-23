import UIComponent from './components/UIComponent'
export default {
  props: {
    uiComponent: {type: Object, default: undefined},
  },
  render(h){
    return this.uiComponent != null && this.uiComponent instanceof UIComponent
      ? h(this.uiComponent.$componentDef)
      : h('div')
  }
}
