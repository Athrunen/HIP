<template>
    <q-card :id="img_id">
        <q-img :src="img_src" @load="loaded" contain>
            <div class="text-subtitle2 absolute-bottom text-center">
                {{result}}
            </div>
            <template v-slot:loading>
                <q-spinner-gears color="white" />
            </template>
        </q-img>
    </q-card>
</template>

<script>
export default {
  name: 'HImage',
  data () {
    return {
      result: ''
    }
  },
  props: {
    img_id: {
      type: Number,
      default: 0
    }
  },
  computed: {
    img_src: function () {
      return 'http://localhost:8010/get_files/thumbnail?Hydrus-Client-API-Access-Key=' + process.env.HYDRUS_KEY + '&file_id=' + this.img_id
    }
  },
  methods: {
    loaded () {
      this.$emit('image-loaded', true)
    },
    predict (id) {
      if (this.img_id !== id) {
        // console.log('fired')
        return
      }
      // this.$axios.get(this.img_src, { responseType: 'blob' })
      // .then((res) => {
      // var reader = new window.FileReader()
      // reader.readAsDataURL(res.data)
      // reader.onload = () => {
      // var idu = reader.result
      var tmpImg = document.createElement('img')
      tmpImg.style.height = '250px'
      tmpImg.style.width = '250px'
      tmpImg.style.display = 'none'
      tmpImg.crossOrigin = 'anonymous'
      // tmpImg.style.visibility = 'hidden'
      tmpImg.onload = () => {
        this.$nsfwmodel.classify(tmpImg, 3)
          .then((pred) => {
            var tmpPred = ''
            var info = window.$('#' + this.img_id + ' > div > div.q-img__content > div')
            for (var cl of pred) {
              tmpPred += cl.className + ': ' + cl.probability.toFixed(2) + '\n'
              if (cl.probability >= 0.45) {
                info.addClass(cl.className.toLowerCase())
              }
            }
            this.result = tmpPred
            document.body.removeChild(tmpImg)
            setTimeout(() => {
              this.$emit('predict', true)
            }, 0)
          })
      // }
      }
      tmpImg.src = this.img_src // idu
      document.body.appendChild(tmpImg)
    }
  },
  created: function () {
    this.$root.$on('predict', this.predict)
  }
}
</script>

<style lang="sass" scoped>
.q-card
    width: 100%
    max-width: 250px
    height: 250px

.neutral, .drawing
    background: #0000ff80

.sexy, .hentai, .porn
    background: #ff000080

.q-img
    height: 250px
</style>
