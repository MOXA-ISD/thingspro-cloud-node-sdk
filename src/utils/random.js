const faker = require('faker')
const moment = require('moment')

const companyName = () => `[test] ${faker.company.companyName().slice(0, 19)} ${faker.random.number(100)}`

const projectName = () => `[test] ${faker.commerce.productName()} ${faker.random.number(1000)}`

// modelName
const all = async(request) => {
  const { data } = await request.get('/modelProfiles')
  const models = data.data
  return models[Math.floor(Math.random() * models.length)]['modelName']
}

const dlm = () => {
  const models = [
    'UC-3111-T-EU-LX',
    'UC-8100A-ME-T-LX',
    'UC-8112A-ME-T-LX-US',
    'UC-8112A-ME-T-LX-EU',
    'UC-8112A-ME-T-LX',
    'UC-8210-T-LX-S',
    'UC-8210-T-LX',
    'UC-8220-T-LX',
    'UC-8220-T-LX-US-S',
    'UC-8220-T-LX-EU-S'
  ]
  return models[Math.floor(Math.random() * models.length)]
}

const serialNumber = () => `test-${faker.random.number({ min:1000000, max:9999999 })}`

const mac = () => `${faker.internet.mac().replace(/:/g, '').toUpperCase()}`

const profileName = () => `[test] ${faker.commerce.productName()} ${faker.random.number(1000)}`

const roleName = () => `[test] ${faker.name.jobTitle()} ${faker.random.number(1000)}`

const tagName = () => `${faker.hacker.noun()}${faker.random.number(100)}`

const colour = () => faker.internet.color()

const email = () => `${faker.internet.exampleEmail().split('@')[0]}${faker.random.number(100)}@email.thingspro.dev`

const future = () => {
  const minutes = [ 0, 15, 30, 45 ]
  return moment()
    .add(faker.random.number({ min:2, max:5 }), 'hours')
    .add(-(moment().minutes()), 'minutes')
    .add(-(moment().seconds()), 'seconds')
    .add(minutes[Math.floor(Math.random() * minutes.length)], 'minutes')
    .toISOString()
}

const description = () => faker.lorem.sentence()

const snapshotName = () => `${faker.lorem.word()}${faker.random.number(100)}`

const password = () => `!12${faker.internet.password()}`

const hostname = () => `${faker.internet.domainWord()}${faker.random.number(10)}`

module.exports = {
  companyName,
  projectName,
  modelName: {
    all,
    dlm
  },
  serialNumber,
  mac,
  profileName,
  roleName,
  tagName,
  colour,
  email,
  future,
  description,
  snapshotName,
  password,
  hostname
}
