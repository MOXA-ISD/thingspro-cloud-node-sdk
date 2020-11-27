# ThingsPro Cloud SDK for Node.js

[![Build Status](https://icsdrone.moxa.online/api/badges/MOXA-ISD/thingspro-cloud-node-sdk/status.svg)](https://icsdrone.moxa.online/MOXA-ISD/thingspro-cloud-node-sdk)

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
  sr: 'https://repo.thingsprocloud.com/api/v1'
})

// login dlm with email and password
await tpc.dlm().login('guest@thingsprocloud.com', 'your_password')

// get logged in user profile
console.log(tpc.dlm().me)

// get all projects
console.log((await tpc.dlm().project.get())
```

### Table of Contents

- [Admin API](#admin-api)
  - [admin login](#admin-login)
  - [admin logout](#admin-logout)
  - [admin me](#admin-me)
  - [admin request](#admin-request)
- [DSC API](#dsc-api)
  - [dsc login](#dsc-login)
  - [dsc logout](#dsc-logout)
  - [dsc me](#dsc-me)
  - [dsc request](#dsc-request)
- [DLM API](#dlm-api)
  - [dlm login](#dlm-login)
  - [dlm logout](#dlm-logout)
  - [dlm me](#dlm-me)
  - [dlm request](#dlm-request)
- [PIC API](#pic-api)
  - [setCert](#set-cert)
  - [pic request](#pic-request)

### Admin API

#### admin login

Login admin api with email and password.

```js
await tpc.admin().login('guest@thingsprocloud.com', 'password')
const me = tpc.admin().me
console.log(me)
```

#### admin logout

Logout admin api.

```js
await tpc.admin().logout()
const me = tpc.admin().me
console.log(me)
```

#### admin me

get logged in user profile.

```js
const me = tpc.admin().me
console.log(me)
```

#### admin request

get axios instance with logged in session.

```js
const request = tpc.admin().request
const companies = await tpc.admin().request.get('/companys')
console.log(companies)
```

<details>
<summary>Output</summary>

```js
{
  companyId: '22237172-cd34-474a-bc4d-8a0070597b77',
  createdAt: '2020-04-07T01:32:10.512430Z',
  dashboard: { layout: [ [Object], [Object], [Object], [Object], [Object] ] },
  name: 'MOXA',
  status: 'enable',
  updatedAt: '2020-04-07T01:32:10.512430Z'
}
```
</details>

### DSC API

#### dsc login

Login dsc api with email and password.

```js
await tpc.dsc().login('guest@thingsprocloud.com', 'password')
const me = tpc.dsc().me
console.log(me)
```

#### dsc logout

Logout dsc api.

```js
await tpc.dsc().logout()
const me = tpc.dsc().me
console.log(me)
```

#### dsc me

get logged in user profile.

```js
const me = tpc.dsc().me
console.log(me)
```

#### dsc request

get axios instance with logged in session.

```js
const request = tpc.dsc().request
const projects = await tpc.dsc().request.get('/projects')
console.log(projects)
```

<details>
<summary>Output</summary>

```js
[
  {
    createdAt: '2020-11-26T09:16:07.585323Z',
    description: '',
    name: '[test] Practical Fresh Shoes',
    projectId: '073f329f-7edd-4651-8d6f-a998b04771dd',
    updatedAt: '2020-11-26T09:16:07.585323Z',
    userList: [ [Object], [Object], [Object] ]
  }
]
```
</details>

### DLM API

#### dlm login

Login dlm api with email and password.

```js
await tpc.dlm().login('guest@thingsprocloud.com', 'password')
const me = tpc.dlm().me
console.log(me)
```

#### dlm logout

Logout dlm api.

```js
await tpc.dlm().logout()
const me = tpc.dlm().me
console.log(me)
```

#### dlm me

get logged in user profile.

```js
const me = tpc.dlm().me
console.log(me)
```

#### dlm request

get axios instance with logged in session.

```js
const request = tpc.dlm().request
const projects = await tpc.dlm().request.get('/projects')
console.log(projects)
```

<details>
<summary>Output</summary>

```js
[
  {
    createdAt: '2020-11-26T09:16:07.585323Z',
    description: '',
    name: '[test] Practical Fresh Shoes',
    projectId: '073f329f-7edd-4651-8d6f-a998b04771dd',
    updatedAt: '2020-11-26T09:16:07.585323Z',
    userList: [ [Object], [Object], [Object] ]
  }
]
```
</details>
