import UIComponent from './UIComponent'

export default class UIText extends UIComponent {
  constructor(text = '') {
    super()
    this.text = text
  }

  data(self){
    return {
      text: self.text,
    }
  }

  render(self, h){
    return h('span', {
    }, this.text)
  }
}
