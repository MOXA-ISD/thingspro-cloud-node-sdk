const tpc = require('../../index')()

async function main() {

  // load configs from .env
  const cfg = tpc.utils.dotenv('.env')

  // change server url
  tpc.setServerUrl(cfg.url)

  // login
  const { email, password } = cfg.login
  await tpc.admin().login(email, password)

  // get companies by request api
  const { data } = await tpc.admin().request.get('/companys')
  console.log(data.data)
}

main()
