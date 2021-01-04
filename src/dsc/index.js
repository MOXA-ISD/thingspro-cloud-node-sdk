const auth = require('../lib/auth')
const project = require('./project')
const device = require('./device')
const tag = require('./tag')

module.exports = gv => {
  return {
    login: auth(gv, 'dsc').login,
    logout: auth(gv, 'dsc').logout,
    token: gv.sessions.dsc.token,
    request: gv.requests.dsc,
    me: gv.profiles.dsc,
    project: project(gv),
    device:  device(gv),
    tag: tag(gv)
  }
}