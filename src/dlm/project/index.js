const modelProfile = require('./model-profile')

module.exports = gv => {
  const request = gv.requests.dlm

  const get = async(limit = 1000, offset = 0) => {
    const $r = await request.get(
      '/projects',
      { params:{ limit, offset } }
    )
    if ($r.status >= 400) {
      throw new Error($r.data)
    }
    return { ...$r.data, $r }
  }

  const getById = async(projectId) => {
    const $r = await request.get(
      `/projects/${projectId}`
    )
    if ($r.status >= 400) {
      throw new Error(JSON.stringify($r.data))
    }
    return { ...$r.data, $r }
  }

  const getByName = async(name) => {
    const $r = await request.get(
      '/projects',
      { params:{ name } }
    )
    if ($r.status >= 400) {
      throw new Error(JSON.stringify($r.data))
    }
    return { ...$r.data.data[0], $r }
  }

  const create = async(projectName) => {
    const $r = await request.post(
      '/projects',
      { name: projectName }
    )
    if ($r.status >= 400) {
      throw new Error(JSON.stringify($r.data))
    }
    return { ...$r.data.data, $r }
  }

  const findOrCreate = async(name) => {
    const project = await request.get(
      '/projects',
      { params:{ name } }
    )
    if (project.data.data[0]) { return project.data.data[0] }
    const $r = await request.post(
      '/projects',
      { name }
    )
    if ($r.status >= 400) {
      throw new Error(JSON.stringify($r.data))
    }
    return { ...$r.data.data, $r }
  }

  const remove = async(projectId) => {
    const $r = await request.delete(
      `/projects/${projectId}`
    )
    if ($r.status >= 400) {
      throw new Error(JSON.stringify($r.data))
    }
    return { ...$r.data.data, $r }
  }

  return {
    get,
    getById,
    getByName,
    create,
    findOrCreate,
    delete: remove,
    modelProfile: modelProfile(gv)
  }
}