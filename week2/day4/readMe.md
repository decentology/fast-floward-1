# This is not officially out yet.

# Fast Floward | Week 2 | Day 4

Heyooo. Jacob here. 

Let's get right into it.

# Videos

- [DappLib, Transactions, and Scripts](https://www.youtube.com/watch?v=zFtc4QLrxas)

# Client/UI Harness

In this section, we'll learn how to set up our UI Harness and how it connects to our DappLib. You can find the UI Harness in `package/client/src/harness/fast_floward-harness`. Let's also bring back the diagram we've been using this week to understand the DappStarter architecture:

![DappStarter Overview](images/dappstarter_overview.PNG)

You'll see that the UI Harness calls the Javascript functions that we set up in our DappLib. Let's find out how.

## Setting Up an Action Card

`fast_floward-harness.js` has a bunch of Javascript in it that we don't need to worry about. Our main focus is going to be on the **action cards** and how to set them up. Let's look at an example of an action card in our UI Harness and also what it looks like in the code:

![Picture from UI Harness](images/)
![Picture from UI Harness Code](images/)

An **action card** element has 5 HTML attributes: 
1) title - this is the text on the top of your action card and represents the title of it
2) description - this is the text on the bottom of your action cared that provides a simple description of what it does
3) action - this is the name of the Javascript function in your DappLib that this action card will call
4) method - either "post" (for transactions) or "get" (for scripts)
5) fields - all of the fields we will pass into our Javascript function in our DappLib. Each field will be mapped to a **widget**, which I will explain in the next section.

### Widgets

Widgets are used to pass in fields to our DappLib. For example, in the action card in the picture above, you'll see it had 3 fields: a signer, an amount, and a recipient. 

**Widgets** are most-often either a **text widget** or an **account widget**. 

#### Account Widgets

Account widgets allow us to select an account. We can use these to select signers, recipients of a transfer, etc.

Here is an example of an account widget:
![Account Widget](/images/account_widget.png)

#### Text Widgets

Text widgets allow us to type in numbers or strings. We can use these to put in an amount, a price for our Kitty Items, a name, etc. 

Here is an example of an account widget:
![Text Widget](/images/text_widget.png)

# Tests

If you've made it this far, you are so close to conquering DappStarter. Awesome job! 

The tests can be found in `/packages/dapplib/test/fast_floward-tests.js`. In it, you will find some Javascript code for testing, but you can ignore most of it. Your focus will be on writing it() functions to run individual tests. There are a few things to know about setting up a test.

First, you will be calling your DappLib functions just like you do in the UI Harness. Here is an example of a test:

![Test](/images/)

You'll see that we are calling our DappLib functions by doing `DappLib.{nameOfFunction}`. Unlike the UI Harness where we can pass in data through **widgets**, we need to make a `testData` object with the fields defined in it that have hard-coded values for your tests.

You'll notice that if we are calling a DappLib function that sends a transaction, we simple do it by `await DappLib.{nameOfFunction}(testData)`. This is because we don't care about the return value of the call. Howevever, if we call a DappLib function that executes a script, we most likely care about the return value. We can store it like so: `let res = await DappLib.{nameOfFunction}()`. 

Afterwards, you can check your script return values with Javascript's `assert`. The actual value of the script can be achieved by `res.result`, and you can compare it to whatever value you expect it to return.

## Setting Up a Test

# Quests

I have two quests for you today, `W2Q5`. You will **ONLY** be modifying `transactions/kittyitems/mint_kitty_item.cdc`, `transactions/kittyitems/transfer_kitty_item.cdc`, `scripts/kittyitems/read_collection_ids.cdc`, and `src/dapp-lib.js`. Please make sure to watch the videos above before tackling these quests.

- `W2Q5` – The Mighty DappLib



Good luck on your quests. See you next time DappStarter adventurers ~



