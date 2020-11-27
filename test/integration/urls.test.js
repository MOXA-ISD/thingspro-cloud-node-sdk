const expect = require('chai').expect

describe('url', function() {
  this.retries(5)
  this.timeout(60000)
  let tpc, cfg

  before(async function() {
    tpc = require('../../index')()
    cfg = tpc.utils.dotenv('.env')
    tpc.setServerUrl(cfg.url)
  })

  it('should get url', async function() {
    const urls = tpc.urls

    expect(Object.keys(urls).length).to.above(5)
  })
})