const AWS = require('aws-sdk')

var ssm = new AWS.SSM({
  // ssm: '2014-11-06',
  region: process.env.AWS_DEFAULT_REGION
})

async function getSecret(keyName, secretVersion) {
  try {
    const params = {
      Name: keyName,
      WithDecryption: true
    }
    const data = await ssm.getParameter(params).promise()
    return data.Parameter.Value
  } catch(err) {
    console.error('getSecret fail: ' + keyName)
    console.error(err)
    throw err
  }
}

exports.getSecret = getSecret
