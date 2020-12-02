### Utils

#### dotenv

log configs from dotfile

<details>
<summary>.env example</summary>

```bash
TPC_LOGIN_EMAIL=guest@thingsprocloud.com
TPC_LOGIN_PASSWORD=your_password

TPC_URL_ADMIN=https://api.thingsprocloud.com/admin-api/v1
TPC_URL_DSC=https://api.thingsprocloud.com/dsc/v1
TPC_URL_DLM=https://api.thingsprocloud.com/api/v1
TPC_URL_RTM=https://api.thingsprocloud.com/rtm/v1

TPC_URL_PIC=https://pic.thingsprocloud.com/api/v1
TPC_URL_DSR=https://repo.thingspro.dev/api/v1
```
</details>

```js
const tpc = require('thingspro-cloud-sdk')()
const cfg = tpc.utils.dotenv('.env')
console.log(cfg)
```

<details>
<summary>Output</summary>

```js
{
  login: {
    email: guest@thingsprocloud.com,
    password: your_password
  },
  url: {
    admin: "...",
  }
}
```
</details>

#### random

get random string api.

```js
const tpc = require('thingspro-cloud-sdk')()
const name = tpc.utils.random.projectName()
console.log(name)
```
