const expect = require('chai').expect

describe('dsc project', function() {
  this.retries(5)
  this.timeout(60000)
  let tpc, cfg, request, random, projectId, projectName

  before(async function() {
    tpc = require('../../../index')()
    cfg = tpc.utils.dotenv('.env')
    tpc.setServerUrl(cfg.url)
    random = tpc.utils.random

    const { email, password } = cfg.login
    await tpc.dsc().login(email, password)

    request = tpc.dsc().request
    projectName = 'Integration Test'
  })

  it('should findOrCreate a project', async function() {
    const project = await tpc.dsc().project.findOrCreate(projectName)
    expect(project.name).to.equal(projectName)
    projectId = project.projectId
  })
})
