# Fast Floward | Week 3 | Day 3

Heyoooooooooooo. Jacob reporting in for another super awesome and fun day of Fast Floward content. Today, we will be using what we've learned about Cadence, DappStarter, and Composability to start making our own composability modules. We will have lengthy discussions in the Discord and Office Hours over the next few days to help you in your implementation. Let's have some fun with this and work through this together to make something great.

# Videos

There are no videos for you to watch today. Instead, we will be having a conversation about developing our own composability modules in office hours.

Office Hours video - https://www.youtube.com/watch?v=vNVr3c7N9RQ

# Developing our Own Composability Modules

The past two days we have discussed Composability and how we (the Decentology team) have been approaching a technical implementation of Composability on Flow. Over the next 3 days, we will be working with 1 Quest to actually make our own Composability modules. 

As a result, there won't be any "new" content today. Instead, we will use a more open-ended quest to stimulate conversation around composability, which should serve as a great learning experience.

Before you read the quest, I want to make it clear that this isn't something to be scared or stressed about. This quest is designed to allow you to explore your own creative ideas and to have some fun making a full dApp on your own. If you need any help along the way, the Discord & Office Hours are there for you. If you struggle along the way or don't have the time to finish before the week is over, *that is completely fine.* All I want to see is that you put in a good amount of effort and that you had some fun with it. This stuff is hard. So let's do our best and that's perfect enough.

# Quests

As introduced earlier, there is 1 remaining quest for you for this bootcamp. As you might expect, it will take some time and will most likely take you more than just a day. 

- `W3Q3` – Developing our Own Composability Module

For this quest, I want you to try and develop your own composability module. I have provided a DappStarter skeleton project for you to begin your quest. You can find that here: https://github.com/decentology/ff-empty-registry-demo. Inside it are both the RegistryService and RegistryInterface along with all the transactions, scripts, DappLib functions and UI Harness that go along with it. Your job is to think of your own composability modules using DappStarter. This is not an easy task, so we are giving you as long as you need to do it. We will not be introducing any quests over the next 3 days of the bootcamp, so you can try and complete it in that amount of time.

To clarify: What I mean by a Composable Module is making some sort of RegistryContract inside your Project/ contract folder. You'll see I already put a blank one there for you with some setup already to help you. Remember from the last two days that an example RegistryContract is the RegistryNFTContract that handles the composability of NFTs. Your job will be coming up with a different idea for composability or choosing from the list below.

Next, I would like you to come up with at least 1 Calling Contract/Composed Contract that uses the Registry Contract. This is the equivalent of the MarketplaceContract in the demo repo you've been working with. Put this Composed Contract inside your Project/ contracts folder. You will then have to write the transactions, scripts, UI Harness, & DappLib functions that interact with your contracts to complete the module.

Here is a list of composability ideas to work from. They range from easy to hard. You do not have to use this list, but it may be helpful if you're having trouble thinking of composability examples.

Example Composability Module | Difficulty | Description

1) **FungibleToken** | *Easy* | Just like the RegistryNFTContract you saw during Week 3 Days 1&2, try and make a RegistryFTContract. Then, define a Composed Contract/Calling Contract that actually uses this RegistryFTContract in your Project/ folder.
2) **NFT Metadata on IPFS** | *Easy-Medium* | Define a RegistryNFTIPFSContract that is very similar to the RegistryNFTContract we've been working with, but there is an added field to the NFT Resource that handles storing metadata in the form of an IPFS hash. You can think of this as an extension of normal NFTs that specifies how metadata is stored. You can make your Calling Contract whatevere you'd like, but an example could be a marketplace, etc.
3) **Multiple Approval/Multi Sig** | *Medium* | Come up with some system where a user defines something that requires multiple signature/approval from pre-defined accounts. Example: I want to make a proposal that needs approval from accounts with address 0x0, 0x1, 0x2, and 0x3. I specify this on the proposal, and then those addresses will have to individually approve my proposal. Once X amount of them (or all of them) have signed, something happens.
4) **Video Game Assets** | *Medium* | Define a standard for video game assets. Think about taking an item you've earned in Mario Kart and transferring that to Legend of Zelga. There needs to be a standard for this resource in order to use your video game assets in multiple games. Implement this video game asset yourself by brainstorming fields your resource may have, how it should be traded back and forth, etc. Your Calling Contract could then act as a secondary marketplace, a trading platform, etc.
5) **Voting** | *Medium-Hard* | Define a RegistryVotingContract that handles Voting on the Flow blockchain. There could be many different versions of this depending how you interpret "voting." It could be a system where there is a proposal initiated by an Admin and each address can only vote once, or it could be a ballot-type voting where users vote on ballots, etc. This is really up to you to decide. Then define your own Calling Contract that uses this Voting in some way.

These are 5 ideas you can work with. There are an infinite amount of ideas you could potentially come up with. I am also being purposefully vague in my descriptions to allow you to be creative in the best way that you can. Remember, this stuff might not make sense at first and will be confusing over the next few days. But let's use this as an opportunity to open a discussion about how you want to approach this quest, I think you'll be able to learn more that way.

Additionally, I have created a channel named #composability-discussion. Let's chat about any comments, questions, or ideas you may have! You can also use this to share ideas with each other to create your composability modules :)

Good luck on your journey. See you next time Composability adventurers ~
