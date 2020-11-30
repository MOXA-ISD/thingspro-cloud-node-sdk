const modelProfile = require('./model-profile')

module.exports = function(gv) {
  const request = gv.requests.dsc

  const get = async(limit = 1000, offset = 0) => {
    const { data } = await request.get(
      '/projects',
      { params:{ limit, offset } }
    )
    return data.data
  }

  const getById = async(projectId) => {
    const { data } = await request.get(
      `/projects/${projectId}`
    )
    return data
  }

  const getByName = async(name) => {
    const { data } = await request.get(
      '/projects',
      { params:{ name } }
    )
    return data.data[0]
  }

  const create = async(projectName) => {
    const { data } = await request.post(
      '/projects',
      { name: projectName }
    )
    return data.data
  }

  const remove = async(projectId) => {
    const { data } = await request.delete(
      `/projects/${projectId}`
    )
    return data.data
  }

  return {
    get,
    getById,
    getByName,
    create,
    delete: remove,
    modelProfile: modelProfile(gv)
  }
}