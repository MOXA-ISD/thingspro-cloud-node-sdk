const setupDelayBeforeRetry = (runner, done) => {
  if (runner.currentTest.currentRetry() > 0) {
    const wait = runner.currentTest.currentRetry() * 2000
    console.log(`    ? ${runner.currentTest.title}, will retry after ${wait/1000} second`)
    setTimeout(done, wait)
  } else {
    done()
  }
}

module.exports = {
  setupDelayBeforeRetry
}
