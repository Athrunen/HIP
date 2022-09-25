<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md row items-start q-gutter-md">
        <HImage v-for='id in ids' :key='id' :img_id='id' @image-loaded='himgloaded(id)' @predict='predict()'/>
    </div>
  </q-page>
</template>

<script>
import HImage from 'components/HImage.vue'

export default {
  name: 'PageIndex',
  components: { HImage },
  data () {
    return {
      ids: [],
      loaded_ids: []
    }
  },
  created: function () {
    setTimeout(() => {
      this.$reddit.getMe().getSavedContent({ skipReplies: true, limit: 256 })
        .then((rdata) => {
          for (d of rdata) {
            if (d.constructor.name !== "Submission") {
              continue
            }
            this.$hydrus.add_file('https://reddit.com' + d.permalink, (res) => {
              if (res.status === 2 || res.status === 3) {
                this.rfails += 1
                continue
              } else if (res.status === 1) {
                this.rfails = 0
              } else {
                continue
              }
            })
          } 
        })
    }, 5)
    if (this.ids.length === 0) {
      return
    }
    this.$axios.get('http://localhost:45869/get_files/search_files?system_inbox=true&Hydrus-Client-API-Access-Key=' + process.env.HYDRUS_KEY)
      .then((res) => {
        this.ids = res.data.file_ids
      })
  },
  methods: {
    predict () {
      var id = this.loaded_ids.shift()
      console.log('Predicting: ' + id)
      this.$root.$emit('predict', id)
    },
    himgloaded (id) {
      this.loaded_ids.push(id)
      if (this.loaded_ids.length === this.ids.length) {
        this.$q.notify('All images loaded')
        this.predict()
      }
    }
  }
}
</script>
