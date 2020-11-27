const axios = require('axios')
const https = require('https')

let urls = {
  admin: 'https://api.thingsprocloud.com/admin-api/v1',
  dsc: 'https://api.thingsprocloud.com/dsc/v1',
  dlm: 'https://api.thingsprocloud.com/api/v1',
  rtm: 'https://api.thingsprocloud.com/rtm/v1',
  pic: 'https://pic.thingsprocloud.com/api/v1',
  sr: 'https://repo.thingsprocloud.com/api/v1'
}

let sessions = {
  admin: {
    token: '',
    expiredAt: 0
  },
  dsc: {
    token: '',
    expiredAt: 0
  },
  dlm: {
    token: '',
    expiredAt: 0
  }
}

const defaultAxios = (url) =>
  axios.create({
    baseURL: url,
    timeout: 30000,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
    httpsAgent: new https.Agent({
      rejectUnauthorized: false
    }),
    validateStatus: () => true
  })


let requests = {
  admin: defaultAxios(urls.admin),
  dsc: defaultAxios(urls.dsc),
  dlm: defaultAxios(urls.dlm),
  rtm: defaultAxios(urls.rtm),
  pic: defaultAxios(urls.pic),
  sr: defaultAxios(urls.sr)
}

let profiles = {
  admin: {},
  dsc: {},
  dlm:{}
}

const setServerUrl = (serverUrl) => {
  Object.keys(serverUrl).forEach(key => {
    if (serverUrl[key]) {
      urls[key] = serverUrl[key]
      requests[key] = defaultAxios(serverUrl[key])
      sessions[key] = { token: '', expiredAt: 0 }
      profiles[key] = {}
    }
  })
}

const setSession = (auth) => {
  Object.keys(auth).forEach(key => {
    if (auth[key]) {
      sessions[key] = auth[key]
      requests[key].defaults.headers['Authorization'] = `Bearer ${sessions[key].token}`
    } else {
      sessions[key] = { token:'', expiredAt: 0 }
      requests[key] = defaultAxios(urls[key])
    }
  })
}

const setCert = (certs) => {
  Object.keys(certs).forEach(key => {
    if (certs[key]) {
      requests[key].defaults.httpsAgent = new https.Agent({
        rejectUnauthorized: false,
        cert: certs[key].cert,
        key: certs[key].key
      })
    } else {
      requests[key].defaults.httpsAgent =new https.Agent({
        rejectUnauthorized: false
      })
    }
  })
}

const setProfile = (users) => {
  Object.keys(users).forEach(key => {
    if (users[key]) {
      profiles[key] = users[key]
    }
  })
}

module.exports = {
  urls,
  sessions,
  requests,
  profiles,
  setServerUrl,
  setSession,
  setProfile,
  setCert
}
