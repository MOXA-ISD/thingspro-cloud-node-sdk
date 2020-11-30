const formData = require('form-data')

module.exports = function(gv) {
  const request = gv.requests.dsc

  const get = async(projectId, limit = 1000, offset = 0) => {
    const { data } = await request.get(
      `/projects/${projectId}/devices`,
      { params:{ limit, offset } }
    )
    return data.data
  }

  const getById = async(projectId, deviceId) => {
    const { data } = await request.get(
      `/projects/${projectId}/devices/${deviceId}`
    )
    return data
  }

  const create = async(projectId, modelName, serialNumber, mac) => {
    const { data } = await request.post(
      '/devices',
      { projectId, modelName, serialNumber, mac }
    )
    return data.data
  }

  const remove = async(deviceId) => {
    const { data } = await request.delete(
      `/devices/${deviceId}`
    )
    return data.data
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

    const { data } = await request.put(
      `/devices/${deviceId}/config`, form, { headers }
    )
    return data
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