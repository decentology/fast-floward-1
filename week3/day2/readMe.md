# Flow 快速入门 | 第三周 | 第二天

Hi，再次和你问声好！还是我，世界上最好的开发者(Jacob)。今天，我们将继续讨论Flow的可组合性。具体来说，我们将深入探讨昨天学到的具体实现中可能遇到的一些问题，以及如何帮助我们可爱的朋友来访问控制并解决它们。

作为附注，我非常感谢我们收到的反馈意见。我非常喜欢和你们每个人谈论你们对Flow, Cadence, Composability等的最初反应。继续问问题，进行对话，这很好!


# 视频

今天没有视频给你看。今天的内容只不过是昨天内容的延伸，我们将在办公时间浏览这些内容。我鼓励你们看完视频后再看。

更新: 办公时间视频 - https://youtu.be/X2NPoOElKkk

# 注册合约中的几个初步问题

## 审查

让我们回顾一下昨天的一些信息，因为我给了你很多……我将复制和粘贴的一些内容从昨天。再看一遍会有帮助的。

这个**RegistryContract**是一个合约。任何人都可以创建它，只要它实现了**RegistryInterface**。**RegistryContract**的目的是使所有数据不再存储在合约中。相反，它存储在您在本合约中定义的`Tenant`资源中。如上所述，`Tenant`资源包括:
1)通常应储存在合约中的任何数据(例如: `totalSupply`)
2)在合约的`init`函数中存储到帐户存储的任何东西(例如`NFTMinter`资源)
 
**`Tenant`资源不应该是公共链接。如果是，任何人都可以访问您的`Tenant`的引用，并修改其中的数据**

当我们这样做的时候，会发生很多奇怪的事情。想想这里的一些问题……
 
在一个正常的NFT合约中，我们将在合约的最顶层定义`totalSupply`。这将允许任何资源/函数修改`totalSupply`，而不管它的访问修饰符是什么。因此，如果我们定义了一个`NFT`资源，当它创建时更新`totalSupply`，它将简单地执行`NFTContract`。`totalSupply = NFTContract.totalSupply + 1`，是这样的。

但现在情况不同了。现在，`totalSupply` 是在 `Tenant` 资源中定义的，因为它是数据。`totalSupply`属于`Tenant`。这意味着任何拥有`NFTMinter`资源(如下所示)的人，如果想要创建一个`NFT HAS`，就必须将一个引用传递给`Tenant`本身，并在该引用上更新`totalSupply`。但是，我们能做到这一点的唯一方法是让`totalSupply`具有`pub(set)`的访问修饰符。让我们来看一个例子:


```cadence
pub contract RegistryNFTContract: RegistryInterface{
    // Required from RegistryInterface
    pub var clientTenants: {Address: UInt64}

    // Required from RegistryInterface
    pub fun instance(): @Tenant {...}

    // Required from RegistryInterface
    pub fun getTenants(): {Address: UInt64} {...}

    // Required from RegistryInterface
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

需要注意的是，如果我们将`totalSupply`定义为`pub var totalSupply: UInt64`，这将不起作用，因为`pub`只具有当前和内部的写入范围，这是我们在第2周第1天学到的。

## 使用访问控制更新数据

昨天的回顾到此结束。你可能会想: 这太棒了。现在，为了创建一个NFT，任何拥有`NFTMinter`资源的人都必须访问`Tenant`引用，这是不可能的，因为`Tenant`永远不会链接到公众。那么，只有`Tenant`资源的所有者才能创建非功能性测试，这是真的吗?不。让我们看看如何解决这个问题，以便任何想要创建非功能性测试的人都可以不需要`Tenant`引用。

```cadence
pub contract RegistryNFTContract: RegistryInterface {
    // Required from RegistryInterface
    pub var clientTenants: {Address: UInt64}

    // Required from RegistryInterface
    pub fun instance(): @Tenant {...}

    //注册表接口
    pub fun getTenants(): {Address: UInt64} {...}

    //我们定义一个名为ITenantMinter的资源接口
    //允许这个契约调用updateTotalSupply。
    pub resource interface ITenantMinter {
        pub var totalSupply: UInt64
        access(contract) fun updateTotalSupply()
    }

    // Required from RegistryInterface
    pub resource Tenant: ITenantMinter {
        pub var totalSupply: UInt64

        // Define an updateTotalSupply function to be exposed
        // by the ITenantMinter resource interface.
        access(contract) fun updateTotalSupply() {
            self.totalSupply = self.totalSupply + 1
        }

        init() {...}
    }

    pub resource NFT {
        pub let id: UInt64

        init(_tenantRef: &Tenant{ITenantMinter}) {
            self.id = _tenantRef.totalSupply
            _tenantRef.updateTotalSupply()
        }
    }

    pub resource NFTMinter {
        pub fun mintNFT(_tenantRef: &Tenant{ITenantMinter}): @NFT {
            return <- create NFT(_tenantRef: _tenantRef)
        }       
    }

    init() {...}
}
```

在这个例子中，我们做了一些了不起的事情。任何拥有`NFTMinter`资源的人只需要一个`Tenant{ITenantMinter}`引用，该引用将在**Tenant**将其链接到公众后公开可用。注意，这与将`Tenant`本身链接到公共不是一回事。这就是功能如此酷的原因: 我们将`Tenant{ITenantMinter}`公开给公众，这样任何拥有`NFTMinter`资源的人都可以借用它并使用它来创建 NFTs。

## 嵌套资源和如何处理它们

我们遇到的另一个问题是`嵌套资源`。昨天，我告诉你`Tenant`资源有两个方面:
1)通常应储存在合约中的任何数据(例如: `totalSupply`)
2)在合约的`init`函数中存储到帐户存储的任何东西(例如`NFTMinter`资源)

让我们关注第二条。如果我们通常将`NFTMinter`资源存储在帐户存储中，那么我们现在必须将其存储在租户本身中。这是因为，正如我们所了解的，`Tenant`资源在每次由`instance`函数创建并返回给调用者时都充当初始合约状态。但是我们如何处理嵌套资源呢? 让我们来看看:

```cadence
pub contract RegistryNFTContract: RegistryInterface {
    // Required from RegistryInterface
    pub var clientTenants: {Address: UInt64}

    // Required from RegistryInterface
    pub fun instance(): @Tenant {...}

    // Required from RegistryInterface
    pub fun getTenants(): {Address: UInt64} {...}

    // We define a resource interface called ITenantMinter
    // that allows this contract to call updateTotalSupply.
    pub resource interface ITenantMinter {
        pub var totalSupply: UInt64
        access(contract) fun updateTotalSupply()
    }

    // Required from RegistryInterface
    pub resource Tenant: ITenantMinter {
        pub var totalSupply: UInt64

        access(self) let nftMinter: @NFTMinter

        pub fun getMinterRef(): &NFTMinter {
            return &self.nftMinter as &NFTMinter
        }

        // Define an updateTotalSupply function to be exposed
        // by the ITenantMinter resource interface.
        access(contract) fun updateTotalSupply() {
            self.totalSupply = self.totalSupply + 1
        }

        init() {
            self.totalSupply = 0
            self.nftMinter <- create NFTMinter()
        }
    }

    pub resource NFT {
        pub let id: UInt64

        init(_tenantRef: &Tenant{ITenantMinter}) {
            self.id = _tenantRef.totalSupply
            _tenantRef.updateTotalSupply()
        }
    }

    pub resource NFTMinter {
        pub fun mintNFT(_tenantRef: &Tenant{ITenantMinter}): @NFT {
            return <- create NFT(_tenantRef: _tenantRef)
        }       
    }

    init() {...}
}
```

如您所见，我们将`NFTMinter`资源存储在`Tenant`资源中。然后添加一个返回该资源引用的函数会很有帮助，因为在Cadence中移动嵌套资源是非常痛苦的。通过这种方式，我们可以轻松地在`NFTMinter`上执行操作，而无需移动它。

# 任务

今天我有一个任务要给你，`W3Q2`。

- `W3Q2` – 可组合性 & 访问控制

在本任务中，我们将使用今天学到的内容来修改我们的`RegistryNFTContract`。在它当前的实现中，你必须将租户本身的引用(没有限制接口)传递给`mintNFT`函数，这样它就可以在`NFT`资源的`init`函数中更新`Tenant`资源的`totalSupply`。我要你把这个改了。试着找出一种方法(非常类似于上面的方法)，在那里我们可以定义一个接口来公开一个更新`totalSupply`的函数，这样我们就可以稍微限制一下我们传递给`mintNFT`的引用。一旦您这样做了，请确保您更新了创建/将`Tenant`资源链接到公众的过程中所涉及的事务，以包括这个资源接口。

  
请提交您更新的合约/交易代码。

注意: 这个任务不会花很长时间。这是因为我希望您开始考虑可能有用的`自己的`可组合合约示例。开始问自己以下问题:
1)是否存在可组合的重复合约，这样每个租户都可以拥有自己的数据，而无需部署一个全新的合约(就像我们简单的NFT合约)?
2)我有什么想法适合这个可组合性模型? 它可以是一个表示Cake的非功能性测试，也可以是一个表示Cookie ....的FungibleToken, 我饿了。
祝你一路顺风。下次可组合性冒险者们 再见~
