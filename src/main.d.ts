
import * as Ludic from '@ludic/ludic'
import { Vue } from 'vue/types/vue'
import { PluginObject, PluginFunction } from 'vue'

export as namespace LudicVue

export class UIComponent {
  $vm: Vue
  $on: object
}

export class UILayer extends UIComponent {
  $app: Ludic.LudicApp
  $children: Array<UIComponent | Vue>
  $refs: {[key: string]: any}
  push(child: UIComponent | Vue): void
  set(name: string, child: UIComponent | Vue): void
}

declare module '@ludic/ludic' {
  // this is really a class but w/e it works
  interface LudicApp {
    $ui: UILayer
  }
}
