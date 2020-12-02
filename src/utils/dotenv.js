const camelCase = require('camelcase')

module.exports = function(path) {
  let envs = {}
  if (path) {
    require('dotenv').config({ path })

    Object.keys(process.env).forEach(key => {
      if (key.startsWith('TPC_')) {
        const group = camelCase(key.split('_')[1])
        const nk = camelCase(key.split('_').slice(2).join())
        if (!envs[group]) {
          envs[group] = {}
        }
        envs[group][nk] = process.env[key]
      }
    })
  }
  return envs
}
