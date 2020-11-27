const axios = require('axios')
const moment = require('moment')

module.exports = (gv, service) => {
  const session = gv.sessions[service]
  const request = gv.requests[service]

  const login = async(loginEmail, loginPassword) => {
    if (!loginEmail || !loginPassword) { return }

    if (session.expiredAt >= moment()) {
      return session.token
    }

    const { status, data } = await request.post(
      '/login',
      { email: loginEmail, password: loginPassword }
    )
    if (status <= 299){
      let session = {}
      session[service] = {
        token: data.data.token,
        expiredAt: moment().add(5, 'minutes')
      }
      gv.setSession(session)
      let profile = {}
      profile[service] =  data.data.user
      gv.setProfile(profile)
      return gv.profiles[service]
    } else {
      throw new Error(data.error.message)
    }
  }

  const logout = async() => {
    try {
      await request.post('/logout')
      let session = {}
      session[service] = {
        token: '',
        expiredAt: 0
      }
      gv.setSession(session)
      let profile = {}
      profile[service] = {}
      gv.setProfile(profile)
      return
    } catch(e) {
      throw new Error(e)
    }
  }

  return {
    login,
    logout
  }
}