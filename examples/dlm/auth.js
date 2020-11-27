const tpc = require('../../index')()

async function main() {

  // load configs from .env
  const cfg = tpc.utils.dotenv('.env')

  // change server url
  tpc.setServerUrl(cfg.url)

  // login
  const { email, password } = cfg.login
  await tpc.dlm().login(email, password)

  // get logged in user profile
  const me = tpc.dlm().me
  console.log(me)

  // logout
  await tpc.admin().logout()
}

main()
