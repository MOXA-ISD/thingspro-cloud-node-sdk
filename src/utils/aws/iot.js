const AWS = require('aws-sdk')

const gv = {
  enrollCert: null,
  enrollKey: null,
  endpointAddress: null
}

const iot = new AWS.Iot({
  iot: '2015-05-28',
  region: process.env.AWS_DEFAULT_REGION
})

let iotData

async function init() {
  try {
    let endpointAddress = null
    var params = {
      endpointType: 'iot:Data-ATS'
    }
    if(gv.endpointAddress == null) {
      let endpoint = await iot.describeEndpoint(params).promise()
      if(typeof endpoint.endpointAddress !== 'string') {
        throw 'cannot get IoT core endpoint!!'
      }

      console.log('set IoT endpoint to: ' + endpoint.endpointAddress)
      gv.endpointAddress = endpoint.endpointAddress
    }
    endpointAddress = gv.endpointAddress

    iotData = new AWS.IotData({
      iotdata: '2015-05-28',
      endpoint: endpointAddress,
      region: process.env.AWS_DEFAULT_REGION
    })

    return
  } catch(err) {
    console.error(err)
    throw err
  }
}

async function describeThing(thingName) {
  let params = {
    thingName: thingName
  }
  try {
    let data = await iot.describeThing(params).promise()
    return data
  }
  catch(err) {
    if(err.statusCode === 404) {
      return null
    }
    console.log(err, err.stack) // an error occurred
    throw err
  }

}

async function listThingGroupsForThing(thingName) {
  var params = {
    thingName: thingName /* required */
    //maxResults: 'NUMBER_VALUE',
    //nextToken: 'STRING_VALUE'
  }
  try {
    let data = await iot.listThingGroupsForThing(params).promise()
    return data
  }
  catch(err) {
    if(err.statusCode === 404) {
      return null
    }
    console.log(err, err.stack) // an error occurred
    throw err
  }

}

async function getThingShadow(thingName) {
  let params = {
    thingName: thingName
  }
  try {
    let data = await iotData.getThingShadow(params).promise()
    //console.log('getThingShadow');
    //console.log(data);           // successful response
    return data
  }
  catch(err) {
    console.log(err, err.stack) // an error occurred
    throw err
  }
}


async function describeThingCert(certificateId) {
  var params = {
    certificateId: certificateId /* required */
  }
  try {
    let data = await iot.describeCertificate(params).promise()
    //console.log(data);           // successful response
    return data
  }
  catch(err) {
    console.log(err, err.stack) // an error occurred
    throw err
  }

}

async function listThingCerts() {
  var params = {
    ascendingOrder: true,
    //marker: 'STRING_VALUE',
    pageSize: 10
  }
  try {
    let data = await iot.listCertificates(params).promise()
    //console.log(data);           // successful response
    return data
  }
  catch(err) {
    console.log(err, err.stack) // an error occurred
    throw err
  }

}

async function listThingPrincipals(thingName) {
  let params = {
    thingName: thingName /* required */
  }
  try {
    let data = await iot.listThingPrincipals(params).promise()
    //console.log('listThingPrincipals=');
    //console.log(data);

    //parse
    let principals = parsePrincipals(data)
    //console.log(principals);
    return principals
  }
  catch(err) {
    if(err.statusCode == 404) {
      //no existed, skip
      console.log('principals not existed, skip')
      return {}
    }
    console.log(err, err.stack) // an error occurred
    throw err
  }

}

//parse principals structure from AWS IoT
function parsePrincipals(data) {
  let output = {
    certificateId: [],
    certificateArn: [],
    policies: []
  }
  for(let i in data.principals) {
    //console.log(data.principals[i]);

    let index
    if((index = data.principals[i].indexOf('cert')) > 0) {
      output.certificateArn.push(data.principals[i])
      output.certificateId.push(data.principals[i].substring(index+'cert'.length+1))
    }
    //else if((index = data.principals[i].indexOf('policy')) > 0) {
    //  output.policies.push(data.principals[i].substring(index+'policy'.length+1));
    //}
  }
  return output
}


exports.init = init

exports.describeThing = describeThing
exports.getThingShadow = getThingShadow

exports.listThingGroupsForThing = listThingGroupsForThing
