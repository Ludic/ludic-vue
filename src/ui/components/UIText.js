import UIComponent from './UIComponent'

export default class UIText extends UIComponent {
  constructor(args) {
    super()
    let options = {
      text: '',
      x: 0,
      y: 0,
      color: 'black',
      position: 'absolute',
    }
    if(typeof args == 'string'){
      options.text = args
    } else if(typeof args == 'object' && !Array.isArray(args)){
      Object.assign(options, args)
    }
    this.text = options.text
    this.x = options.x
    this.y = options.y
    this.color = options.color
    this.position = options.position
  }

  data(self){
    return {
      text: self.text,
      position: self.position,
      color: self.color,
      x: self.x,
      y: self.y,
    }
  }

  render(self, h){
    return h('span', {
      style: {
        color: this.color,
        position: this.position,
        left: `${this.x}px`,
        bottom: `${this.y}px`,
        'white-space': 'nowrap',
      },
    }, this.text)
  }
}
