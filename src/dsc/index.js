const auth = require('../lib/auth')

module.exports = function(gv) {
  const lib = {
    auth: auth(gv, 'dsc')
  }
  return {
    login: lib.auth.login,
    logout: lib.auth.logout,
    token: gv.sessions.dsc.token,
    request: gv.requests.dsc,
    me: gv.profiles.dsc
  }
}