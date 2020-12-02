### PIC: Provisioning Init-connection Certificate

#### pic set client cert

Login pic api with clinet cert.

```js
await tpc.pic().setCert('your_cert', 'your_key')
const me = tpc.pic().me
console.log(me)
```

#### pic request

get axios instance with logged in session.

```js
const request = tpc.pic().request
const projects = await tpc.pic().request.get('/packages')
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
