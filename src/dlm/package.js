const formData = require('form-data')

module.exports = gv => {
  const request = gv.requests.dlm

  const getByName = async(packageName) => {
    const { data } = await request.get(
      '/packages',
      { params: { limit: 1, packageName } }
    )
    return data.data.find((i)=>i.latest)
  }

  return {
    getByName
  }
}