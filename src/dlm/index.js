const auth = require('../lib/auth')
const project = require('./project')
const device = require('./device')
const pkg = require('./package')
const tag = require('./tag')

module.exports = gv => {
  return {
    login: auth(gv, 'dlm').login,
    logout: auth(gv, 'dlm').logout,
    token: gv.sessions.dlm.token,
    request: gv.requests.dlm,
    me: gv.profiles.dlm,
    project: project(gv),
    device: device(gv),
    package: pkg(gv),
    tag: tag(gv)
  }
}