# FastFloward | Week 1 | Day 1

When exploring something new, it’s important to limit oneself in terms of scope. There’s only so much time and an infinite amount of material, so we’ll focus on things that lead towards shipping decentralized applications or DApps the fastest.

When you set out to build any App, one of the first decisions is to pick a platform you'll build on. Same with DApps. We've made this decision for you, our platform of choice is Flow and Cadence. I'll explain why we think this is a good decision to get started.

# Flow

Flow is a blockchain that's efficient, fast, reliable, and it supports smart contracts. It is designed by developers for developers with tons of tools and resources made available. You can go from zero to executing your first contract in a few minutes, without having to spend loads of time correctly setting up your environment.

Flow has an innovative architecture, and you can learn more about that by going to [onflow.org][1]. For the purposes of our Bootcamp, we only need to understand how to communicate with the Flow blockchain, and as such, we won't dig deeper into how it works.

## Environment

Let's get started by setting up our environment. Flow has a command-line utility that enables us to interact with the blockchain. I'll show you how to do it both on Windows and Linux/macOS.

## Linux/macOS

Following the [documentation][2] it's a simple one-liner.

```sh
sh -ci "$(curl -fsSL https://storage.googleapis.com/flow-cli/install.sh)"
```

But make sure to include `flow` in your `$PATH`. After doing all that, reload your shell settings.

## Windows

Again, following the [documentation][2], make sure you have **PowerShell** on your version of Windows. Search for *"PowerShell"* and once it's open, run this command.

```sh
iex "& { $(irm 'https://storage.googleapis.com/flow-cli/install.ps1') }"
```

## Testing

After you've successfully installed `flow-cli` you should be able to run the version command.

```sh
flow version
```

As of this recording, it should display `v0.26.0`.

```sh
Version: v0.26.0
Commit: 5cac45ba37572dfe4279d9ad26019950ef53b3c8
```

To take it a step further, let's execute our first **Cadence** command.

```sh
flow cadence
```

We're greeted by a command-line prompt.

```
Welcome to Cadence v0.18.0!
Type '.help' for assistance.

1>
```

Let's say hi to the World!

```
log("Hello, World!")
```

The response should say:

```
"Hello, World!"
()
```

I'm going to be using **VS Code** as my code editor, the team at Flow have created an extension for VS Code that enables syntax highlighting, type checking, and more. To install it locally, as per their [documentation][3], simply run this command.

```sh
flow cadence install-vscode-extension
```

Now that we're all set up, we can dig deeper into **Cadence**, the **Flow** smart contract programming language. Going forward, I'll be working in a Linux environment, but everything should work the same in both macOS and Windows.

# Cadence

**Cadence** is a resource-oriented programming language that you will use to write smart contracts for the **Flow** blockchain. A smart contract is simply a program that executes on the blockchain.

We can start executing Cadence code using the Cadence language server (a REPL shell), which we used earlier to print `"Hello, World!"`. Same command can be used to execute whole files, but on that later.

```
flow cadence [filename]
```

Let's begin by learning about Cadence syntax. Please use the [documention][4] as your reference.

## Syntax

```cadence
// One-line comment
/* Large /* nested */ comment */
```

Same as with most other programming languages, when naming things you may start with upper or lowercase letters `A-Z, a-z` or an underscore `_`. Afterwards you can include numbers `0-9` too.

```cadence
test1234 // cool
1234test // not cool
(-_-) // not cool
```

Semicolons `;` are optional, except for when you put two or more declarations on the same line.

You declare variables with `var` and constants with `let`. When declaring a variable you have to initialize it.

```cadence
var counter = 10
counter = 11
let name = "Morgan"
var bad
```

Everything in Cadence has a type, inferred or explicit.

```cadence
var isGood: Bool = false
isGood = true // duh!
isGood = 42
```

## Types

Cadence has a number of useful types. Let's take a look at some of them.

### Integers

```cadence
123
0b1111 // props if you know what decimal number this is!
0o17 // definitely not a decimal 17
0xff // how about this one?
1_000_000_000 // one BILLION
```

All of these integers are inferred as `Int`s, these can represent arbitrarily large signed integers. If you want to be more specific, you can use `Int8`, `Int16`, etc. All `Int` and `UInt` types check for overflow and underflow.

```cadence
var tiny: Int8 = 126
tiny = tiny + 1
tiny = tiny + 1
```

Cadence will not allow your integers to be assigned values outside of their range. This protects us as developers from costly overflow mistakes.

Integers have a couple of methods.

```cadence
let million = 1_000_000
million.toString() // "1000000"
million.toBigEndianBytes() // [15, 66, 64]
```

### Fixed-Point Numbers

Cadence has `Fix64` and `UFix64` to represent fractional values, which are essentially integers with a scaling factor, in this case with the scaling factor of `8`.

```cadence
let fractional: Fix64 = 10.5
```

### Addresses

With Cadence, you'll constantly be interacting with accounts, and you can reference them using the `Address` type.

```cadence
let myAddress: Address = 0x96462d76b0a776b1
```

### Strings

Immutable collections of Unicode characters.

```cadence
let name = "Morgan"
```

String methods and fields.

```cadence
name.length // 6
name.utf8 // [77, 111, 114, 103, 97, 110]
name.concat(" Wilde") // "Morgan Wilde"
name.slice(from: 0, upTo: 1) // "M"
```

### Optionals

Optionals are used when something can be set to `nil` or have no value assigned.

```cadence
var inbox: String? = nil
inbox = "FastFloward says hi!"
inbox
inbox = nil
inbox
```

### Arrays

Cadence arrays are mutable and can have fixed or variable size. Array elements must share the same type `T` or be of a subtype of `T`.

```cadence
let days = ["Monday", "Tuesday"]
days
days[0]
days[2]
```

Array fields and functions.

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

### Dictionaries

Dictionaries are mutable, unordered collections of key-value pairs. Keys must be hashable and equatable, most of the built-in types conform to these requirements.

```cadence
{} // empty dictionary
let capitals = {"Japan": "Tokyo", "France": "Paris"}
capitals["Japan"] // "Tokyo" of type String?
capitals["England"] = "London"
capitals
```

Dictionary fields and functions.

```cadence
capitals.keys // ["Japan", "France", "England"]
capitals.values // ["Tokyo", "Paris", "London"]
capitals.containsKey("USA") // false
capitals.remove(key: "France") // "London"
```

[1]: https://docs.onflow.org/
[2]: https://docs.onflow.org/flow-cli/install/
[3]: https://docs.onflow.org/vscode-extension/
[4]: https://docs.onflow.org/cadence/language/