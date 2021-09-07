# Flow 快速入门 | 第一周 | 第五天

欢迎来到第5天，也是 Fast Floward课程第一周的最后一天！
在过去的一周里，相信大家已经取得了非常不错的进展。从最简单的Cadence语句开始，一直到一个完整的Artist App的实现，并且能够铸造真实的NFT。但这还只是你旅程的开始! 今天，我们将为Artist App添加一个新功能——交易。在这个过程中，我们将学习如何结合多个智能合约的功能，以及Cadence里面的一个新概念——接口。让我们开始吧~

开始之前，先快速回顾一下前四天的内容。

# 第四天回顾

- Flow Client Library - FCL - 是一个由Flow设计的JavaScript客户端工具。
  - 轻松地集成钱包，并支持无缝的用户认证。
  - 使用`fcl.send`方法通过发送脚本和交易与区块链交互。
  - 使用`fcl.authz`代表当前的用户。
  - FCL通过`fcl.decode`自动将Cadence类型和值转换为JavaScript的标识。
- Flow Testnet提供了一个简单的方法来测试DApp与实时用户钱包的整合。
  - 要查看部署在testnet的合约，请使用[flow-view-source.com][1].
  - 要创建testnet账户以及转账，请使用 [flowfaucet][2].

# 视频

- [Cadence接口, NFT交易](https://youtu.be/ogAls3Wbs9o)

# 答疑时间

- [答疑时间#5](https://www.youtube.com/watch?v=Bnaq37xiTmE)

# Cadence接口


第4天的LocalArtist合约包含了一个新的函数，叫做`withdraw`，它允许从`Collection`资源中提取`Picture`。用这样的函数创建一个公开的**capability**是一个很糟糕的做法——这样每个人都可以从你的Collection中提取Picture。不过好在Capability提供了一个非常好用的能力：你可以自由选择开放多少功能。

当你通过调用`link`创建一个capability时，你会提供capability的类型。

```cadence
account.link<&LocalArtist.Collection>(
  /public/LocalArtistCollection,
  target: /storage/LocalArtistCollection
)
```

只要我们没有任何不安全的方法是与该类型相关的，那就够了。但在我们添加了`withdraw`之后，我们必须以不同的方式创建capability。接下来让我们看看具体怎么实现。

首先，我们创建一个定义了一组字段和函数的接口。注意，这是一个资源接口，但你也可以有结构和合约接口。然后我们修改我们的资源，表明它实现了`PictureReceiver`接口。当然，我们也必须实现该接口所要求的字段和函数。


```cadence
pub resource interface PictureReceiver {
  pub fun deposit(picture: @Picture)
  pub fun getCanvases(): [Canvas]
}
pub resource Collection: PictureReceiver {
  // ...
  pub fun deposit(picture: @Picture) { /* ... */ }
  pub fun getCanvases(): [Canvas] { /* ... */ }
  // ...
}
```
有了这个以后，我们就可以在创建我们的公开capability时继续使用`PictureReceiver`。


```cadence
account.link<&{LocalArtist.PictureReceiver}>(
  /public/LocalArtistPictureReceiver,
  target: /storage/LocalArtistPictureCollection
)
```
现在，任何人尝试与`/public/LocalArtistPictureReceiver`的资源交互时，就只对 `deposit()` 和 `getCanvases()` 进行访问。这样，我们就可以确保只有这个账户的所有者才能从他们的Collection中提取Picture。

以下是视频中的完整的`Greeting`合约。


```cadence
pub contract Hello {
  pub resource interface GreetingLimited {
    pub fun getGreeting(): String
  }
  pub resource Greeting: GreetingLimited {
    pub var greeting: String
    pub init(greeting: String) {
      self.greeting = greeting
    }
    pub fun getGreeting(): String {
      return self.greeting
    }
    pub fun setGreeting(_ greeting: String) {
      self.greeting = greeting
    }
  }

  init() {
    self.account.save<@Greeting>(
      <- create Greeting(greeting: "Hi, FastFloward!"),
      to: /storage/Greeting
    )
    self.account.link<&{GreetingLimited}>(
      /public/Greeting,
      target: /storage/Greeting
    )

    // This fails.
    let greeting = self.account
      .getCapability(/public/Greeting)
      .borrow<&Greeting>()
      ?? panic("I can't!")

    // This works.
    let greetingGood = self.account
      .getCapability(/public/Greeting)
      .borrow<&{GreetingLimited}>()
      ?? panic("I really should...")

    greeting.setGreeting("Bye!")
  }
}
```
要了解更多关于[基于capability的访问控制][3]和[接口][4]，请访问官方文档。


# 交易Pictures

我们已经准备好通过图片交易将我们的LocalArtist应用程序提升到一个新的水平! `day5`文件夹包含了用户界面的更新代码，以及一个新的合约--`LocalArtistMarket`。我们现在需要与一个以上的智能合约进行交互。事实上，当我们完成这个任务时，我们将与3个智能合约进行交互。这真是太棒了!


我将会对这个项目做一个快速的演示，这个会通过视频的方式呈现，所以请记得观看FastFloward第五天的YouTube视频。我将在那里和你见面!

# 任务


就是这样！一旦你完成了这个最后的任务，你就正式成为了一个去中心化的应用开发者，恭喜你！那么，任务是什么呢？好吧，你必须实现几个交易，以最终完成图片交易功能。继续往下看…

- `W1Q9` – 低买高卖

通过实现这些方法修改`/src/context/Flow.jsx`

```
withdrawListing // call LocalArtistMarket.withdraw()
buy // call LocalArtistMarket.buy()
```
另外，看看`/src/pages/Trade/Trade.jsx`，看看你是否需要取消注释......

就这样，你已经有了一个在线的NFT市场!

非常荣幸能指导和帮助在你成为一个去中心化的应用程序开发者。第二周和第三周即将到来，Jacob和Nik以及Decentology团队的其他成员有更棒的内容等着你。所以，请继续接下来的程，乐趣才刚刚开始!

[1]: https://flow-view-source.com/testnet/account/0xda65073324040264
[2]: https://testnet-faucet.onflow.org/
[3]: https://docs.onflow.org/cadence/language/capability-based-access-control/
[4]: https://docs.onflow.org/cadence/language/interfaces/