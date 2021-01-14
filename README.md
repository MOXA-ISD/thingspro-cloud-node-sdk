# ThingsPro Cloud SDK for Node.js

[![Build Status](https://icsdrone.moxa.online/api/badges/MOXA-ISD/thingspro-cloud-node-sdk/status.svg?ref=refs/heads/main)](https://icsdrone.moxa.online/MOXA-ISD/thingspro-cloud-node-sdk) [![NPM](https://nodei.co/npm/thingspro-cloud-node-sdk.png?mini=true)](https://npmjs.org/package/thingspro-cloud-node-sdk)

> An API wrapper for the [ThingsPro Cloud](https://thingsprocloud.com) API.

### Installation

    yarn add thingspro-cloud-sdk


### Getting started

Import the module and create a new client. Passing api urls is optional if
you need call private cloud service.

```js
const tpc = require('thingspro-cloud-sdk')()

// Optional: change the api server url
tpc.setServerUrl({
  admin: 'https://api.thingsprocloud.com/admin-api/v1',
  dsc: 'https://api.thingsprocloud.com/dsc/v1',
  dlm: 'https://api.thingsprocloud.com/api/v1',
  rtm: 'https://api.thingsprocloud.com/rtm/v1',
  pic: 'https://pic.thingsprocloud.com/api/v1',
  dsr: 'https://repo.thingsprocloud.com/api/v1'
})

// login dlm with email and password
await tpc.dlm().login('guest@thingsprocloud.com', 'your_password')

// get logged in user profile
console.log(tpc.dlm().me)

// get all projects
console.log((await tpc.dlm().project.get())
```

### Table of Contents

- [Admin](docs/admin.md)
  - [login](docs/admin.md#admin-login)
  - [logout](docs/admin.md#admin-logout)
  - [me](docs/admin.md#admin-me)
  - [request](docs/admin.md#admin-request)
- [DSC: Device Security Center](docs/dsc.md)
  - [login](docs/dsc.md#dsc-login)
  - [logout](docs/dsc.md#dsc-logout)
  - [me](docs/dsc.md#dsc-me)
  - [request](docs/dsc.md#dsc-request)
- [DLM: Device Lifecycle Management](docs/dlm.md)
  - [login](docs/dlm.md#dlm-login)
  - [logout](docs/dlm.md#dlm-logout)
  - [me](docs/dlm.md#dlm-me)
  - [request](docs/dlm.md#dlm-request)
- [RTM: Realtime Message](docs/rtm.md)
  - [subscribe](docs/rtm.md#rtm-subscribe)
- [PIC: Provisioning Init-connection Certificate](docs/pic.md)
  - [setCert](docs/pic.md#pic-set-cert)
  - [request](docs/pic.md#pic-request)
- [REPO: Software Repository](docs/repo.md)
  - [setCert](docs/repo.md#repo-set-cert)
  - [request](docs/repo.md#repo-request)
- [Utils](docs/utils.md)
  - [dotenv](docs/utils.md#dotenv)
  - [random](docs/utils.md#random)




