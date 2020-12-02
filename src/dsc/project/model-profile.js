
module.exports = gv => {
  const request = gv.requests.dsc

  const create = async(projectId, newProfileName, modelName) => {
    const { data } = await request.post(
      `/projects/${projectId}/modelProfiles`,
      {
        newProfileName: newProfileName,
        duplicate: {
          modelName: modelName
        }
      }
    )
    return data.data
  }

  const remove = async(projectId, profileId) => {
    const { data } = await request.delete(
      `/projects/${projectId}/modelProfiles/${profileId}`
    )
    return data.data
  }

  return {
    create,
    delete: remove
  }
}