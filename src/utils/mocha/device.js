
function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const findOne = async(tpc, projectId, maxRetry = 10, count = 0) => {
  const devices = (await tpc.dlm().device.get(projectId)).filter(function(device) {
    return device.status === 'online' && !device.tags.includes('busy')
  })
  if (devices.length > 0) {
    const device = devices[Math.floor(Math.random() * devices.length)]
    return device
  }
  if (count++ < maxRetry) {
    console.log(`    ? can not find an idle device, will retry after ${count * 2} second`)
    await timeout(count * 2000)
    return findOne(tpc, projectId, maxRetry, count)
  } else {
    throw new Error(`    X Can not find an idle device after ${maxRetry} retries.`)
  }
}

const setTesting = async(tpc, projectId, deviceId) => {
  await tpc.dlm().device.setTag(projectId, deviceId, 'testing', '#F6E2AB')
}

const setBusy = async(tpc, projectId, deviceId) => {
  await tpc.dlm().device.setTag(projectId, deviceId, 'busy', '#FFC0C7')
}

const setIdle = async(tpc, projectId, deviceId) => {
  await tpc.dlm().device.setTag(projectId, deviceId, 'idle', '#A1B69C')
}

module.exports = {
  findOne,
  tag: {
    setTesting,
    setBusy,
    setIdle
  }
}