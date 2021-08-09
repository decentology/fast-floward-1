# Fast Floward | Week 3 | Day 1

Aaaaaaand we're back! Week 3 is upon us and what an exciting week it will be. Except for the fact that you're stuck with me again.

It's Jacob here and this week we'll be starting our journey with something called "composability." What does that even mean? How do we begin to implement it, specifically on Flow? We will begin to answer these questions today.

We will first start with a video by Nik on an intro to Smart Contract Composability. Afterwards, you can begin to explore how we will implement composability in the rest of this README. 

Please note that this week, I will be cutting back on some videos. Instead, I will walk through the README content (and quest answers) in office hours. This will help prevent you from having to watch too many videos with me in it. Just kidding. But it will help reduce redundancy and contribute to a more interactive learning experience. To clarify, the office hour videos will be updated here after they're over. This also means I will not make a video on the technical implementation of smart contract composability. Instead, I will leave a bunch of notes in this README, and we will walk through it live in office hours. Let's have a blast.

# Videos

- [Smart Contract Composability](https://www.youtube.com/watch?v=n5sTThzAdL4)

# Composability on Flow

There's a lot to learn and it may seem intimidating at first, but I will try my best to make it easy to understand. In order to do that, please watch Nik's video on Composability or you will most likely get lost quickly, since this section is mostly a description of how we went about the technical implentation of smart contract composability on Flow rather than an overview of the concept itself. Although, we will touch on some of those concepts along the way.

As Nik described, there is a need for composability of smart contracts. Many of you have started developing on Flow very recently and have most likely encountered much repetition in the ecosystem. The more you develop and get involved, the problem becomes even more clear. It's not difficult to find 100 deployed NFT Contracts out there that are all the exact same. And each time one of those contracts gets deployed, it must previously go through extensive review and auditing to make sure it's safe, which is a long and tedious process in itself. This is why we will explore **composability**, which is the idea that developers can deploy smart contracts that store data within **Tenants** of the smart contract rather than the contract itself.

Here's an example: You want to make a marketplace smart contract that handles the buying/selling of NFTs. In order to do that, you would need to make your own NFT smart contract and *then* handle the marketplace smart contract. But what if we want to use an NFT contract that's already deployed? Previously, you could do this, however the data of that contract would not be unique to you. For example, the `totalSupply` of NFTs could already be at 100,000. The data belongs to the contract, not you. So the question becomes: how can I (a **Tenant**) use an NFT contract that already exists within my own marketplace contract (a **Composed Contract**), but make it so that I own my own data?

*I'm about to throw a lot at you, so get prepared...*

This is where composability comes in. A composable smart contract is one that allows **Tenants** (people who want to use the composable contract) to have their own data that is not tied to the contract. But, the definitions of resources, structs, functions, etc all still lie within the contract. We then define a **Registry** to be a collection of composable smart contracts (called **Registry Contracts**) that allow **Tenants** to **register** with it one time. Upon registering, the **Tenant** receives an **Auth NFT** (that is held on to forever). **Tenants** then use this **Auth NFT** to interact with the **Registry Contracts** and receive a `Tenant` Resource in return that holds their own data. This way, there is no deployment or auditing needed, you don't have to worry about developing your NFT contract, and you have your own data specific to your ecosystem. You also have access to an infinite amount of **Registry Contracts** for you that you can use whenever you need them.

Back to our example: the flow (haha) would be as such: I register with the **RegistryService** and receive an **Auth NFT** in return. I can then choose any pre-deployed NFT Contract that I want and call into it to receive a Resource called a `Tenant` that stores its own data (like a totalSupply variable) that would normally be stored in the contract. Now, I can go right to developing my marketplace contract (a **Composed Contract** since its bringing in composable contracts). The marketplace contract would then use my `Tenant` Resource to work with NFTs. For example, we would use our `Tenant` resource to call a `mintNFT` function (defined in the NFT Contract) to add NFTs into users accounts. We can then buy/sell these NFTs in the marketplace contract. In this case, the NFT Contract would also already be set up to handle incrementing totalSupply upon minting an NFT.

*Woah*. I just threw A LOT at you. I'm sorry. The good news is we will be working with this EXACT scenario this week in another DappStarter project, so I have faith that this will make much more sense in the upcoming days. Let's also break it down into sections.

## RegistryService

The **RegistryService** is a contract. Inside it, there are two things you have to know:
1) an `AuthNFT` resource - this is a resource that anyone who wants to use **RegistryContracts** MUST have. I will explain why in the **RegistryInterface** section. Note that someone who wants to interact with the Registry (a **Tenant**) only has to get an `AuthNFT` once. Once they do, they no longer have to do it again, no matter how many **RegistryContracts** you want to use.
2) a `register` function - this returns a new `AuthNFT` to the **Tenant**. That's it. And again: this will only be called once per **Tenant**.

## RegistryInterface

The **RegistryInterface** is a contract interface. It must be implemented by **RegistryContracts** if they want to be in the **Registry**. Thus, the interface defines a few things that every **RegistryContract** MUST have:
1) a `clientTenants` dictionary - this keeps track of how many `Tenant` resources each **Tenant** has. It maps the address of each **Tenant** to the number of `Tenant` resources they have received from the **RegistryContract**.
2) a `Tenant` resource - this is the most important. Every **RegistryContract** must define a `Tenant` resource that every **Tenant** will receive. In it is all the data the contract would normally store at the top-most level + anything you would normally put in account storage inside the contract's `init` function. Example: if a contract has 1 contract variable called `totalSupply` and stores an `NFTMinter` resource in account storage in the contract's `init` function, the `Tenant` resource would have two things: a `totalSupply` variable and a `NFTMinter` resource. Note that resourcers can have resources inside them ("nested resources").
3) an `instance` function - returns a new `Tenant` resource to the caller (a **Tenant**) and updates `clientTenants` by adding 1 to the caller address' count inside the dictionary. This function takes in 1 parameter: a reference to an `AuthNFT`. This ensures the **Tenant** has already registered with the **RegistryService** and gets the address of the caller from the `AuthNFT` itself by doing `authNFT.owner!.address` to prevent fraud.
4) a `getTenants` function - this returns the `clientTenants` dictionary.

## Registry Contracts/Composable Contracts

A **RegistryContract** is a composable contract. It can be made by anyone as long as it implements the **RegistryInterface**. The point of a **RegistryContract** is to make it so that all data is no longer stored in the contract. Rather, it is stored in the `Tenant` resource that you define in this contract. As described above, the `Tenant` resource is composed of:
1) any data that would normally be stored in the contract (ex. `totalSupply`)
2) anything that would be stored to account storage in the contract's `init` function (ex. an `NFTMinter` resource)

**A Tenant Resource should never be linked to the public. If it is, anyone can access a reference to your `Tenant` and modify the data in it.**

Now, there are a LOT of weird things that happen when we do this. Think about some issues here...

In a normal NFT Contract, we would define `totalSupply` at the top-most level in the contract. This would allow any resource/function to modify `totalSupply` regardless of its access modifier. So if we defined an `NFT` resource that updates `totalSupply` when it mints, it would simply do `NFTContract.totalSupply = NFTContract.totalSupply + 1`, and we're good, like so:

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

But this isn't the case anymore. In **RegistryContracts*, our `totalSupply` is defined inside our `Tenant` resource because it's data. `totalSupply` belongs to the `Tenant`. This means that anyone who has an `NFTMinter` resource (as shown below) who wants to mint an NFT HAS to pass in a reference to the `Tenant` itself and update `totalSupply` on that reference. The only way we can do this, though, is if we make `totalSupply` have an access modifier of `pub(set)`. Let's look at an example:

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

It's important to realize that if we defined `totalSupply` as `pub let totalSupply: UInt64`, this wouldn't work because `pub` only has write scope of current & inner as we learned during Week 2 Day 1.

You might be thinking: well this stinks. Now, in order to mint an NFT, anyone who has a NFTMinter resource has to also have access to the `Tenant` reference, which is not possible since `Tenant` will never be linked to the public. We will go over this issue in tomorrow's content and present a way to solve it. 

## Composed Contract/Consumer Contract

A **Composed Contract** is a contract that uses **Registry/Composable Contracts**. We generalize the name to 'Composed Contract', but in reality this is any contract that isn't a **RegistryContract**. The idea is that the **Composed Contract** would utilize the **Registry Contracts** to its advantage. 

For example, if we wanted to make a Marketplace Contract (our **Composed Contract**) but we needed an NFT to buy/sell on that marketplace, we would implement a `MarketplaceContract.cdc`, and inside it, import a **Registry Contract** that defines an NFT. In this scenario, our **Composed Contract** (MarketplaceContract.cdc) is using a **Registry Contract** (let's say `RegistryNFTContract`). 

This can be extended to practically any example where a developer-defined contract attempts to utilize pre-defined contracts in the **Registry**.

# Quests

I have one quest for you today, `W3Q1`.

- `W3Q1` – More Git!

For this quest, I'd like for you to try and understand the technical implementation of composability on Flow using the fast-floward-registry-demo github repo found here: https://github.com/decentology/fast-floward-registry-demo. Like last week, clone the repo onto your computer and see if you can `yarn` and `yarn start` it. You don't have to do anything once you see the UI Harness. We will use this in tomorrow's quest instead. 

Next, try and walk through the `/packages/dapplib/contracts` directory and go through the contracts there. You'll see 3 folders:
1) 'Flow' - this isn't too important, but it has the NFT contract interface in it
2) 'Registry' - this contains the **RegistryService**, **RegistryInterface**, and an example **RegistryContract** named RegistryNFTContract that is very similar to the example we went over above
3) 'Project' - this contains an example **Composed Contract** named MarketplaceContract. MarketplaceContract uses the RegistryNFTContract in its implementation and is an example of why someone might need a RegistryNFTContract in the first place. *Note:* There is also a contract named NFTContract, but we will NOT be using this. I have provided this contract to show the contrast between a non-composable contract (NFTContract) and a composable contract (RegistryNFTContract). You'll notice they serve near identical purposes, but one is designed to be composable and one isn't. 

You do not have to submit anything, but please ask questions about this implementation. You will not understand everything at first and that is totally okay as we will continue this discussion and work with this repo for the week ahead.


Good luck on your journey. See you next time Composability adventurers ~