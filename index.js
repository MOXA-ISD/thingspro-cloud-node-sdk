const gv = require('./src/lib/global-variable')
const svc = {
  admin: require('./src/admin'),
  dsc: require('./src/dsc'),
  dlm: require('./src/dlm'),
  pic: require('./src/pic')
}

const utils = {
  random: require('./src/utils/random'),
  dotenv: require('./src/utils/dotenv'),
  mocha: {
    hooks: require('./src/utils/mocha/hooks'),
    device: require('./src/utils/mocha/device')
  },
  aws: {
    iot: require('./src/utils/aws/iot'),
    sqs: require('./src/utils/aws/sqs'),
    ssm: require('./src/utils/aws/ssm')
  }
}

module.exports = function(serverUrl = {
  admin: 'https://api.thingsprocloud.com/admin-api/v1',
  dsc: 'https://api.thingsprocloud.com/dsc/v1',
  dlm: 'https://api.thingsprocloud.com/api/v1',
  pic: 'https://pic.thingsprocloud.com/api/v1'
}) {

  gv.setServerUrl(serverUrl)

  return {
    urls: gv.urls,
    setServerUrl: (url) => gv.setServerUrl(url),
    admin: () => svc.admin(gv),
    dsc: () => svc.dsc(gv),
    dlm: () => svc.dlm(gv),
    pic: () => svc.pic(gv),
    utils
  }
}
