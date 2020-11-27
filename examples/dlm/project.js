const tpc = require('../../index')()

async function main() {

  // load configs from .env
  const cfg = tpc.utils.dotenv('.env')

  // change server url
  tpc.setServerUrl(cfg.url)

  // login
  const { email, password } = cfg.login
  await tpc.dlm().login(email, password)

  // get all projects
  const projects = await tpc.dlm().project.get()
  console.log(projects)
}

main()
