const expect = require('chai').expect
const should = require('should')

describe('pic auth', function() {
  this.timeout(60000)
  let tpc, cfg

  before(async function() {
    tpc = require('../../index')()
    cfg = tpc.utils.dotenv('.env')
    tpc.setServerUrl(cfg.url)
  })

  it('should access pic api with client cert', async function() {
    tpc.pic().setCert('', '')
    const { status } = await tpc.pic().request.get('/health')
    expect(status).to.equal(200)
  })

  it('should response failed when request without client cert', async function() {
    try {
      tpc.pic().setCert()
      await tpc.pic().request.get('/health')
      should.fail('no error was thrown when it should have been')
    }
    catch (error) {
      expect(error.code).to.equal('ECONNRESET')
    }
  })
})