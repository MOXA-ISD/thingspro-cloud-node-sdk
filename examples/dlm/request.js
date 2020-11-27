const tpc = require('../../index')()

async function main() {

  // load configs from .env
  const cfg = tpc.utils.dotenv('.env')

  // change server url
  tpc.setServerUrl(cfg.url)

  // login
  const { email, password } = cfg.login
  await tpc.dlm().login(email, password)

  // get companies by request api
  const { data } = await tpc.dlm().request.get('/projects')
  console.log(data.data)
}

main()
