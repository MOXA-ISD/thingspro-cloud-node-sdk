const formData = require('form-data')

module.exports = gv => {
  const request = gv.requests.dlm

  const getByName = async(packageName) => {
    const $r = await request.get(
      '/packages',
      { params: { limit: 10, packageName } }
    )
    return { ...$r.data.data.find((i)=>i.latest), $r }
  }

  return {
    getByName
  }
}