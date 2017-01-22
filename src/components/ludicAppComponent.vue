<template lang="html">
  <div class="ludic-app-container">
    <slot>
      <canvas ref="canvas" id="ludic-canvas" class="ludic-canvas" :width="width" :height="height" :tabindex="tabindex"></canvas>
    </slot>
  </div>
</template>

<script>
import {LudicApp} from 'ludic'
export default {
  name: "LudicAppComponent",
  props: {
    /* LudicApp properties */
    // optionally pass a sub-classed LudicApp class to be instantiated
    app: {default: ()=>LudicApp},
    // optionally pass an update function to be used by the LudicApp
    update: {default: undefined},
    // optionally pass config options to be used by the LudicApp constructor
    config: {default: ()=>{}},

    /* ludic-app-container properties */
    // width and height of the canvas in the container
    width: {type: Number, default: 600},
    height: {type: Number, default: 338},
    // optionally set the tabindex used by the canvas element
    tabindex: {type: String, default: '1'},
    // optionally choose not to automatically run the app after its instantiated
    runApp: {type: Boolean, default: true},
  },
  data(){
    return {
      defaultConfig: {
      },
    }
  },
  computed: {
    cfg(){
      return Object.assign({
        // 'el' can be a selector or the HTMLElement itself
        el: this.$refs.canvas,
      },this.defaultConfig,this.config)
    },
  },
  mounted(){
    this._app = new this.app(this.cfg);
    this.$emit('app-ready', this._app);
    if(this.runApp){
      this._app.run(this.defaultUpdate);
    }
  },
  methods: {
    defaultUpdate(...args){
      if(this.update){
        this.update(...args);
      } else {
        this._app.update(...args)
      }
    },
  }
}
</script>

<style lang="css">
.ludic-canvas {
  display: block;
  margin: auto;
  outline: none;
  border: 1px solid black;
}
</style>
