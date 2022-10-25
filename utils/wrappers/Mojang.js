const axios = require('axios').default

class Mojang {
  Player = (player) => new Promise((res) => {
    axios.get(`https://playerdb.co/api/player/minecraft/${player}`)
      .then(({ data }) => {
        // console.log(data)
        if (!data || !data.data.player.id)
          return res({ exists: false })
        res({
          ...data,
          formattedUuid: data.data.player.id,
          uuid: data.data.player.raw_id,
          exists: true
        })
      })
      .catch((err) => {
        res({ exists: false, outage: true, err })
      })
  })
}

module.exports = Mojang;