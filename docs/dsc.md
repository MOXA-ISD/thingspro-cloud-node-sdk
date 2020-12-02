### DSC: Device Security Center

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
