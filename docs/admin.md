### Admin

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