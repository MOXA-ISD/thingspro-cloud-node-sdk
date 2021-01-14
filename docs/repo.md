### ThingsPro Cloud: Software Repository

#### repo set client cert

Login repo api with clinet cert.

```js
await tpc.repo().setCert('your_cert', 'your_key')
const me = tpc.repo().me
console.log(me)
```

#### repo request

get axios instance with logged in session.

```js
const request = tpc.repo().request
const projects = await tpc.repo().request.get('/packages')
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
