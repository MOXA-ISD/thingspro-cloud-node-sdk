const formData = require('form-data')

module.exports = gv => {
  const request = gv.requests.dsc

  const get = async(projectId) => {
    const $r = await request.get(
      `/projects/${projectId}/tags`
    )
    if ($r.status >= 400) {
      throw new Error(JSON.stringify($r.data))
    }
    return { ...$r.data, $r }
  }

  const getById = async(projectId, tagId) => {
    const $r = await request.get(
      `/projects/${projectId}/tags/${tagId}`
    )
    if ($r.status >= 400) {
      throw new Error(JSON.stringify($r.data))
    }
    return { ...$r.data, $r }
  }

  const create = async(projectId, tagName, colour) => {
    const $r = await request.post(
      `/projects/${projectId}/tags`,
      { tagName, colour }
    )
    if ($r.status >= 400) {
      throw new Error(JSON.stringify($r.data))
    }
    return { ...$r.data.data, $r }
  }

  const findOrCreate = async(projectId, tagName, colour) => {
    let $r = await request.get(
      `/projects/${projectId}/tags`
    )
    if ($r.data.data.length) {
      const tag = $r.data.data.find(tag => tag.tagName === tagName)
      if (tag) { return tag }
    }
    $r = await request.post(
      `/projects/${projectId}/tags`,
      { tagName, colour }
    )
    if ($r.status >= 400) {
      throw new Error(JSON.stringify($r.data))
    }
    return { ...$r.data.data, $r }
  }

  const remove = async(projectId, tagId) => {
    const $r = await request.delete(
      `/projects/${projectId}/tags/${tagId}`
    )
    if ($r.status >= 400) {
      throw new Error(JSON.stringify($r.data))
    }
    return { ...$r.data.data, $r }
  }

  return {
    get,
    getById,
    create,
    findOrCreate,
    delete: remove
  }
}