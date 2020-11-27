const auth = require('../lib/auth')
const project = require('./project')
const device = require('./device')

module.exports = gv => {
  const lib = {
    auth: auth(gv, 'dsc'),
    project: project(gv),
    device: device(gv)
  }
  return {
    login: lib.auth.login,
    logout: lib.auth.logout,
    token: gv.sessions.dsc.token,
    request: gv.requests.dsc,
    me: gv.profiles.dsc,
    project: lib.project,
    device: lib.device
  }
}