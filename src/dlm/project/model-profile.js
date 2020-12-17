
module.exports = gv => {
  const request = gv.requests.dlm

  const create = async(projectId, newProfileName, modelName) => {
    const $r = await request.post(
      `/projects/${projectId}/modelProfiles`,
      {
        newProfileName: newProfileName,
        duplicate: {
          modelName: modelName
        }
      }
    )
    return { ...$r.data.data, $r }
  }

  const remove = async(projectId, profileId) => {
    const $r = await request.delete(
      `/projects/${projectId}/modelProfiles/${profileId}`
    )
    return { ...$r.data.data, $r }
  }

  return {
    create,
    delete: remove
  }
}