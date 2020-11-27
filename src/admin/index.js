const auth = require('../lib/auth')

module.exports = function(gv) {
  const lib = {
    auth: auth(gv, 'admin')
  }
  return {
    login: lib.auth.login,
    logout: lib.auth.logout,
    token: gv.sessions.admin.token,
    request: gv.requests.admin,
    me: gv.profiles.admin
  }
}