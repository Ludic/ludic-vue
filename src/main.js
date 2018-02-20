import UILayer from './ui/components/UILayer'
import {ludicInstall, vueInstall} from './util/util'
export default class LudicVue {
}
LudicVue.install = vueInstall
LudicVue.plugin = ludicInstall

export * from './ui/index.js'
export * from './util/util.js'
