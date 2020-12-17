const formData = require('form-data')

module.exports = gv => {
  const request = gv.requests.dsc

  const get = async(projectId, limit = 1000, offset = 0) => {
    const $r = await request.get(
      `/projects/${projectId}/devices`,
      { params:{ limit, offset } }
    )
    return { ...$r.data.data, $r }
  }

  const getById = async(projectId, deviceId) => {
    const $r = await request.get(
      `/projects/${projectId}/devices/${deviceId}`
    )
    return { ...$r.data, $r }
  }

  const create = async(projectId, modelName, serialNumber, mac) => {
    const $r = await request.post(
      '/devices',
      { projectId, modelName, serialNumber, mac }
    )
    return { ...$r.data.data, $r }
  }

  const remove = async(deviceId) => {
    const $r = await request.delete(
      `/devices/${deviceId}`
    )
    return { ...$r.data.data, $r }
  }

  const setHostName = async(deviceId, hostName) => {
    const form = new formData()
    form.append(
      'config',
      Buffer.from(JSON.stringify(
        {
          general: {
            hostName
          }
        }
      )),
      { filename: 'fakepath.json' }
    )
    const headers = form.getHeaders()

    const $r = await request.put(
      `/devices/${deviceId}/config`, form, { headers }
    )
    return { ...$r.data, $r }
  }

  const setTag = async(projectId, deviceId, tagName, colour) => {
    // create tag if not exist
    let r = await request.get(
      `/projects/${projectId}/tags/exist?tagName=${tagName}`
    )
    if (!r.data.data.exist) {
      await request.post(
        `/projects/${projectId}/tags`,
        { tagName, colour }
      )
    }

    // get tagId by name
    r = await request.get(
      `/projects/${projectId}/tags`
    )
    const tagId = (r.data.data.find(tag => tag.tagName === tagName))['tagId']

    // attach tag
    await request.post(
      `/projects/${projectId}/tagsAttach`,
      { devices: [ { deviceId: deviceId, tagIdList: [ tagId ] } ] }
    )
  }

  const cancelAllJobs = async(deviceId) => {
    const { data } = await request.get(`/devices/${deviceId}/jobs`, { params: { limit: 1000 } })
    data.data.forEach(async job => {
      await request.post(`/devices/${deviceId}/jobs/${job.jobId}/cancel`)
    })
  }

  return {
    get,
    getById,
    create,
    delete: remove,
    setHostName,
    setTag,
    cancelAllJobs
  }
}