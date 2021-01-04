const auth = require('../lib/auth')

module.exports = gv => {
  return {
    login: auth(gv, 'admin').login,
    logout: auth(gv, 'admin').logout,
    token: gv.sessions.admin.token,
    request: gv.requests.admin,
    me: gv.profiles.admin
  }
}