# Fast Floward | Week 1 | Day 5

Welcome to Day 5, the last day of Fast Floward Week 1! What an incredible spurt we've made over this past week. Starting with simple, interpreted Cadence statements, all the way up to a client implementation of the Artist app that prints actual Non-Fungible Tokens for users. But this is just the start of your journey! Today, we'll add a new feature to the Artist app – trading. In the process, we'll learn about how to combine functionality of two smart contracts, and a new Cadence concept called `interface`. Let's make Day 5 the best yet!

A quick review of Day 4 before we get going.

# Day 4 Review

- Flow Client Library - FCL - is a JavaScript client-side utility designed by Flow.
  - Easily integrate wallets and allow seamless user authentication.
  - Use the `fcl.send` method to interact with the blockchain by sending scripts and transactions.
  - Use `fcl.authz` as a shorthand for current user.
  - FCL automatically converts Cadence types and values into JavaScript equivalents with `fcl.decode`.
- Flow Testnet provides an easy way to test DApp integrations with live user wallets.
  - To view contracts deployed to testnet, use [flow-view-source.com][1].
  - To create and fund testnet accounts, use [flowfaucet][2].

# Videos

- [Placeholder]()

# Office Hours

- [Placeholder]()

# Cadence Interfaces

Day 4 LocalArtist contract contained a new function called `withdraw`, it allows `Picture` withdrawal from `Collection` resources. Creating a public **capability** with such a function would be terrible – everyone could withdraw pictures from your collection. Thankfully, capabilities have this wonderful feature where you can choose how much of a type's functionality you want to expose.

When you create a capability by calling `link` you provide the capability type.

```cadence
account.link<&LocalArtist.Collection>(
  /public/LocalArtistCollection,
  target: /storage/LocalArtistCollection
)
```

That's good enough if we have no functions associated with that type that are dangerous. But after we added `withdraw`, we must create our capability differently. Here's how.

First, we create an `interface` that defines a set of fields and functions. Note, this is a `resource` interface, but you can also have structure and contract interfaces. Then we modify our resource to note that it *implements* the `PictureReceiver` interface. Of course, we must also implement the fields and functions required by the interface.

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

With this setup, we can proceed to use `PictureReceiver` when creating our public capabilities.

```cadence
account.link<&{LocalArtist.PictureReceiver}>(
  /public/LocalArtistPictureReceiver,
  target: /storage/LocalArtistPictureCollection
)
```

Now, whenever anyone interacts with the resource at `/public/LocalArtistPictureReceiver`, it will only provide access to `deposit()` and `getCanvases()`. And this way, we can stay secure in knowing that only the owner of this account has the ability to withdraw Pictures from their collection.

To learn more about [capability based access control][3] and [interfaces][4], please visit the official docs.

# Trading Pictures

We're ready to take our LocalArtist app to the next level by implementing Picture trading! The `day5` folder contains updated code for the user interface as well as a new contract – `LocalArtistMarket`. That's right, we're now interacting with more than one smart contract. In fact, by time we're done with the quest, we will have interacted with 3 smart contracts. That's awesome!

I'll do a quick walkthrough of the project, and I decided to do it on video, so please make sure to watch the YouTube video for FastFloward Day 5. I'll meet you there!

# Quests

This is it – once you're done with this final quest, you're officially a decentralized app developer, congratulations! So, what's the quest? Well, you'll have to implement a couple of transactions to finalize Picture trading functionality. Here goes...

- `W1Q9` – Buy Low, Sell High

Modify `/src/context/Flow.jsx` by implementing these methods.

```
withdrawListing // call LocalMarketArtist.withdraw()
buy // call LocalMarketArtist.buy()
```

And with that, you've got yourself an online NFT marketplace!

It's been a absolute privilege to guide you on your journey to becoming a decentralized app developer. Week 2 and 3 are coming up, and Jacob along with Nik and the rest of the team at Decentology have incredible content waiting for you. So strap in for the rest of the ride, the fun has just begun!

[1]: https://flow-view-source.com/testnet/account/0xda65073324040264
[2]: https://testnet-faucet.onflow.org/
[3]: https://docs.onflow.org/cadence/language/capability-based-access-control/
[4]: https://docs.onflow.org/cadence/language/interfaces/