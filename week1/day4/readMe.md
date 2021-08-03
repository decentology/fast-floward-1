# Flow 快速入门 | 第一周 | 第四天

欢迎回来！这里是第四天的课程。今天我们终于准备好把所有的模块组合起来，并发布我们第一个去中心化应用 —— Artist。 为了完成这一目标，我们将学习 **Flow Client Library (FCL)**，如何操作 Flow 的测试网，以及如何把 Flow 整合至 JavaScript/React 客户端中。
不要担心，我们不需要懂得太多 JavaScript/React 的知识。所有的客户端代码脚手架都已经完成，你只需要关心 Cadence FCL, 和 Flow 测试网。

第四天将会是激动人心的一天。

在我们开始之前，先快速回顾一下第三天的课程内容。

# 第三天回顾

- Flow 模拟器在你本地的电脑中提供了一个全量的区块链体验
  - 创建密码学秘钥对
  - 创建并修改账户
  - 构建，签名，并发送交易
  - 执行脚本
  - 部署随意数量的智能合约
- `flow-cli` 通过 `flow.json` 配置，存储你的项目相关信息
  - 为账户创建别名
  - 为合约源码配置路径
  - 在同一个网络中，将合约部署在指定的账户下
- Cadence `event` 事件允许合约在确定事件发生的时候与外部沟通
  - 交易并不会给发送者返回结果, 但如果在合约中使用了 `emit 事件名称`，你就能通过 `.events` 这个字段中的内容知道在这笔交易中发生了什么.

# 视频

- [Flow Client Library (FCL), Flow 测试网](https://youtu.be/5XWWWbOd78k)

# 答疑时间

- [答疑时间 #4](https://www.youtube.com/watch?v=Mf6f1Il7unc)

# Flow Client Library – FCL

昨天，我们了解了密码学是如何在 Flow 中运作的,当我们发送交易的时候，需要使用到私钥进行签名。作为一名开发者，我们早已经习以为常 —— 只需要生成私钥，然后把它存在安全的地方，然后将私钥与新创建的账户关联，这样就可以使用  `flow.json` 文件作为我们的钥匙串，也能够使用 `flow-cli` 去进行进一步的扩展。

不管怎么样，如果你要其他的用户通过网络使用你的 DApp，你永远不会获取到别人的私钥。想象一下，你在销售柠檬水，客户走过来，价格 1 美元，当然你只能接受付款，如果你拿走别人的钥匙，进入到他们的家里并自己走到厨房的柜台拿走钞票，这很傻不是吗，不要这样做。

如果我们不能拿到他们的私钥，我们如何签名他们的交易呢？ 我们将构建好的交易发送到用户的钱包，他们确认交易的内容，可以选择确认或拒绝这笔交易。

最后一个细节，现在有很多钱包服务的提供商，而将它们整合起来将是一个冗长而脆弱的过程，于是（Flow Client Library，简称 FCL)应运而生。

## SDK + 授权

有了 FCL, 你会得到一个完整的 JavaScript SDK，上面有一个身份验证层。 也就是说，要开始与用户交互，你只需要调用两个方法。

```javascript
fcl.authenticate()
fcl.currentUser().subscribe()
```
你还可以以一种漂亮的抽象形式获得所有熟悉的 `transaction` 和 `script` 功能。

```javascript
fcl.send([
  fcl.script`
    pub fun main(): String {
      return "Hi, FastFloward!"
    }
  `
])
```
这只是让你对 FCL 有一个初步的了解,我们将使用真实的 DApp 示例进一步探索它。想要了解更多请看 [深入 Flow: FCL 简洁的力量][1]，这是 Flow 团队最近的一篇博客文章，他们在其中建立了一个强大的 FCL 示例。

# Artist
这一周，我们一直在朝着一个最终目标努力——一个去中心化的应用程序，它可以把我们独特的绘画打印成我们拥有的 `Picture`，就像在现实世界中一样。但如果我们不能像普通用户那样使用应用程序，它就不是应用程序。今天，我们将探讨客户端实现以及它如何与 Flow 交互。

让我们从探索文件夹 `Artist` 的内容开始。

## 客户端

在这里你会发现完全相同的客户端 [artist.flowdeveloper.com][2]，唯一的区别是 Cadence 代码是缺失的。

这是一个 JavaScript/React 应用程序，如果你不熟悉，不要担心。如果你不想写，我们也不希望你写任何 JavaScript。我们只是希望你能在本地运行。还有几步就完成了。

```sh
cd Artist
npm i
echo "PUBLIC_URL=/public/" > .env
npm run start
```

如果一切顺利，你的浏览器应该打开 `http://localhost:3000` URL，并呈现一个页面应该是这样的。

![Local Artist – first load](images/localArtist.png)

## 结构

当执行 `npm run start` 命令时，你会启动一个开发服务器，它会在你每次修改源代码时方便地重新加载应用程序。目前，这就是我们部署应用程序所需要的全部内容。

然后，你在 `Artist/` 目录中有两个重要的位置。

```
src/context/Flow.jsx // 只有这个文件需要修改
src/cadence/ // 这是 LocalArtist 合约所在的地方
```

Artist 客户端应用使用的是 `Flow.jsx` 作为与 Flow 区块链交互的单一入口。在里面，你会发现一个 React 上下文，它可以在整个应用程序页面中使用。主要的部分是，在这个文件中，我们创建了一些函数，这些函数围绕着我们的交易，供以后使用。

```jsx
<Context.Provider
  value={{
    state,
    isReady,
    dispatch,
    logIn,
    logOut,
    fetchBalance,
    fetchCollection,
    createCollection,
    destroyCollection,
    printPicture
  }}
>
  {props.children}
</Context.Provider>
```
现在，这些函数(`logOut`, `logIn`,等方法)被删除。我们今天的目标是在 **FCL** 的帮助下，通过执行 `src/cadence/` 中存在的脚本和事务来实现它们。有些实现将是一行程序，有些则需要更多的努力。

希望我们现在已经对项目结构有了基本的了解。我们的下一步将是为 Flow 测试网配置 ，开始吧!

# Flow 测试网

第三天是关于模拟器与 Flow 网络的本地实例交互的。今天我们想要公开发布! 我们将把 `LocalArtist` 合约部署到 Flow 测试网中。这个过程与部署模拟器合约的过程完全相同。唯一的区别是 —— 我们不能直接访问测试网的服务帐户，而且我们不能在没有帐户的情况下创建帐户。但 Flow 已经帮我们搞定了。

## Flow 测试网水龙头

我们可以在测试网上使用水龙头[flowfaucet][3]创建一个账户。这是一项免费服务。多亏了 Flow! 所有这些都需要一个公钥，我们可以使用 `flow-cli` 生成这个公钥。

```sh
flow keys generate --sig-algo "ECDSA_secp256k1"
```
不要忘记选择合适的 *Signature Algorithm 签名算法* 点击 *创建帐户*。几分钟后，我们将得到一个新的账户地址，里面有1000个FLOW代币，太棒了!

现在，让我们创建一个新的 `flow.json`。确保你在 `/day4/Artist/src/cadence/` 文件夹中。

```sh
flow init
```

然后用我们刚得到的所有相关信息更新它。

```json
{
  ...,
  "contracts": {
    "LocalArtist": "./LocalArtist/contract.cdc"
  },
  "accounts": {
    ...,
    "testnet-local-artist": {
      "address": "0x01",
      "key": {
        "type": "hex",
        "index": 0,
        "signatureAlgorithm": "ECDSA_secp256k1",
        "hashAlgorithm": "SHA3_256",
        "privateKey": "abc"
      }
    }
  },
  "deployments": {
    "testnet": {
      "testnet-local-artist": [
        "LocalArtist"
      ]
    }
  },
  ...
}
```
还有一件事，我们需要与客户共享合约账户地址，所以我们也需要更新我们的 `.env` 文件，我们用下面的代码创建了它。请将 `0x01` 替换为你的测试网帐户地址。

```env
PUBLIC_URL=/public/
REACT_APP_ARTIST_CONTRACT_NAME=LocalArtist
REACT_APP_ARTIST_CONTRACT_HOST_ACCOUNT=0x01
```

## 部署 LocalArtist

你可能已经注意到我们在合约中使用了 `LocalArtist`  作为另一个名称。由于存储路径必须是唯一的，我们希望避免与[artist.flowdeveloper.com][2]合约存储的命名冲突。另一个变化是我们不再使用 ' ' 和 '*' 来表示开启/关闭像素，从现在开始，我们将使用 '1' 表示开启像素，'0'表示关闭像素。如果你好奇的话，你可以在合约中发现其他变化。

好了，现在开始部署 `LocalArtist` 合约到测试网。


```sh
flow project deploy --network=testnet
```
另一个有用的工具是 [flow-view-source.com][4]，我已经链接到我的测试网合约帐户，但你可以改变地址并探索任何其他的测试网帐户。
现在，在进入 FCL 之前，让我们使用 `flow-cli` 测试我们的部署。在执行第一次交易之前，请务必更新 `print.cdc` 中的合约账户地址。

```sh
flow transactions send ./LocalArtist/transactions/print.cdc \
  --network=testnet \
  --signer testnet-local-artist \
  --args-json='[{"type": "Int", "value": "5"}, {"type": "Int", "value": "5"}, {"type": "String", "value": "0111010001000100010011111"}]'
```

如果成功，我们将从执行该事务中看到 5 个事件。

```sh
flow scripts execute ./LocalArtist/scripts/getCanvases.cdc \
  --network=testnet \
  --args-json='[{"type": "Address", "value": "0x01"}]'
```

我们的脚本应该显示一个包含一张图片的 `Collection` 。

# FCL 集成

现在我们已经确认了我们的合约部署成功，我们可以开始整合 `fcl` 了。

首先，我们需要配置网络和我们希望 `fcl` 使用的钱包。在 `/src/index.js` 中完成

```javascript
import * as fcl from '@onflow/fcl';

fcl
  .config()
  .put('accessNode.api', 'https://access-testnet.onflow.org')
  .put('discovery.wallet', 'https://fcl-discovery.onflow.org/testnet/authn');
```

我们在客户端的接入点初始化一次。因为在测试网上操作，所以我们使用了测试网访问节点和测试网钱包。

## 登录

为了管理用户身份验证，我们使用了两个函数。我们只需要将它们放在 `Flow.jsx` 中的正确位置。

```javascript
fcl.logIn(); // 登录或注册
fcl.unauthenticate(); // 登出
```

## 脚本与交易


FCL为脚本和事务提供了一个发送接口。
例如，事务看起来是这样的。

```javascript
import * as fcl from '@onflow/fcl';
import * as FlowTypes from '@onflow/types';

async function sendTransaction() {
  const transactionId = await fcl
    .send([
      fcl.transaction`
        // 你的 Cadence 代码
        import LocalArtist from ${process.env.REACT_APP_ARTIST_CONTRACT_HOST_ACCOUNT}
      `,
      fcl.args([
        fcl.arg("Hello, FastFloward!", FlowTypes.String)
      ]),
      fcl.payer(fcl.authz),
      fcl.proposer(fcl.authz),
      fcl.authorizations([fcl.authz]),
      fcl.limit(9999)
    ])
    .then(fcl.decode);

  return fcl.tx(transactionId).onceSealed();
}
```
`fcl.authz` 的值只是当前用户的简写。在返回之前，我们等待事务被 *sealed*。

执行脚本与此非常相似。

```javascript
import * as fcl from '@onflow/fcl';
import * as FlowTypes from '@onflow/types';

async function sendTransaction() {
  const result = await fcl
    .send([
      fcl.script`
        // 你的 Cadence 代码
        import LocalArtist from ${process.env.REACT_APP_ARTIST_CONTRACT_HOST_ACCOUNT}
      `,
      fcl.args([
        fcl.arg("Hello, FastFloward!", FlowTypes.String)
      ]),
    ])
    .then(fcl.decode);

  return result;
}
```


这些信息应该足够让你开始了。更多信息，请查看[Flow Client Library 文档][5]。

# 任务

我们终于创建了真正的去中心化应用，这真实前所未有的体验! 
为了庆祝，我们今天只有一个任务。一个任务包含7个部分……

- `W1Q8` – 客户端王者归来

在 `Artist/` 文件夹中搜索 `TODO:`，并使用 `fcl`  框架执行所有这些任务。在你执行了每个 `TODO:` 项目后，你应该拥有一个完整的本地艺术家应用，并与测试网进行交互!

作为你提交的一部分，请填写 `quest.md` 与你的测试网帐户地址。另外，一定要打印一些图片，我们会比较你们中的哪一个最终得到了最好的图片收藏。

祝你旅途好运!

[1]: https://www.onflow.org/post/inside-flow-the-power-of-simplicity-with-fcl
[2]: https://artist.flowdeveloper.com/
[3]: https://testnet-faucet.onflow.org/
[4]: https://flow-view-source.com/testnet/account/0xda65073324040264
[5]: https://docs.onflow.org/fcl/