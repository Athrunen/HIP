import Vue from 'vue'
// import * as tf from '@tensorflow/tfjs'
import * as nsfwjs from 'nsfwjs'

nsfwjs.load()
  .then((model) => {
    Vue.prototype.$nsfwmodel = model
  })
// Vue.prototype.$tf = tf
