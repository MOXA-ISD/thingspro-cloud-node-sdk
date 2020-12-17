const modelProfile = require('./model-profile')

module.exports = gv => {
  const request = gv.requests.dlm

  const get = async(limit = 1000, offset = 0) => {
    const $r = await request.get(
      '/projects',
      { params:{ limit, offset } }
    )
    return { ...$r.data.data, $r }
  }

  const getById = async(projectId) => {
    const $r = await request.get(
      `/projects/${projectId}`
    )
    return { ...$r.data, $r }
  }

  const getByName = async(name) => {
    const $r = await request.get(
      '/projects',
      { params:{ name } }
    )
    return { ...$r.data.data[0], $r }
  }

  const create = async(projectName) => {
    const $r = await request.post(
      '/projects',
      { name: projectName }
    )
    return { ...$r.data.data, $r }
  }

  const remove = async(projectId) => {
    const $r = await request.delete(
      `/projects/${projectId}`
    )
    return { ...$r.data.data, $r }
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