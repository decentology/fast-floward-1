# Fast Floward 第二周 第一天

嗨咯，我是Jacob。在接下来的时间里（第二周和第三周），由我和大家一起来学习。各位可能已经在讨论区看到我在回答问题，所以希望我不是一个完全陌生的人。虽然我没有Morgan那么厉害，但我希望我们能一起玩得开心，一起学习更多关于Flow/Cadence的知识。

这一周，我会为大家介绍Cadence编程语言，并开始探索由我们在Decentology创造的DappStarter平台，其允许像你们这样的开发者可以快速运转全栈dApp。

开始之前，我建议各位先去浏览以下视频。第一个视频通过Access Control带大家了解Cadence的概念。第二个视频会介绍合约接口（Contract Interfaces）以及前/后置条件的内容。第三个视频会教各位如何从DappStarter上下载第一个框架。而最后一个视频涵盖了DappStarter的整体构建情况。

请注意：今天的视频较多，正因为如此，我把减少了其他任务。事实上，只需跟随视频内容"获取我们的DappStarter dApp "就能完成1/2的任务。

# 视频

· [Cadence接入控制](https://www.youtube.com/watch?v=_CNxRMIrN98)

· [合约接口&前/后置条件](https://www.youtube.com/watch?v=nONO4MSou5Y)

· [获取我们的DappStarter dApp](https://www.youtube.com/watch?v=-CuH95wtR-I)

· [DappStarter整体概览](https://youtu.be/scZZiFXfXa4)

# Cadence 概念

上一周，Morgan帮助大家了解了很多Cadence的概念以及基本句法。本周我们将继续完善对概念的认识。由接入控制开始，然后是合约接口的内容。

## 接入控制

接入控制也可以用访问控制修饰符（Access Modifiers）来描述，它旨在增强我们智能合约的安全性。

以前你可能像这样使用`pub` 关键词来声明所有变量及函数：

```
pub let x: Bool

pub fun jacobIsAwesome(): Bool {
	return true
} 
```

但` pub `的实际含义是什么？为什么把它放在这里？是否有其他关键词可以替代它？我接下来就要回答这些问题。

我们来看一下这个图表，它可以帮助我们了解各种可供使用的访问控制修饰符。

[![hVYubq.png](https://z3.ax1x.com/2021/08/25/hVYubq.png)](https://imgtu.com/i/hVYubq) 

视频中，因为`let` 是常量没有写入scope，所以我们只关注了`var` 段。我推荐大家在阅读下一部分前先观看视频。

Note: [此链接为视频中平台.](https://play.onflow.org/2cc441ff-d356-4e36-a45f-715278bd658f?type=account&id=b97af048-15a4-445d-95fe-a31becc2ce41)

### 作用域

作用域是在运行时代码中的某些特定部分中变量，函数和对象的可访问性，以下是四种作用域类型。

\1. 自由访问 - 表示我们具备最高访问权限，可以自由访问合约内部、事项及脚本等。

\2. 当前和内部 - 表示我们只能访问被定义的地方及其内部。

Ex.

```
pub struct TestStruct {

 pub var x: String

 // The "current and inner scope" for 'x' is here...

 pub fun testFunc() {
  // and in here.
 }

 init(){...}
}
```
\3. 合约 - 表示我们可以访问被定义合约内部。

Ex.
```
pub contract TestContract {

 // The "containing contract" for 'x' is here...

 pub struct TestStruct {

  pub var x: String

  // here...

  pub fun testFunc() {
   // and in here.
  }

  init(){...}
 }
}
```

\4. 账户 - 表示我们可以访问被定义账户内部，要记住：我们可以将多个合约部署到一个账户中。

### pub(set)

`pub(set)` 仅适用于变量、常量以及field。函数不能公开设置，而且它也是风险最高和最容易获取的。

Ex.

```
pub(set) var x: String
```

书写范围 - **全部**

阅读范围 - **全部**

### pub/access(all)

`pub` 与`access(all)`类似。这是`pub(set)`下一层级。

Ex.

```
pub var x: String
access(all) var y: String
 
pub fun testFuncOne() {}
access(all) fun testFuncTwo() {}
```

书写范围 - **当前及内部**

阅读范围 - **全部**

### access(account)

`access(account) `由于其阅读范围的性质，较 `pub` 有更多限制.

Ex.

```
access(account) var x: String

access(account) fun testFunc() {}
```

书写范围- **当前及内部**

阅读范围 - **账户内**

### access(contract)

`access(contract) `由于其阅读范围的性质，较`access(account) `有更多限制。

Ex.

```
access(contract) var x: String

 

access(contract) fun testFunc() {}
```

书写范围 - **当前及内部**

阅读范围 - **合约**

### priv/access（self）

`priv` 与 `access(self)`相同。这是限制最高（同时安全）的范围控制符。

Ex.

```
priv var x: String

access(self) var y: String

priv fun testFuncOne() {}

access(self) fun testFuncTwo() {}
```

书写范围 - **当前及内部**

阅读范围 - **当前及内部**

### 合约接口

我知道，需要更多Cadence的内容，我们几乎要完成了，开个玩笑！我们接下来两周以上的时间都将会和Cadence打交道，所以我们还会继续学习。:)

合约接口和我们上周学过的资源非常类似，但还是稍有不同。本周部分示例中会出现它，我们快点来看一看吧（不用担心，不会很难）

我们来定义一个简单的合约接口:

```
pub contract interface TestContractInterface {
 pub let x: Int

 pub fun readX(): Int {
  post {
   result == self.x:
​    "The result is not equal to x. That's a problem."
  }
 }
 
 pub resource interface INFT{
  pub let y: Int
 }

 pub resource NFT: INFT {
  pub let y: Int
 }
}
```

这里要做很多事情，首先我们要定一个叫`x`的常量、一个叫`readX`的函数、一个叫`NFT`的资源，其用于实现`INFT`资源接口。 但是这样是要做什么呢？此处的重点是什么？

我们可以使用该合约接口来要求其它合约实现其field、函数、变量和常量。我们举一个上面的例子：

```
import TestContractInterface from './TestContractInterface'
pub contract TestContract: TestContractInterface {
 pub let x: Int

 pub fun readX(): Int {
  return self.x
 }

 pub resource NFT: TestContractInterface.INFT {
  pub let y: Int

  init() {
   self.y = 1
  }
 }

 init() {
  self.x = 0
 }
}
```

如您所见，我们需要定义` x `常量、返回`x`的`readX`函数，用以实现`TestContractInterface.INFT` 的`NFT`资源以及名为`y`的field。要注意的是，`NFT `必须命名为 "NFT" ，否则我们会收到错误报告。同样地，我们无法在`TestContract` 中定义我们自己的`INFT`资源接口。此外，由于`TestContractInterface`的书写方式，我们必须用`NFT`实现`TestContractInterface.INFT`。
## 前置条件和后置条件附注

在上述例子中，可以看到我们使用了一个后置条件。这在合约接口中经常使用，但你也可以在正常合约中看到它们。它们被用作额外的安全层级或是表达意图的一种方式，并且其确保了合约函数的相应功能。

我们看一下上面这个例子：

```
pub contract interface TestContractInterface {
 pub let x: Int

 pub fun readX(): Int {
  post {
   result == self.x:
​    "The result is not equal to x. That's a problem."
  }
 }

	{...}
}
```

此处的后置条件用于确保实现`TestContractInterface`必须有返回`self.x.`名为readX的函数，而非其他值。

同样，前置条件用于在一个函数执行之前检查条件是否满足。例子如下：

```
pub contract TestContract {

 {...}

 pub fun deposit(amount: Int): Int {
  pre {
   amount > 0:
​    "We do not want to deposit any value equal to or below 0."
  }

  {...}
 }

 {...}

}
```

在这个例子中，假设我们正在向我们的Vault存款。我们要确保不接受等于或低于0的金额，否则就没有意义了。我们可以使用一个前置条件来做到这一点。我来描述一下为什么这一点如此有用。

1.开发人员意图 - 任何调用存款的人都知道金额必须>0。

2.节省时间和资源 - 如果存款金额<=0，我们将立即恢复调用来节省时间。

3.额外安全层 - 防止我们的Vault受到有害/恶意的行为。

# Dappstarter介绍

您可以通过此链接获取DappStarter: https://dappstarter.decentology.com/

在阅读本节之前，请确保先观看上面的视频。本节将介绍我们在DappStarter中遇到的一些术语，以便对接下来的学习有所了解。

## Action Cards

[![hVYmKs.png](https://z3.ax1x.com/2021/08/25/hVYmKs.png)](https://imgtu.com/i/hVYmKs) 

*Action Cards发送交易的示例*

[![hVYnrn.png](https://z3.ax1x.com/2021/08/25/hVYnrn.png)](https://imgtu.com/i/hVYnrn) 

*Action Cards执行脚本示例*

Action Card是用来运行UI Harness上的事务和脚本的。其内部含有不同的部件，以向事务和脚本传递参数，这是非常有用的，因为我们不再需要在命令行中输入JSON格式的东西，相反，我们可以轻松地选择账户、输入数字等等。

Action Card上有橙色提交（Submit）按钮的，可以将交易发送至区块链中。有绿色查看（View）按钮的则用来执行脚本。

## 部件

部件（Widget）是我们用来在Action Card中选择参数的UI部分，有两种主要类型的部件是你应该了解的：

[![hVYV2Q.png](https://z3.ax1x.com/2021/08/25/hVYV2Q.png)](https://imgtu.com/i/hVYV2Q) 

*账户部件示例*

\1. 账户部件 - 可以让您选择账户，我们可以使用它选择签字人及受让人等等。

[![hVYE8g.png](https://z3.ax1x.com/2021/08/25/hVYE8g.png)](https://imgtu.com/i/hVYE8g) 

*账户部件示例*

\2. 文本部件- 输入数字。我们可以用其输入金额，Kitty Item价格等。

注意：在任何有 "金额 "标签的文本部件中，数字须精确到小数位。例，如果你想输入30，则必须输入30.0。这是因为 "金额"输入要求的是固定精确数字，而不是整数。

# 任务

第一天我们共有两个任务，详见W2Q1 和 W2Q2。这两个任务并不复杂，我知道大家今天已经接受很多知识了。

这些任务不包括合约接口以及前后置条件的内容，我不想让你们压力过大。有需要随时随地都可以找我，我与你们同在。大家需要帮助的时候，可以随意在Discord里面的**burning-questions**频道提问，或者在DM中搜索我也可以！

· W2Q1 – Access Control Party

请看w2q1文件夹。在这个任务中，你将会看到在some_contract.cdc中定义的4个变量（a、b、c、d）和3个函数（publicFunc、privateFunc、contractFunc）。可以看到我已经标记了4个不同的地方（some_contract.cdc中的#1、#2、#3，以及some_script.cdc中的#4），我希望你能回答以下任务。对于每个变量（a、b、c和d），告诉我它们在哪些区域可以被读取（读取范围），哪些区域可以被修改（书写范围）。对于每个函数（publicFunc、contractFunc和privateFunc），简述它们可以在哪里被调用。

例如. 在区域1中:

\1. 可读取的变量: a 和 c.

\2. 可修改的变量: d.

\3. 可获取的函数: publicFunc 和 privateFunc 注意: 这是错误答案 ^, 哈哈!

· W2Q2 – Dappiness

请按照 [Getting our DappStarter dApp](https://www.youtube.com/watch?v=-CuH95wtR-I) 完成该项任务。在DappStarter上获取Fast Floward Foundation，并尝试按照视频中的指示运行你的项目。如果你能 `yarn start`，看到UI Harness，并提交所有第1天的Action Card，就完成任务了! 只需提交Action Card上返回值的截图即可 :)

祝各位一切顺利，Cadence冒险者们，我们下次再见~

 