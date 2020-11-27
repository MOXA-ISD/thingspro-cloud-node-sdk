
module.exports = gv => {

  const setCert = (cert, key) => {
    let certs = {}
    certs['pic'] = null
    if (cert && key){
      certs['pic'] = { cert, key }
    }
    gv.setCert(certs)
  }

  return {
    setCert,
    request: gv.requests.pic,
    me: gv.profiles.pic
  }
}