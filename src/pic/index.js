const auth = require('../lib/auth')

module.exports = function(gv) {
  const lib = {
    auth: auth(gv, 'pic')
  }
  return {
    login: lib.auth.login,
    logout: lib.auth.logout,
    token: gv.sessions.pic.token,
    request: gv.requests.pic,
    me: gv.profiles.pic
  }
}