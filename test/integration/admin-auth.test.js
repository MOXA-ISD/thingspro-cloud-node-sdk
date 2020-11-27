const expect = require('chai').expect

describe('admin auth', function() {
  this.retries(5)
  this.timeout(60000)
  let tpc, cfg

  before(async function() {
    tpc = require('../../index')()
    cfg = tpc.utils.dotenv('.env')
    tpc.setServerUrl(cfg.url)
  })

  it('should login admin', async function() {
    const { email, password } = cfg.login
    await tpc.admin().login(email, password)
    expect(tpc.admin().me.email).to.equal(email)
    expect(tpc.admin().token).to.not.equal('')
  })

  it('should send request with session', async function() {
    const { status } = await tpc.admin().request.get('/companys')
    expect(status).to.equal(200)
  })

  it('should logout admin', async function() {
    await tpc.admin().logout()
    expect(tpc.admin().me).to.deep.equal({})
    expect(tpc.admin().token).to.equal('')
  })

  it('should response failed when request without session', async function() {
    const { status } = await tpc.admin().request.get('/companys')
    expect(status).to.above(400)
  })
})