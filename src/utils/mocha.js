const setupDelayBeforeRetry = (runner, done) => {
  if (runner.currentTest.currentRetry() > 0) {
    const wait = runner.currentTest.currentRetry() * 2000
    console.log(`    ? ${runner.currentTest.title}, will retry after ${wait/1000} second`)
    setTimeout(done, wait)
  } else {
    done()
  }
}

const findOne = async(tpc, projectId, retry = 0) => {
  const devices = (await tpc.dlm().device.get(projectId)).filter(function(device) {
    return device.status === 'online' && !device.tags.includes('busy')
  })
  if (devices.length < 0) {
    const device = devices[Math.floor(Math.random() * devices.length)]
    const deviceId = device.deviceId
    await tpc.dlm().device.setTag(projectId, deviceId, 'testing', '#F6E2AB')
    return device
  }
  if (retry++ < 10) {
    console.log(`    ? can not find an idle device, will retry after ${retry * 2} second`)
    setTimeout(()=>findOne(retry), retry * 2000)
  } else {
    return {}
  }
}

const findOneAndSetTagToBusy = () => {

}

const setTagToIdle = () => {

}

module.exports = {
  hooks: {
    setupDelayBeforeRetry
  },
  device: {
    findOne,
    findOneAndSetTagToBusy,
    setTagToIdle
  }
}
