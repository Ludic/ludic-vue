<template lang="html">
  <div class="ludic-app-container" :style="containerStyle">
    <slot name="canvas">
      <canvas ref="canvas" id="ludic-canvas" class="ludic-canvas" :class="{'full-window': fullWindow}" :width="c_width" :height="c_height" :tabindex="tabindex" @resize="onCanvasResize()"></canvas>
    </slot>
    <slot>
      <ludic-ui :ui-component="uiLayer"></ludic-ui>
    </slot>
  </div>
</template>

<script>
import {app} from 'ludic'
import UILayer from '../ui/components/UILayer'
// instantiate a UILayer to get the componentDef
export default {
  name: "LudicAppComponent",
  props: {
    /* LudicApp properties */
    // optionally pass a sub-classed LudicApp class to be instantiated
    app: {default: ()=>app},
    // optionally pass an array of plugins to use
    plugins: {default: ()=>[]},
    // optionally pass an update function to be used by the LudicApp
    update: {default: undefined},
    // optionally pass config options to be used by the LudicApp constructor
    config: {default: ()=>{}},
    // optionally will add a ui layer (and install ludic-ui)
    useLudicUi: {type: Boolean, default: false},

    /* ludic-app-container properties */
    // width and height of the canvas in the container
    width: {type: Number, default: 600},
    height: {type: Number, default: 338},
    fullWindow: {type: Boolean, default: false},
    // optionally set the tabindex used by the canvas element
    tabindex: {type: String, default: '1'},
    // optionally choose not to automatically run the app after its instantiated
    runApp: {type: Boolean, default: true},
  },
  data(){
    return {
      defaultConfig: {
      },
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,

      uiLayer: null,
    }
  },
  computed: {
    cfg(){
      return Object.assign({
        // 'el' can be a selector or the HTMLElement itself
        el: this.$refs.canvas,
      },this.defaultConfig,this.config)
    },
    c_width(){
      return this.fullWindow ? this.windowWidth : this.width
    },
    c_height(){
      return this.fullWindow ? this.windowHeight : this.height
    },

    containerStyle(){
      return {
        position: 'relative',
        width: `${this.c_width}px`,
        height: `${this.c_height}px`,
      }
    }
  },
  mounted(){
    window.addEventListener('resize', this.onResize)
    // TODO: load plugins
    if(this.useLudicUi){
      this.uiLayer = new UILayer()
      // allow click events to pass through to the canvas
      this.uiLayer.onMouseEvent = (e)=>{
        this.app.canvas.el.dispatchEvent(new e.constructor(e.type, e))
      }
      this.app.use((_app)=>{
        _app.$ui = this.uiLayer
      })
    }
    try {
      this._app = Reflect.construct(this.app, [this.cfg])
    } catch (e) {
      console.error('e',e)
    }
    this.$emit('app-ready', this._app);
    if(this.runApp){
      this._app.run(this.update);
    }
  },
  methods: {
    onResize(){
      this.windowWidth = window.innerWidth
      this.windowHeight = window.innerHeight
    },
  },
}
</script>

<style lang="css">
.ludic-app-container {
  display: block;
  position: relative;
}
.ludic-canvas {
  outline: none;
  border: none;
}
.ludic-canvas.full-window {
  position: fixed;
  height: 100vh;
  width: 100vw;
}
.ludic-app-container > .ludic--ui-layer {
  position: absolute !important;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
}
</style>
