const expect = require('chai').expect

describe('dlm project', function() {
  this.retries(5)
  this.timeout(60000)
  let tpc, cfg, random, projectId, projectName

  before(async function() {
    tpc = require('../../../index')()
    cfg = tpc.utils.dotenv('.env')
    tpc.setServerUrl(cfg.url)
    random = tpc.utils.random

    const { email, password } = cfg.login
    await tpc.dlm().login(email, password)

    projectName = random.projectName()
  })

  it('should create a project', async function() {
    const project = await tpc.dlm().project.create(projectName)
    expect(project.name).to.equal(projectName)
  })

  it('should findOrCreate a project', async function() {
    const project = await tpc.dlm().project.findOrCreate(projectName)
    expect(project.name).to.equal(projectName)
    projectId = project.projectId
  })

  it('should delete a project by projectId', async function() {
    const { $r } = await tpc.dlm().project.delete(projectId)
    expect($r.status).to.equal(204)
  })
})
