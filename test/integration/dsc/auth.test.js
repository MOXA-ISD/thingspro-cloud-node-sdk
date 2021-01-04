const expect = require('chai').expect

describe('dsc auth', function() {
  this.retries(5)
  this.timeout(60000)
  let tpc, cfg

  before(async function() {
    tpc = require('../../../index')()
    cfg = tpc.utils.dotenv('.env')
    tpc.setServerUrl(cfg.url)
  })

  it('should login dsc', async function() {
    const { email, password } = cfg.login
    await tpc.dsc().login(email, password)
    expect(tpc.dsc().me.email).to.equal(email)
    expect(tpc.dsc().token).to.not.equal('')
  })

  it('should send request with session', async function() {
    const { status } = await tpc.dsc().request.get('/companys')
    expect(status).to.equal(200)
  })

  it('should logout dsc', async function() {
    await tpc.dsc().logout()
    expect(tpc.dsc().me).to.deep.equal({})
    expect(tpc.dsc().token).to.equal('')
  })

  it('should response failed when request without session', async function() {
    const { status } = await tpc.dsc().request.get('/companys')
    expect(status).to.above(400)
  })
})