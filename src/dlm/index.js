const auth = require('../lib/auth')
const project = require('./project')
const device = require('./device')
const pkg = require('./package')

module.exports = function(gv) {
  const lib = {
    auth: auth(gv, 'dlm'),
    project: project(gv),
    device: device(gv),
    package: pkg(gv)
  }
  return {
    login: lib.auth.login,
    logout: lib.auth.logout,
    token: gv.sessions.dlm.token,
    request: gv.requests.dlm,
    me: gv.profiles.dlm,
    project: lib.project,
    device: lib.device,
    package: lib.package
  }
}