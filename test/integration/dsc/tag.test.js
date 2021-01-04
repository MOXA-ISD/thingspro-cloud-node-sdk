const expect = require('chai').expect

describe('dsc tag', function() {
  this.retries(5)
  this.timeout(60000)
  let tpc, cfg, request, random, project, projectId, tagId, tagName

  before(async function() {
    tpc = require('../../../index')()
    cfg = tpc.utils.dotenv('.env')
    tpc.setServerUrl(cfg.url)
    random = tpc.utils.random

    const { email, password } = cfg.login
    await tpc.dsc().login(email, password)

    request = tpc.dsc().request
    const r = await tpc.dsc().project.get()
    if (r.count== 0) {
      project = await tpc.dsc().project.create('Integration Test')
    } else {
      project = r.data[0]
    }
    projectId = project.projectId
    tagName = random.tagName()
  })

  it('should create a tag', async function() {
    const tag = await tpc.dsc().tag.create(projectId, tagName, random.colour())
    expect(tag.tagName).to.equal(tagName)
  })

  it('should findOrCreate a tag', async function() {
    const tag = await tpc.dsc().tag.findOrCreate(projectId, tagName, random.colour())
    expect(tag.tagName).to.equal(tagName)
    tagId = tag.tagId
  })

  it('should delete a tag by tagId', async function() {
    const { $r } = await tpc.dsc().tag.delete(projectId, tagId)
    expect($r.status).to.equal(204)
  })
})