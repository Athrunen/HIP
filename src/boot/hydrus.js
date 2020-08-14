import * as Hydrus from 'hydrus.js'
import Vue from 'vue'

var client = new Hydrus({
  key: process.env.HYDRUS_KEY
})

client.api_version((res) => {
  console.log(res)
})

Vue.prototype.$hydrus = client
