const expect = require('chai').expect

describe('dlm tag', function() {
  this.retries(5)
  this.timeout(60000)
  let tpc, cfg, random, projectId, tagId, tagName

  before(async function() {
    tpc = require('../../../index')()
    cfg = tpc.utils.dotenv('.env')
    tpc.setServerUrl(cfg.url)
    random = tpc.utils.random

    const { email, password } = cfg.login
    await tpc.dlm().login(email, password)

    const project = await tpc.dlm().project.create(random.projectName())
    projectId = project.projectId
    tagName = random.tagName()
  })

  it('should create a tag', async function() {
    const tag = await tpc.dlm().tag.create(projectId, tagName, random.colour())
    expect(tag.tagName).to.equal(tagName)
  })

  it('should findOrCreate a tag', async function() {
    const tag = await tpc.dlm().tag.findOrCreate(projectId, tagName, random.colour())
    expect(tag.tagName).to.equal(tagName)
    tagId = tag.tagId
  })

  it('should delete a tag by tagId', async function() {
    const { $r } = await tpc.dlm().tag.delete(projectId, tagId)
    expect($r.status).to.equal(204)
  })
})