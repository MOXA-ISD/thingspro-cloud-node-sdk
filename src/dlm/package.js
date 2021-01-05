const formData = require('form-data')

module.exports = gv => {
  const request = gv.requests.dlm

  const getByName = async(packageName) => {
    const $r = await request.get(
      '/packages',
      { params: { limit: 10, packageName } }
    )
    if ($r.status >= 400) {
      throw new Error(JSON.stringify($r.data))
    }
    return { ...$r.data.data.find((i)=>i.latest), $r }
  }

  return {
    getByName
  }
}