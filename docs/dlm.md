### DLM: Device Lifecycle Management

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
