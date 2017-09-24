var path = require('path');
var fs = require('fs');
var merge = require('webpack-merge')
var base = require('./webpack.base.config.js')

/*
* ludic-vue dev config
*/

module.exports = function(env){
  return merge(base, {})
}
