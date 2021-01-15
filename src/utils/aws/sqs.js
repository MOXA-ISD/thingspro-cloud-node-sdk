const AWS = require('aws-sdk')

let AWSAccount
const cfg = {
  region: process.env.AWS_DEFAULT_REGION
}

const sqs = new AWS.SQS({
  apiVersion: '2012-11-05',
  region: cfg.region
})

const getAWSAccount = async() => {
  try {
    const sts = new AWS.STS()
    const data = await sts.getCallerIdentity({}).promise()
    return data.Account
  } catch(err) {
    console.error(err)
    throw err
  }
}

const init = async() => {
  AWSAccount = await getAWSAccount()
  return
}

const getQueueUrl = (queueName) => {
  return `${sqs.endpoint.href}${AWSAccount}/${queueName}`
}

const sendMessage = async(queueName, body, attr) => {
  let params = {
    DelaySeconds: 0,
    QueueUrl: getQueueUrl(queueName)
  }

  if(attr !== undefined) {
    params.MessageAttributes = attr
  }

  if(typeof body === 'string') {
    params.MessageBody = body
  } else {
    params.MessageBody = JSON.stringify(body)
  }

  try {
    return await sqs.sendMessage(params).promise()
  } catch(err) {
    console.log('Queue send Error: ', err)
  }
}

const deleteMessage = async(queueName, receiptHandle) => {
  const deleteParams = {
    QueueUrl: getQueueUrl(queueName),
    ReceiptHandle: receiptHandle
  }
  return await sqs.deleteMessage(deleteParams).promise()
}

const receiveMessage = async(queueName, handler) => {
  const waitTimeSeconds = 20
  var params = {
    AttributeNames: [
      'SentTimestamp'
    ],
    MaxNumberOfMessages: 1,
    MessageAttributeNames: [
      'All'
    ],
    QueueUrl: getQueueUrl(queueName),
    //VisibilityTimeout: 2,
    WaitTimeSeconds: waitTimeSeconds
  }

  // eslint-disable-next-line no-constant-condition
  while(true) {
    let startTime = Date.now()
    let receiptHandle = null

    try {
      let data = await sqs.receiveMessage(params).promise()
      receiptHandle = data.Messages[0].ReceiptHandle

      handler(JSON.parse(data.Messages[0].Body))
        .then(async() => {
          await deleteMessage(queueName, receiptHandle)
          receiptHandle = null
        }).catch(err => {})
    } catch(err) {
      const timeExceed = (Date.now() - startTime)/1000
      if(timeExceed <= waitTimeSeconds) {
        console.log('Queue Receive Error: ', err)
        if(receiptHandle !== null) {
          const result = await deleteMessage(queueName, receiptHandle)
          console.log('Broken Message Deleted', result)
          receiptHandle = null
        }
      }
    }
  }
}

const receiveMessageOnce = async(queueName) => {
  try {
    const params = {
      QueueUrl: getQueueUrl(queueName),
      MaxNumberOfMessages: 1,
      WaitTimeSeconds: 5
    }
    const recvResult = await sqs.receiveMessage(params).promise()
    return recvResult
  } catch(err) {
    console.error(err)
    throw err
  }
}

module.exports = {
  receiveMessage,
  sendMessage,
  init,
  receiveMessageOnce,
  deleteMessage
}
