import Vue from 'vue'
import * as Snoowrap from 'snoowrap'

Vue.prototype.$reddit = new Snoowrap({
  userAgent: process.env.REDDIT_UA,
  clientId: process.env.REDDIT_CID,
  clientSecret: process.env.REDDIT_CS,
  refreshToken: process.env.REDDIT_RT
})

function addLink (client, hydrus, item) {
  return new Promise((resolve) => {
    var link = 'https://reddit.com' + item.permalink
    const pget_url_files = (url) => {
      return new Promise((resolve) => {
        hydrus.get_url_files(url, (res) => {
          resolve(res)
        })
      })
    }
    const padd_file = (actions) => {
      return new Promise((resolve) => {
        hydrus.add_url(actions, (res) => {
          resolve(res)
        })
      })
    }
    pget_url_files(link)
    resolve()
  })
}

async function addSaved (client, hydrus) {
  client.getMe().getSavedContent({ skipReplies: true, limit: 256 })
    .then((rdata) => {
      return rdata.reduce(async (prevp, nextd) => {
        await prevp
        return addLink(client, hydrus, nextd)
      }, Promise.resolve())
    })
}

addSaved(null, null)
