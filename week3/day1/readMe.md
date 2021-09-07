# Flow 快速入门 | 第三周 | 第一天

啊啊...我们回来了! 第三周即将到来，这将是多么令人兴奋的一周。除了你又要和我在一起了。

我是 Jacob，本周我们将从 “可组合性” 开始我们的旅程。这到底是什么意思? 我们如何开始执行它，特别是在 Flow 上? 
今天我们将开始回答这些问题。

我们首先从 Nik 的一段视频开始，这段视频介绍了智能合约组合能力。然后，你可以开始探索我们将如何在这个 README 的其余部分中实现可组合性。

请注意，本周我将削减一些视频。相反，我将在 Office hour 浏览 README 内容(和任务答案)。这将帮助你避免看太多我在里面的视频。只是开玩笑。但这将有助于减少冗余，形成更具互动性的学习体验。
澄清一下， Office hour 的视频会在他们结束后更新。这也意味着我不会制作关于智能合约可组合性的技术实现的视频。
相反，我将在这个 README 中留下一些注释，我们将在 Office hour 现场浏览它。让我们玩个痛快。

# 视频

- [智能合约的可组合性](https://www.youtube.com/watch?v=n5sTThzAdL4)

# Flow 网络中的可组合性

今天我们有很多东西要学，一开始可能看起来有点吓人，但我会尽我最大的努力让它容易理解。
为此，请观看 Nik 关于可组合性的视频，否则你很可能很快就会迷失方向，因为本节主要是描述我们如何在 Flow 上实现智能合约可组合性的技术，而不是对概念本身的概述。
尽管，我们会在这个过程中接触到一些概念。

正如 Nik 所描述的，需要智能合约的可组合性。你们中的许多人最近才开始开发 Flow，并且很可能在生态系统中遇到了很多重复。你越深入研究，问题就越明显。不难发现 100 个部署的 NFT 合约都是完全相同的。每次这些合约被部署，它必须事先经过广泛的审查和审计，以确保它是安全的，这本身就是一个漫长而乏味的过程。这就是为什么我们将探索 **可组合性**，即开发人员可以部署智能合约，将数据存储在智能合约的 **租户** 中，而不是合约本身。

Here's an example: You want to make a marketplace smart contract that handles the buying/selling of NFTs. In order to do that, you would need to make your own NFT smart contract and *then* handle the marketplace smart contract. But what if we want to use an NFT contract that's already deployed? Previously, you could do this, however the data of that contract would not be unique to you. For example, the `totalSupply` of NFTs could already be at 100,000. The data belongs to the contract, not you. So the question becomes: how can I (a **租户**) use an NFT contract that already exists within my own marketplace contract (a **组合合约**), but make it so that I own my own data?

下面是一个例子: 你想要创建一个处理 NFT 买卖市场的智能合约。为了做到这一点，你需要制作自己的 NFT 智能合约，**然后** 处理市场智能合约。
但是，如果我们想使用已经部署的 NFT 智能合约，该怎么办?在此之前，你可以这样做，但是该合约的数据对你来说不是唯一的。例如，nft 的 `totalSupply` 可能已经达到 10 万。这些数据属于合约，不是你的。因此，问题就变成了: 我(一个**租户**)如何使用一个已经存在于我自己的市场合约(一个**组合合约**)中的 NFT 合约，但让它使我拥有自己的数据？

*我要扔给你很多东西，所以你要做好准备*

这就是可组合性的用武之地。可组合的智能合约允许**租户**(希望使用可组合合约的人)拥有自己的数据，这些数据不与合约绑定。但是，资源、结构、功能等的定义仍然在合约中。然后，我们将 **Registry** 定义为一组可组合的智能合约(称为**Registry 合约**).
它允许 **租户** 一次性向其 **注册**。在注册时，**租户**收到一个**Auth NFT**(该认证将永远保留)。**租户**然后使用这个**Auth NFT**与**Registry 合约**交互，并接收一个 `Tenant` 资源作为回报，保管他们自己的数据。
通过这种方式，就不需要部署或审计，你不必担心开发 NFT 合约，并且你拥有特定于你的生态系统的自己的数据。你还可以访问无限数量的 **Registry 合约**，你可以随时使用它们。

回到我们的例子: 在 Flow 中是这样的: 我在**RegistryService**注册，并收到一个**Auth NFT**作为回报。然后，我可以选择我想要的任何预部署的 NFT 合约，并调用它来接收一个名为 `Tenant` 的资源，该资源存储自己的数据(如 totalSupply 变量)，这些数据通常存储在合约中。现在，我可以直接开发我的市场合约(一个**组合合约**，因为它引入了可组合合约)。然后，市场合约将使用我的 `Tenant` 资源来处理 NFTs。例如，我们将使用 `Tenant` 资源调用 `mintNFT `函数(在 NFT 合约中定义)来将 NFT 添加到用户帐户中。然后我们可以在市场合约中购买/出售这些 NFTs。在这种情况下， NFT 合约也将被设置为在创 NFT 时处理增量的 `totalSupply`.

*哇*。我刚告诉了你很多。我很抱歉。好消息是，我们本周将在另一个 DappStarter 项目中使用这个具体的场景，所以我相信在接下来的日子里这将更有意义。我们也把它分成几个部分。
## RegistryService 注册服务

**RegistryService**是一个合约。在它里面，有两件事你必须知道:
1)`AuthNFT` 资源——这是一个任何人想要使用 **RegistryContracts** 必须拥有的资源。我将在 **RegistryInterface** 部分解释原因。
注意，想要与注册中心交互的人(一个**租户**)只需要获得一次 `AuthNFT`。一旦他们这样做了，他们不再需要再做一次，不管你想要使用多少 **registrycontract**。
2)`register` 函数——返回一个新的 `AuthNFT` 给 **租户**。就是这样。再次强调:这将只被每个**租户**调用一次。

## RegistryInterface 注册接口

The **RegistryInterface** is a contract interface. It must be implemented by **RegistryContracts** if they want to be in the **Registry**. Thus, the interface defines a few things that every **RegistryContract** MUST have:
**RegistryInterface** 是一个合约接口。它必须由 **registrycontract** 实现，如果它们想要使用 **Registry** 。因此该接口定义了一些每个**RegistryContract**必须有的东西:

1)`clientTenants` 字典 —— 它跟踪每个 **租户** 拥有多少 `Tenant` 资源。它将每个 **租户** 的地址映射到他们从 **RegistryContract** 收到的 `Tenant` 资源的数量。
2)`Tenant` 资源 —— 这是最重要的。每个**RegistryContract**必须定义每个**租户** 将接收的 `Tenant` 资源。在它里面是合约通常会存储在最顶层的所有数据 + 你通常会在合约的 `init` 函数中存储在帐户中的所有数据。
示例:如果一个合约有一个名为 `totalSupply` 的合约变量，并在合约的 `init` 函数的帐户存储中存储了一个 `NFTMinter` 资源，那么 `Tenant` 资源将有两个东西: 一个 `totalSupply` 变量和一个 `NFTMinter` 资源。请注意资源管理器中可以有资源(“嵌套资源”)。
3)`instance` 函数 —— 返回一个新的 `Tenant` 资源给调用者(一个 **租户**)，并通过在字典中向调用者地址计数中添加 1 来更新  `clientTenants` 。这个函数有一个参数:一个对 `AuthNFT` 的引用。这确保了**租户**已经注册了**RegistryService**，并通过执行 `AuthNFT.owner!` 从 `AuthNFT` 本身获取调用者的地址以防止欺诈。
4) `getTenants` 函数——返回 `clientTenants` 字典。

## Registry contract/Composable Contracts 注册合约/可组合合约

**RegistryContract** 是一个可组合的合约。任何人都可以创建它，只要它实现了**RegistryInterface**。**RegistryContract**的目的是使所有数据不再存储在合约中。相反，它存储在你在本合约中定义的 `Tenant` 资源中。如上所述，`Tenant` 资源包括:
1) 通常应储存在合约中的任何数据(例如: `totalSupply`)
2) 在合约的 `init` 函数中存储到帐户存储的任何东西(例如 `NFTMinter` 资源)

**Tenant 资源不应该链接给账户的 public storage。如果你这样做了，任何人都可以访问你的 `Tenant` 的引用，并修改其中的数据**

当我们这样做的时候，会发生很多奇怪的事情。想想这里的一些问题……

In a normal NFT Contract, we would define `totalSupply` at the top-most level in the contract. This would allow any resource/function to modify `totalSupply` regardless of its access modifier. So if we defined an `NFT` resource that updates `totalSupply` when it mints, it would simply do `NFTContract.totalSupply = NFTContract.totalSupply + 1`, and we're good, like so:

在一个正常的 NFT 合约中，我们将在合约的最顶层定义 `totalSupply`。这将允许任何资源/函数修改 `totalSupply`，而不管它的访问修饰符是什么。因此，如果我们定义了一个 `NFT` 资源，当它创建时更新 `totalSupply`，它将简单地执行 `NFTContract.totalSupply = NFTContract。totalSupply + 1 `，像下面这样

```cadence
pub contract NFTContract {
    pub var totalSupply: UInt64

    pub resource NFT {
        pub let id: UInt64

        init() {
            NFTContract.totalSupply = NFTContract.totalSupply + 1
        }
    }

    pub resource NFTMinter {
        pub fun mintNFT(): @NFT {
            return <- create NFT()
        }       
    }

    init() {...}
}
```

But this isn't the case anymore. In **RegistryContracts**, our `totalSupply` is defined inside our `Tenant` resource because it's data. `totalSupply` belongs to the `Tenant`. This means that anyone who has an `NFTMinter` resource (as shown below) who wants to mint an NFT HAS to pass in a reference to the `Tenant` itself and update `totalSupply` on that reference. The only way we can do this, though, is if we make `totalSupply` have an access modifier of `pub(set)`. Let's look at an example:

但现在情况不同了。在 **RegistryContracts** 中，我们的 `totalSupply` 是在 `Tenant` 资源中定义的，因为它是数据。`totalSupply` 属于 `Tenant`。这意味着任何拥有 `NFTMinter` 资源(如下所示)的人，如果想要创建一个 NFT 就必须将一个引用传递给 `Tenant` 本身，并在该引用上更新 `totalSupply`。但是，我们能做到这一点的唯一方法是让 `totalSupply` 具有 `pub(set)` 的访问修饰符。让我们来看一个例子:

```cadence
pub contract RegistryNFTContract: RegistryInterface{
    // 在 RegistryInterface 中定义必须实现的属性
    pub var clientTenants: {Address: UInt64}

    // 在 RegistryInterface 中定义必须实现的属性
    pub fun instance(): @Tenant {...}

    // 在 RegistryInterface 中定义必须实现的属性
    pub fun getTenants(): {Address: UInt64} {...}

    // 在 RegistryInterface 中定义必须实现的属性
    pub resource Tenant {
        pub(set) var totalSupply: UInt64

        init() {...}
    }

    pub resource NFT {
        pub let id: UInt64

        init(_tenantRef: &Tenant) {
            _tenantRef.totalSupply = _tenantRef.totalSupply + 1
        }
    }

    pub resource NFTMinter {
        pub fun mintNFT(_tenantRef: &Tenant): @NFT {
            return <- create NFT(_tenantRef: _tenantRef)
        }       
    }

    init() {...}
}
```

需要注意的是，如果我们将 `totalSupply` 定义为 `pub var totalSupply: UInt64`，这将不起作用，因为 `pub` 只具有当前和内部的写入范围，这是我们在第 2 周第 1 天学到的。

你可能会想: 这太不优雅了。现在，为了创建一个NFT，任何拥有 NFTMinter 资源的人都必须访问 `Tenant` 引用，这是不可能的，因为 `NFTMinter` 永远不会链接到公众。我们将在明天的内容中讨论这个问题，并提出解决方法。
## Composed Contract/Consumer Contract 组合合约/消费合约

一个 **组合合约** 是一个使用了**Registry/Composable Contracts**的合约。我们将名称概括为“可组合合约”，但实际上可组合合约这并不全是**RegistryContract**合约。这个想法是 **组合合约**将利用**注册合约**的优势。
例如，如果我们想要创建一个市场合约(我们的**组合合约**)，但我们需要一个 NFT 来在该市场上购买/出售，我们就会实现一个 `MarketplaceContract.cdc`，并在其中导入一个定义了 NFT 的**Registry Contract**。在这个场景中，我们的**组合合约** (marketplaccontract .cdc)使用了一个**Registry Contract**(也就是我们所说的 `RegistryNFTContract`)。

This can be extended to practically any example where a developer-defined contract attempts to utilize pre-defined contracts in the **Registry**.
这可以扩展到任何开发人员定义的合约试图利用**Registry**中预定义的合约的例子。

# 任务

我今天有个任务要交给你，`W3Q1`

- `W3Q1` – 更多 Git!

对于这个任务，我想让你尝试并理解在 Flow 上可组合合约的技术实现，我们会使用 `fast-floward-registry-demo` github 仓库：
https://github.com/decentology/fast-floward-registry-demo。
就像上周一样，把仓库复制到你的电脑上，看看你能否运行 `yarn`  和 `yarn start` 启动它。看到 UI Harness 后，你不需要做任何事情。我们将在明天的任务中使用这个。

接下来，尝试查看 `/packages/dapplib/contracts` 目录，并查看那里的合约。你会看到3个文件夹:
1)`Flow`—— 这不是很重要，但它包含 NFT 合约的接口
2)`Registry`—— 包含**RegistryService**， **RegistryInterface**，以及一个名为 RegistryNFTContract 的示例**RegistryContract**，这与我们上面的示例非常相似
3)`Project` —— 包含一个名为 marketplaccontract 的示例**组合合约**。MarketplaceContract 在其实现中使用了 RegistryNFTContract，这也是为什么有人可能首先需要一个 RegistryNFTContract 的一个例子。
*注意:*还有一个名为 NFTContract 的合约，但我们不会使用这个。我提供这个合约是为了显示不可组合合约(NFTContract)和可组合合约(RegistryNFTContract)之间的对比。你会注意到它们的用途几乎相同，但一个是设计成可组合的，而另一个不是。

你不需要提交任何东西，但是请问关于这个实现的问题。一开始你不会理解所有的事情，这是完全可以的，因为我们将继续这个讨论，并在未来一周与这个仓库一起工作。

祝你一路顺风。可组合性冒险者们，我们下次再见~