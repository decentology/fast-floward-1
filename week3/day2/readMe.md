# Fast Floward | Week 3 | Day 2

Hi! It's me again, the best developer in the world (Jacob). Today, we will continue our conversation about composability on Flow. Specifically, we will dive into some issues we may encounter using the implementation we learned about yesterday & how to solve them using our lovely friend Access Control.

As a side note, I have greatly appreciated the feedback we have received in the discord. I really enjoy getting to talk to each of you about your initial reactions to Flow, Cadence, Composability, etc. Keep asking questions and having converations, it's great!

# Videos

There are no videos for you to watch today. Today's content is merely an extension of yesterday, and we will be walking through this in office hours. I encourage you to watch that video after I post it here.

# Some Initial Problems in RegistryContract

## Review

Let's review some information from yesterday since I threw a lot at you... I will include a copy & paste of some content from yesterday. It will be helpful to look at it again.

A **RegistryContract** is a contract. It can be made by anyone as long as it implements the **RegistryInterface**. The point of a **RegistryContract** is to make it so that all data is no longer stored in the contract. Rather, it is stored in the `Tenant` resource that you define in this contract. As described above, the `Tenant` resource is composed of:
1) any data that would normally be stored in the contract (ex. `totalSupply`)
2) anything that would be stored to account storage in the contract's `init` function (ex. an `NFTMinter` resource)

**A Tenant Resource should never be linked to the public. If it is, anyone can access a reference to your `Tenant` and modify the data in it.**

Now, there are a LOT of weird things that happen when we do this. Think about some issues here...

In a normal NFT Contract, we would define `totalSupply` at the top-most level in the contract. This would allow any resource/function to modify `totalSupply` regardless of its access modifier. So if we defined an `NFT` resource that updates `totalSupply` when it mints, it would simply do `NFTContract.totalSupply = NFTContract.totalSupply + 1`, and we're good.

But this isn't the case anymore. Now, `totalSupply` is defined inside our `Tenant` resource because it's data. `totalSupply` belongs to the `Tenant`. This means that anyone who has an `NFTMinter` resource (as shown below) who wants to mint an NFT HAS to pass in a reference to the `Tenant` itself and update `totalSupply` on that reference. The only way we can do this, though, is if we make `totalSupply` have an access modifier of `pub(set)`. Let's look at an example:

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

## Using Access Control to Update Data

This wraps up our review from yesterday. You might be thinking: well this stinks. Now, in order to mint an NFT, anyone who has a NFTMinter resource has to also have access to the `Tenant` reference, which is not possible since `Tenant` will never be linked to the public. Is it true, then, that only the owner of the `Tenant` resource can mint an NFT? No. Let's see how we can solve this so that anyone who wants to mint an NFT can without requiring a `Tenant` reference.

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
        access(contract) fun updateTotalSupply()
    }

    // Required from RegistryInterface
    pub resource Tenant: ITenantMinter {
        pub(set) var totalSupply: UInt64

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

In this example, we have done something awesome. Anyone who has an `NFTMinter` resource only needs a `Tenant{ITenantMinter}` reference, which will be publically available after the **Tenant** links it to the public. Note this is NOT the same thing as linking the `Tenant` itself to the public. This is why capabilities are so cool: we expose `Tenant{ITenantMinter}` to the public so anyone with an `NFTMinter` resource can borrow it and use it to mint NFTs.

## Nested Resources & How to Handle Them

Another problem we encounter is the idea of "nested resources." Yesterday, I told you that the `Tenant` resource has two things in it:
1) any data that would normally be stored in the contract (ex. `totalSupply`)
2) anything that would be stored to account storage in the contract's `init` function (ex. an `NFTMinter` resource)

Let's focus on #2. If we normally store an NFTMinter resource in account storage, we now have to store this in the Tenant itself. This is because, as we've learned, the `Tenant` resource acts as the initial contract state every time it's created and returned to the caller by the `instance` function. But how do we deal with nested resources? Let's take a look:

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
        access(contract) fun updateTotalSupply()
    }

    // Required from RegistryInterface
    pub resource Tenant: ITenantMinter {
        pub(set) var totalSupply: UInt64

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

As you can see, we store the `NFTMinter` resource inside the `Tenant` resource. It is then helpful to add a function that returns a reference to that resource, since moving nested resources around is very painful in Cadence. This way, we can easily perform things on the `NFTMinter` without moving it around.

# Quests

I have one quest for you today, `W3Q2`.

- `W3Q2` – Composability <3 Access Control

In this quest, we will be using what we learned today to modify our RegistryNFTContract. In its current implementation, you must pass in a reference to a Tenant itself (with no restrictive interfaces) to the `mintNFT` function so it can update the `Tenant` resource's `totalSupply` in the `init` function of the `NFT` resource. I want you to change this. Try and figure out a way (very similar to above) where we can define an interface that exposes a function to update `totalSupply` so we can restrict the reference we pass into `mintNFT` a little more. Once you do this, make sure you update the transactions involved in this process of minting/linking the `Tenant` resource to the public to include this resource interface.

Please submit your updated contract/transaction code.

Note: This quest will not take long. This is because I want you to start thinking of your *own* examples of Composable contracts that might be useful. Start asking yourself questions like:  
1) Are there repetitive contracts out there that could become composable so every Tenant could own their own data without having to deploy a whole new contract (like our simple NFT contract)? 
2) What ideas might I have that would suit this composability model well? It could be an NFT that represents a Cake, a FungibleToken that represents cookies.... I'm hungry.

Good luck on your journey. See you next time Composability adventurers ~