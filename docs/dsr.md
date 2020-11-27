### DSR: Device Software Repository

#### dsr set client cert

Login dsr api with clinet cert.

```js
await tpc.dsr().setCert('your_cert', 'your_key')
const me = tpc.dsr().me
console.log(me)
```

#### dsr request

get axios instance with logged in session.

```js
const request = tpc.dsr().request
const projects = await tpc.dsr().request.get('/packages')
console.log(projects)
```

<details>
<summary>Output</summary>

```js
[
  {
  }
]
```
</details>
