const tpc = require('../..')()

async function main() {

  // load configs from .env
  const cfg = tpc.utils.dotenv('.env')

  // change server url
  tpc.setServerUrl(cfg.url)

  // login
  const { email, password } = cfg.login
  await tpc.admin().login(email, password)

  // get logged in user profile
  const me = tpc.admin().me
  console.log(me)

  // logout
  await tpc.admin().logout()
}

main()
