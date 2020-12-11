const expect = require('chai').expect

describe('dlm auth', function() {
  this.retries(5)
  this.timeout(60000)
  let tpc, cfg

  before(async function() {
    tpc = require('../../index')()
    cfg = tpc.utils.dotenv('.env')
    tpc.setServerUrl(cfg.url)
  })

  it('should login dlm', async function() {
    const { email, password } = cfg.login
    await tpc.dlm().login(email, password)
    expect(tpc.dlm().me.email).to.equal(email)
    expect(tpc.dlm().token).to.not.equal('')
  })

  it('should send request with session', async function() {
    const { status } = await tpc.dlm().request.get('/companys')
    expect(status).to.equal(200)
  })

  it('should logout dlm', async function() {
    await tpc.dlm().logout()
    expect(tpc.dlm().me).to.deep.equal({})
    expect(tpc.dlm().token).to.equal('')
  })

  it('should response failed when request without session', async function() {
    const { status } = await tpc.dlm().request.get('/companys')
    expect(status).to.above(400)
  })
})