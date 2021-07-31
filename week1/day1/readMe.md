# 开始前的注意事项

我们迫不及待地等待您加入Flow公链这个建设者社区。在我们开始之前，**请观看我们的 [欢迎视频](https://youtu.be/5xqf8ugzsrc)**，这将让您大致了解您参加 Fast Floward 训练营所能获得成就的预期，以及获得指导您度过接下来的三周学习历程的两条建议。


# 极速Flow学习之旅(Fast Floward) |第 1 周 |第一天

你好！我的名字是摩根(Morgan)。Decentology 的团队将指导您在 极速Flow学习之旅(Fast Floward) 的 3周时间内，使您成为去中心化的应用程序开发人员。

众所周知,在探索和学习一个新事物时，重要的是要限制自己的学习范围。有限的学习时间和无限的学习材料之间存在矛盾，所以我们将专注于学习以最快的速度交付去中心化应用程序或DApps的技能和知识。

要构建任何应用程序,第一个决定就是选择您将要构建应用程序的平台。 DApp也是相同的道理，第一步是选择在哪个平台来开发DApp。我们已经为您做出了这个决定，我们选择的平台是 Flow 和 Cadence。我将解释为什么我们认为这是一个很好的决定。


# 视频

- [Flow编程环境介绍](https://www.youtube.com/watch?v=3vBKQRi_jf4)
- [Cadence 语法和基本类型](https://www.youtube.com/watch?v=rnZPe076cIU)
- [Cadence 函数和复合类型](https://www.youtube.com/watch?v=rTXRKObHrk4)
- [玩转Cadence + 第一天的作业任务](https://www.youtube.com/watch?v=gaK4RvtWYKk)

# Flow链

Flow 是一个高效、快速、可靠的区块链，同时它支持智能合约。它由开发人员为开发人员专门设计，提供了大量工具和资源。您可以在几分钟内从零开始执行您的第一个智能合约，而无需花费大量时间设置您的环境。

Flow 具有一个创新的技术架构，您可以通过访问 [onflow.org][1] 了解更多信息。就我们的训练营而言，我们只需要了解如何与 Flow 区块链交互，因此，我们不会深入研究它的工作原理。


## 开发环境

让我们开始设置我们的开发环境。 Flow 有一个命令行的实用程序，使我们能够与Flow区块链进行交互。我将向您展示如何在 Windows 和 Linux/macOS 上执行此操作。

## Linux/macOS

按照 [documentation][2] 执行。它是一个简单的单行命令。


```sh
sh -ci "$(curl -fsSL https://storage.googleapis.com/flow-cli/install.sh)"
```

请确保在您的 `$PATH` 环境变量中包含 `flow`。完成所有这些后，重新加载您的shell设置。


## Windows

同样，按照 [文档][2]，确保您的 Windows 版本上有 **PowerShell**。搜索 *"PowerShell"* 并在打开PowerShell后运行下面的命令。

```sh
iex "& { $(irm 'https://storage.googleapis.com/flow-cli/install.ps1') }"
```

## 测试

成功安装 `flow-cli` 后，您应该能够运行 version 命令。

```sh
flow version
```

执行后，它应该显示“v0.26.0”。

```sh
Version: v0.26.0
Commit: 5cac45ba37572dfe4279d9ad26019950ef53b3c8
```

为了更进一步，让我们执行我们的第一个 **Cadence** 命令。


```sh
flow cadence
```

首先会出现的是命令行提示符。

```
Welcome to Cadence v0.18.0!
Type '.help' for assistance.

1>
```

让我们向Cadence世界问好！


```
log("Hello, World!")
```


命令行的回复应该是：

```
"Hello, World!"
()
```

我将使用 **VS Code** 作为我的代码编辑器，Flow 的团队为 VS Code 创建了一个扩展工具，它支持语法高亮、类型检查等。要在本地安装它，请根据他们的 [文档][3]，运行此命令。

```sh
flow cadence install-vscode-extension
```

现在我们已经设置好了开发环境，我们可以更深入地研究 **Cadence**，**Flow** 智能合约编程语言。接下来，我将在 Linux 环境中工作，但在 macOS 和 Windows 中也应该有相同的开发体验。


# Cadence

**Cadence** 是一种面向资源的编程语言，您将使用它为 **Flow** 区块链编写智能合约。智能合约是一个在区块链上执行的应用程序。

我们可以使用 Cadence 语言服务器（一个 REPL shell）开始执行 Cadence 代码，我们之前用它来打印过 `"Hello, World!"`。相同的命令可用于执行整个程序文件，稍后会解释。

```
flow cadence [filename]
```


让我们从学习 Cadence 语法开始。请使用 [文档][4] 作为您的参考。

## 语法

```cadence
// 单行注释
/* 大块的 /* 嵌套的 */ 注释 */
```

与大多数其他编程语言一样，在命名变量时，您可以以大写或小写字母“A-Z、a-z”或下划线“_”开头。之后，您也可以包含数字“0-9”。


```cadence
test1234 // 正确
1234test // 错误
(-_-) // 错误
```

分号`;` 是可选的，除非你在同一行中放置了两个或多个声明时，必须用分号分割。

你用 `var` 声明变量，用 `let` 声明常量。当声明一个变量时，你必须初始化它。

```cadence
var counter = 10
counter = 11
let name = "Morgan"
var bad
```

Cadence 中的一切事物都有一个类型，推断得到的类型或显式声明的类型。


```cadence
var isGood: Bool = false
isGood = true // duh!
isGood = 42
```

## 类型

Cadence 有许多有用的类型。让我们来看看其中的一些。


### 整形

```cadence
123
0b1111 // 如果你知道这是什么十进制数！
0o17 // 绝对不是十进制 17
0xff // 这个怎么样？
1_000_000_000 // 十亿
```

所有这些整数都被推断为“Int”，它们可以表示任意大的有符号整数。如果你想更具体，你可以使用`Int8`、`Int16`等。所有`Int`和`UInt`类型检查溢出和下溢。

```cadence
var tiny: Int8 = 126
tiny = tiny + 1
tiny = tiny + 1
```


Cadence 不允许为您的整数分配超出其范围的值。这可以保护我们作为开发人员免受代价高昂的程序溢出错误。

整数有几种方法。


```cadence
let million = 1_000_000
million.toString() // "1000000"
million.toBigEndianBytes() // [15, 66, 64]
```

### 定点数


Cadence 使用“Fix64”和“UFix64”来表示小数值，它们本质上是带有缩放因子的整数，在下面的例子里缩放因子为“8”。

```cadence
let fractional: Fix64 = 10.5
```

### 地址

使用 Cadence时，您将不断与帐户交互，您可以使用“地址”类型引用它们。

```cadence
let myAddress: Address = 0x96462d76b0a776b1
```

### 字符串

Unicode 字符的不可变集合。

```cadence
let name = "Morgan"
```


字符串方法和字段。

```cadence
name.length // 6
name.utf8 // [77, 111, 114, 103, 97, 110]
name.concat(" Wilde") // "Morgan Wilde"
name.slice(from: 0, upTo: 1) // "M"
```

### 可选项

当某些内容可以设置为“nil”或未分配任何值时，可以使用可选项。

```cadence
var inbox: String? = nil
inbox = "FastFloward says hi!"
inbox
inbox = nil
inbox
```

### 数组

Cadence 数组是可变的，可以有固定或可变的长度。数组元素必须是相同的类型“T”或属于“T”的子类型。

```cadence
let days = ["Monday", "Tuesday"]
days
days[0]
days[2]
```

数组类型拥有的方法和字段。

```candence
days.length // 2
days.concat(["Wednesday"]) // ["Monday", "Tuesday", "Wednesday"]
days.contains("Friday") // false
days.append("Wednesday")
days // ["Monday", "Tuesday", "Wednesday"]
days.appendAll(["Thursday", "Friday"])
days.remove(at: 0) // "Monday"
days // ["Tuesday", "Wednesday", "Thursday", "Friday"]
days.insert(at: 0, "Monday")
days // ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
days.removeFirst() // "Monday"
days.removeLast() // "Friday"
```

### 字典

字典是可变的、无序的键值对集合。键必须是可散列和可比较大小的，大多数内置类型都符合这些要求。


```cadence
{} // 空字典
let capitals = {"Japan": "Tokyo", "France": "Paris"}
capitals["Japan"] // "Tokyo" of type String?
capitals["England"] = "London"
capitals
```

字典类型拥有的方法和字段。


```cadence
capitals.keys // ["Japan", "France", "England"]
capitals.values // ["Tokyo", "Paris", "London"]
capitals.containsKey("USA") // false
capitals.remove(key: "France") // "London"
```

## 函数

Cadence 的函数与其他语言中的函数非常相似，尤其是 Swift语言。它们是值类型，这意味着您可以将它们分配给变量，并将它们作为参数传递给其他函数。函数参数可以有标签，这在函数调用点提供了每个值具体代表什么的清晰性。

到目前为止，我们一直在使用 `flow cadence` 的 **REPL** 功能。为了探索函数，我们将通过向解释器发送程序文件来开始执行我们的代码。

```sh
flow cadence test.cdc
```

命令行执行与 `.cdc` 文件的唯一区别是通过文件来执行的方式中，你必须声明一个程序开始执行的入口点。您可以通过声明一个名为 `main()` 的函数来实现。


```cadence
pub fun main() {
  log("Hi!")
}
```

`fun` 之前的关键字 `pub` 是一个访问修饰符，它定义了对值的 *public* 访问。我们稍后会讨论它，现在，在声明 `main()` 函数之外的任何内容时，只需使用 `pub`。

例如。

```cadence
pub fun sayHi(to name: String) {
  log("Hi, ".concat(name))
}
pub fun main() {
  sayHi(to: "FastFloward")
}
```

## 组合类型

我们现在有了开始组装更复杂结构的知识基础。在 Cadence 中，您有两种复合类型。

1. 结构 - 值类型（可复制的）
2. 资源 - 线性类型（可移动的，不可复制的，只能存在一次）

### 声明

您声明的结构和资源几乎相同，每个都可以有字段、函数和初始化函数。每个字段都必须在 `init()` 函数中初始化。

```cadence
pub struct Rectangle {
  pub let width: Int
  pub let height: Int

  init(width: Int, height: Int) {
    self.width = width
    self.height = height
  }
}

pub resource Wallet {
  pub var dollars: UInt

  init(dollars: UInt) {
    self.dollars = dollars
  }
}
```

### 实例化
结构像常规类型一样进行初始化。

```cadence
let square = Rectangle(width: 10, height: 10)
```

资源是不同的，我们使用 `<-` 代替 `=` 来表示我们正在将资源从一个地方移动到另一个地方。我们也不能简单地允许垃圾回收器隐式处理我们的资源释放，就像我们处理结构一样。

```cadence
let myWallet <- create Wallet(dollars: 10)
destroy myWallet
```

我们必须使用 `create` 和 `destroy` 来明确标记我们的资源的初始化和释放的过程。必须将资源明确分配给位于给定范围之外的变量或字段，否则必须将其销毁。

# 代码演练场

有了我们现在知道的一切，我们就可以开始使用 Cadence进行编程。让我们创建一些基本的结构和功能，最终构建一个应用程序，在这个程序里我们可以绘制不可替代的代币！

我们的目标是能够通过打开和关闭像素来绘制 5x5 网格。例如，如果我们想绘制字母 **X**，我们可以这样做（`.` 代表 *打开* 像素，`*` 代表 *关闭* 像素）。

```
*...*
.*.*.
..*..
.*.*.
*...*
```

我们可以创建一个 Cadence 结构来存储我们的像素画布。存储一个可以序列化的字符串而不是二维数组要容易得多，因此这个字符串就代表像素的内容。


```cadence
pub struct Canvas {

  pub let width: UInt8
  pub let height: UInt8
  pub let pixels: String

  init(width: UInt8, height: UInt8, pixels: String) {
    self.width = width
    self.height = height
    // The following pixels
    // 123
    // 456
    // 789
    // should be serialized as
    // 123456789
    self.pixels = pixels
  }
}
```


但是，我们仍然希望以清晰的方式声明我们的绘图，因此我们将使用字符串数组，但是现在，我们将使用 ` ` 来表示 *关闭* 像素，而不是 `.`。

```cadence
let pixelsX = [
  "*   *",
  " * * ",
  "  *  ",
  " * * ",
  "*   *"
]
```

不幸的是，我们无法将数组传递给 Canvas 的初始化程序，为此我们需要一个新函数。


```cadence
pub fun serializeStringArray(_ lines: [String]): String {
  var buffer = ""
  for line in lines {
    buffer = buffer.concat(line)
  }

  return buffer
}
```

这个函数会将字符串数组转换为我们的 Canvas 结构能够接受的字符串。

```cadence
pub fun main() {
  let pixelsX = [
    "*   *",
    " * * ",
    "  *  ",
    " * * ",
    "*   *"
  ]
  let letterX = Canvas(
    width: 5,
    height: 5,
    pixels: serializeStringArray(pixelsX)
  )
}
```

我们希望为我们的像素艺术家提供一些有形的所有权，因此让我们提供将“画布”打印为“图片”资源的功能。为此，我们可以简单地将 `Canvas` 结构包装在一个Picture 资源中。

```cadence
pub resource Picture {
  pub let canvas: Canvas
  
  init(canvas: Canvas) {
    self.canvas = canvas
  }
}
```


现在，我们可以将这个Picture资源与`Canvas` 一起使用。

```cadence
pub fun main() {
  let pixelsX = [
    "*   *",
    " * * ",
    "  *  ",
    " * * ",
    "*   *"
  ]
  let canvasX = Canvas(
    width: 5,
    height: 5,
    pixels: serializeStringArray(pixelsX)
  )
  let letterX <- create Picture(canvas: canvasX)
  log(letterX.canvas)
  destroy letterX
}
```

到现在为止，您应该开始获得有关可以改进此功能并添加更多功能的一些创意。花一些时间探索以下作业任务，看看您是否能找到解决方案。

# 作业任务

第一天，我们有两个任务：“W1Q1”和“W1Q2”。如果您在解决这些问题时需要帮助，请随时在 **burning-questions**  Discord 频道中提出有关的问题。

- `W1Q1` – 构件化!

编写一个在构件中显示画布的函数。

```cadence
pub fun display(canvas: Canvas)
```

```
"+-----+"
"|*   *|"
"| * * |"
"|  *  |"
"| * * |"
"|*   *|"
"+-----+"
```

- `W1Q2` –  独一无二的

创建一个打印“图片”的资源，但对于每个唯一的 5x5“画布”仅打印一次。

```cadence
pub resource Printer {
  pub fun print(canvas: Canvas): @Picture?
}
```

[1]: https://docs.onflow.org/
[2]: https://docs.onflow.org/flow-cli/install/
[3]: https://docs.onflow.org/vscode-extension/
[4]: https://docs.onflow.org/cadence/language/
