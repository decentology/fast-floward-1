# Flow 快速入门 | 第一周 | 第三天

欢迎来到第三天的课程！今天我们来学习用`flow-cli`在本地搭建完整的Flow环境。我们会学到创建账户，签名交易和部署合约。要实现这些，我们将借助**Flow模拟器(Flow Emulator)**，一套在你本地的迷你的完整的Flow链。现在我们开始！

在此之前，我们先来回顾一下第二天的内容。


# 第二天课程回顾

- Flow Playground是一套模拟Flow链的线上环境。
  - 你可以部署合约，发布交易，执行脚本 。
- 我们使用Cadence`合约`存储我们的分布式应用。
- 我们可以通过Cadence `脚本 (script)`读取Flow链上的数据。
- 我们可以通过Cadence `交易(transaction)`与Flow链交互。
  - 在`准备(prepare)`阶段，我们可以用`认证账户(AuthAccount)`读取和写入账户的存储空间(storage)
  - 在`执行(execute)`阶段执行交易的逻辑。
  - 创建新的Cadence合约中的`资源(resource)`实例
- Cadence **账户存储空间API(Account Storage API)** 和它的两个方法：
  - `account.save(T, to: /storage/path)`
    - 保存`对象(object)`到账户的存储空间(account storage).
  - `account.link(/[public|private]/path, target: /domain/path)`
    - 创建能够调用存储空间(stoage)中对象(object)的权利(capabilities)
- 可以通过引用(References)与资源(resource)或其他类型交互，而不需要复制(copy)或移动(move)操作.
  - 通过casting创建`&something as &T`.
  - 从权利(capability)借用(borrow) `account.getCapability().borrow()`.  

完整的欧Cadence语言文档可参见[docs.onflow.org][1]

# 视频

- [第二日回顾, Flow模拟器(Emulator)和flow.json](https://www.youtube.com/watch?v=Ntna1mPvMjY)
- [部署合约，发布交易，运行脚本 欧](https://youtu.be/aDAsv2O0IT4)

# 办公室时间 Office Hours

- [任务执行和一般Q&A](https://www.youtube.com/watch?v=Cb8Fuic6Y9o)

# Flow模拟器

在第二日的课程中，我们亲身看到了Flow链是如何运行的。借助于Flow Playground，我们能够部署合约，运行脚本 ，执行交易。你可以在你的浏览器中做所有的这一切，这是非常酷的！


## 配置

Open up your terminal and run this command.

打开你的终端(terminal)并运行这个命令

```sh
flow init
```

它将会在当前的目录下创建一个配置文件，`flow.json`。它主要的目的是将你的本地环境与合约，账户的的别名(aliases)连接起来，以及组织你的合约部署。我们一起来看一下`flow.json`中的几个部分。


### `网络(networks)`

这里你能找到不同Flow链环境的地址。当你向一个特定环境发布交易或执行脚本 ，只需要使用`networks`下的环境名称，比如`emulator(模拟器)`, `testnet(测试网)`, or `mainnet(主网)`.


On your journey to becoming a DApp developer, look at these environments as a ladder you climb towards shipping a production ready DApp. First, start with the `emulator`. Then, once you a working smart contract, ship it to `testnet` to start integrating with wallets and testing it with friends. Finally, after you've exhaustively tested your DApp, ship it to the `mainnet`.

在成为DApp开发者的路上，可以把这些环境看成是你开发一个完备产品的阶梯。首先，在`emulator(模拟器)`中开始开发, 然后当你有一个可以运行的智能合约之后，你就可以发送到`testnet(测试网)`以与钱包结合并且和你的朋友们一同测试,最终在你详尽测试了你的DApp之后，你就可以发送到 `mainnet(主网)`.

```json
"networks": {
  "emulator": "127.0.0.1:3569",
  "mainnet": "access.mainnet.nodes.onflow.org:9000",
  "testnet": "access.devnet.nodes.onflow.org:9000"
}
```

### `账户(accounts)`

Here you will assign aliases to the accounts you're using in the development process. Every `flow.json` starts by having `emulator-account` defined, otherwise known as a *service account*. You can add other accounts to simulate various scenarios that your DApp can encounter, or for contract deployment and many other purposes.

这里你可以给你在开发过程中用到的不同的账户起个别名。每一个`flow.json`配置文件的第一行部分都是`emulator-account(模拟器账户)`，或者可以理解成*service account(服务账户)*。你可以添加其他账户用以比如模拟你的DApp中会遇到的各式情况，或者用来部署合约，等等。

```json
"accounts": {
  "emulator-account": {
    "address": "f8d6e0586b0a20c7",
    "key": "bcbd7e16179f286eeb805e06482ac45657d1dface4a775511abcaf8e4b6d4373"
  }
}
```

### `合约(contracts)`

在使用Flow Playground的时候，我们已经体会过通过从其他账户地址`引入(import)`合约来与之交互。但是，如果你在Cadence脚本 中明确标注账户地址的话，你将只能将合约部署到有这个账户的环境中。这是因为账户地址(address)在模拟器，测试网，主网中是不通用的。

为了解决这个问题，其实只需要在*.cdc*文件中使用从文件引入`import Contract from "path/to/contract.cdc"`, 之后，如果在`flow.json`中已经定义好的话，`flow-cli`会接手并替换成对应的账户地址。

```json
"contracts": {
  "Hello": "./hello/contract.cdc"
}
```

### `部署deployments`

我们将上述几个部分合并用以创建带有对应关系(mapping)的合约部署: **网络 network** > **账户 account** > **合约 contract**.

```json
"deployments": {
  "emulator": {
    "emulator-account": [
      "Hello"
    ]
  }
}
```

## 如何启动

如果你看到一个系统弹窗要求网络许可，请允许。

```sh
flow emulator start
```

你将会看到4个`INFO`信息, 最后的两条是用来确认 `gRPC` 和 `HTTP` 服务器正常启动, 说明一切正常. 只要这个进程一直运行，模拟器就也会一直运行。你可以通过使用`SIGINT` 终端信号停止进程 (macOS的终端是`CTRL + C`).

默认状态下，模拟器生成的数据将会在模拟器进程关闭后丢失。这在运行测试时很有帮助。但是，如果你想的话，你可以通过要求`--persist`标识要求模拟器保留数据。

```sh
flow emulator start --persist
```

这会为模拟器创建一个`flowdb`文件夹用以存储它的状态。当然，你可以随时删除这个`flowdb`文件夹用以重置状态。


# Playground

现在我们知道了`flow.json`配置文件是如何工作的，以及如何启动Flow模拟器，让我们开始用起来吧。在一个终端正在运行`flow emulator`模拟器进程时，打开另一个终端页(tab)用来运行我们其他的命令。顺便说一下，接下来的这些命令可以用在所有的Flow环境中，不只是模拟器环境。如果你不明确设置网络环境`--network`的话，模拟器是默认环境。

## 秘钥 Keys

我们想创建一个账户。在我们创建一个账户之前，我们首先需要一对秘钥。别忘了，区块链用密码学来确认所有权。`flow-cli`提供了一个非常便捷的方法创建秘钥。下面这个命令设置使用的是`ECDSA_secp256k1`签名算法，同时这也是比特币使用的。

```sh
flow keys generate\
  --sig-algo=ECDSA_secp256k1
```

这会返回一对公钥和私钥。显而易见的，你不应该把它们公开，小心保存。

```
Private Key 	 70d4eebade37eabe0a5df1b1664acf25245187068665c529c1d63f0a214dadfa
Public Key 	 c69560acb6ff5b4db1870ec47c6f2474f862b34bb69b3508557e5733406da63cb5218bdf4ddebc525b93c8d95de1194e77cc9aec7fb0394270cea3ce2c9deee2
```

## 账户 Accounts

当我们有了公私钥，我们就能创建账户了。请注意，如果我们使用的不是默认的`ECDSA_P256`签名算法的话，我们需要特别指明公私钥创建时用到的签名算法。并且，因为账户创建并不是一个普通的交易，因此一个账户必须为这笔交易签名签名。在模拟器中，我们可以使用已提前生成好的`emulator-account`


```sh
flow accounts create \
  --key "c69560acb6ff5b4db1870ec47c6f2474f862b34bb69b3508557e5733406da63cb5218bdf4ddebc525b93c8d95de1194e77cc9aec7fb0394270cea3ce2c9deee2" \
  --sig-algo "ECDSA_secp256k1" \
  --signer "emulator-account"
```

If the command succeeds, you'll get an account address in your response. Quick note, unlike Ethereum and some other chains, the account address is not derived from the public key. This means that simply having a public key is not enough to identify an account.

如果上面这个命令执行成功的话，你将会得到一个账户地址。请注意，与以太坊或其他链不同，这个账户地址并不是由公钥生成的。这意味着，仅有一个公钥是不足以表明一个账户的。

```
Transaction ID: 71b9ded371f66716170d012d2962d97b3dd5c8d820cb62ef775c770949220953

Address	 0x01cf0e2f2f715450
Balance	 0.00100000
Keys	 1
```

要确认这个账户可以使用，你可以通过下面这个命令来获取账户信息。（请用你刚得到的账户id替换下面这个示例中的账户id）


```sh
flow accounts get 0x01cf0e2f2f715450
```

最后，我们更新`flow.json`，把刚才新生成的账户添加进去。我们将会用到那个很长的`key`的定义。


```json
{
  ...,
  "accounts": {
    ...,
    "emulator-artist": {
			"address": "01cf0e2f2f715450",
			"key": {
				"type": "hex",
				"index": 0,
				"signatureAlgorithm": "ECDSA_secp256k1",
				"hashAlgorithm": "SHA3_256",
				"privateKey": "70d4eebade37eabe0a5df1b1664acf25245187068665c529c1d63f0a214dadfa"
			}
		}
  },
  ...
}
```

更多细节请参照[docs][2]

## 合约 Contracts

Great! So we have an account, now let's use it to deploy our `Hello` contract that's located in the `hello` folder. Notice how we're no longer using `log()` for our greeting. That's because logging only works on Flow Playground and in the Cadence REPL shell. Instead, we're going to return the greeting as a string.

太棒了！现在我们有一个账户，我们就可以用它来部署位于`hello`文件夹中的`Hello`合约。请注意，我们将不在使用`log()`输出问候语句。因为这个日志只能在Flow Playground和Cadence REPL shell中使用。作为替代方案，我们可以把问候语句返回成一个string。

另外一个我们要做的改变是我们将会添加一个`事件 event`。当与一个合约交互时，通过事件(event)来显示什么时间发生了什么是非常有帮助的。在模拟器中，交易不会返回值也不会打印日志，所以通过使用事件可以让我们看到我们的`greeting问候语句`。更多的关于事件，请参考[docs][5]。



```cadence
pub contract Hello {
  pub event IssuedGreeting(greeting: String)

  pub fun sayHi(to name: String): String {
    let greeting = "Hi, ".concat(name)

    emit IssuedGreeting(greeting: greeting)

    return greeting
  }
}
```

首先，我们先更新`flow.json` 来给这个合约一个string名字，并且声明源脚本 的路径。


```json
{
  ...,
  "contracts": {
    "Hello": "./hello/contract.cdc"
  },
  ...
}
```

然后我们定义合约部署目标。


```json
{
  ...,
  "deployments": {
    "emulator": {
      "emulator-artist": [
        "Hello"
      ]
    }
  }
  ...
}
```

现在，我们进行下一步，部署整个项目(project)。

```sh
flow project deploy
```

如果一切我们都做对了的话，我们应该会看到下面这个输出。

```
Deploying 1 contracts for accounts: emulator-artist

Hello -> 0x01cf0e2f2f715450 (bed8b44ec08dace72775e07a89ceb2ae24949b8ba8991da824bd0895b10ef36e)
```

更多细节请参照[docs][3]

## 脚本 Scripts

恭喜！现在我们已经将第一个真正的合约部署到了一个账户中。让我们继续。最简单的方式就是执行一个脚本。

就像我们在`Hello`合约中做的更改，我们将会修改脚本，将第二天练习中的打印日志改成返回一个string。另外，我们也会用`name: String`作为一个变量，而不再直接写入。这样做会更有意思！继续之前，有一个小警告，我们需要将`sayHi`方法中的`emit event` 注释掉，因为脚本不支持事件。


```cadence
import Hello from "./contract.cdc"

pub fun main(name: String): String {
  return Hello.sayHi(to: name)
}
```

我们会使用这个明令运行脚本。请注意我们是如果通过使用`--arg Type:value`引入变量的。

```sh
flow scripts execute hello/sayHi.script.cdc \
  --arg String:"FastFloward"
```

警告！如果你用的是Windows PowerShell或者其他非Unix终端的话，请只使用`--arg`来设置变量，`--args-json`在Windows中无法使用。

We can also use **JSON** to encode our arguments. Remember, the top-level has to be an array `[]`, like in this example.

我们可以用**JSON**编码(encode)所有的变量. 请记住，就像这个例子，最高层必须是一个数组`[]`。

```sh
flow scripts execute hello/sayHi.script.cdc \
  --args-json='[{"type": "String", "value": "FastFloward"}]'
```

更多关于脚本和Cadence如何编码JSON的，请参见[docs][3]，

## 交易 Transactions

通过脚本获得Flow链的只读权限已经很厉害了，但交易更厉害。我们一起来看一看！

Flow transactions go through a pipeline that starts with the Cadence source code.

Flow交易依照Cadence源代码，会经历这样一个流程。

1. 构建：用`rlp` 或者"Recursive Length Prefix"编码进行编码.
2. 签名：用密码学的形式为刚才编码过的源代码签名
3. 发送：发送刚才已经编码过的源代码以及签名到一个Flow节点(Access Node)

更多请参见[docs][7]

没错，是时间构建了！下面是一个命令范例用以构造`sayHi.transaction.cdc` 交易。

```sh
flow transactions build ./hello/sayHi.transaction.cdc \
  --authorizer emulator-artist \
  --proposer emulator-artist \
  --payer emulator-artist \
  --filter payload \
  --save transaction.build.rlp
```

这回生成一个`transaction.build.rlp` 文件用以编码我们的源代码以及必须的付款人(payer)发起人(proposer)验证人(authorizer)的信息。下一步我们可以用`emulator-artist`账户签名。


```sh
flow transactions sign ./transaction.build.rlp \
  --signer emulator-artist \
  --filter payload \
  --save transaction.signed.rlp \
  -y
```

This produces another file `transaction.signed.rlp` and we can finally send it to our emulator for processing.
这会生成另一个`transaction.signed.rlp`文件，最终我们会将这个文件发送给模拟器让其来执行。

```sh
flow transactions send-signed ./transaction.signed.rlp
```

如果一切顺利的话，我们应该会在返回中看到我们之前声明的事件(event)

```
Events:
    Index	0
    Type	A.01cf0e2f2f715450.Hello.IssuedGreeting
    Tx ID	2188e78921960e1f4cb336432159c8a161f84a0a336bf3afb33a3f77e0ce7f5e
    Values
		- greeting (String): "Hi, 0x1cf0e2f2f715450"
```

### 捷径 Shortcut

为了让大家更好的理解交易是如何运行的，我们详细分解了流程中的每一步。在将来，我们会用一个相对捷径的方式实现这一过程。

```sh
flow transactions send ./hello/sayHi.transaction.cdc \
  --signer emulator-artist
```

# 任务 Quests

Today's quests will get just a step away from the finish line. Let's go get it! You'll find stubs for these quests in the `/artist` folder.

我们离最终搭建分布式应用的目标越来越近了！今天的任务将会让我们更近一步。你会`/artist`文件夹中看到有关这些任务的文件。

- `W1Q5` – 事件日历

修改你第二天任务中的`Artist`合约，添加3个新事件。并在你认为合适的话，将这些事件发布出去。

```cadence
pub event PicturePrintSuccess(pixels: String)
pub event PicturePrintFailure(pixels: String)
```

- `W1Q6` – 打印 Printer goes brrrrr

Implement the following transactions.
实现下面的这些交易

```
createCollection.transactions.cdc
print.transaction.cdc
```

- `W1Q7` – 你得到的是什么？

Implement the `displayCollection.script.cdc` as per the specification in the file.
依照文件中的要求，实现`displayCollection.script.cdc`

祝好运！

[1]: https://docs.onflow.org/cadence/language/
[2]: https://docs.onflow.org/flow-cli/create-accounts/
[3]: https://docs.onflow.org/flow-cli/deploy-project-contracts/
[4]: https://docs.onflow.org/flow-cli/execute-scripts/
[5]: https://docs.onflow.org/cadence/language/events/
[6]: https://docs.onflow.org/cadence/json-cadence-spec/
[7]: https://docs.onflow.org/concepts/transaction-signing/