import LocalArtist from "../LocalArtist/contract.cdc"
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868

pub contract LocalArtistMarket {
  
  pub event ItemPosted(seller: Address, pixels: String)
  pub event ItemWithdrawn(seller: Address, pixels: String)
  pub event ItemSold(seller: Address, pixels: String, buyer: Address)

  pub struct Record {

    pub let canvas: LocalArtist.Canvas
    pub let seller: Address
    pub let buyer: Address
    pub let price: UFix64

    init(canvas: LocalArtist.Canvas, seller: Address, buyer: Address, price: UFix64) {
      self.canvas = canvas
      self.seller = seller
      self.buyer = buyer
      self.price = price
    }
  }

  pub struct Listing {

    pub let canvas: LocalArtist.Canvas
    pub let seller: Address
    pub let price: UFix64

    init(canvas: LocalArtist.Canvas, seller: Address, price: UFix64) {
      self.canvas = canvas
      self.seller = seller
      self.price = price
    }
  }

  pub resource interface MarketInterface {
    pub fun getListings(): [Listing]
    pub fun sell(picture: @LocalArtist.Picture, seller: Address, price: UFix64)
    pub fun withdraw(listingIndex: Int, to seller: Address) 
    pub fun buy(listing listingIndex: Int, with tokenVault: @FungibleToken.Vault, buyer: Address)
  }

  pub resource Market: MarketInterface {

    pub let pictures: @{String: LocalArtist.Picture}
    pub let listings: [Listing]

    init() {
      self.pictures <- {}
      self.listings = []
    }
    destroy() {
      destroy self.pictures
    }

    pub fun getListings(): [Listing] {
      return self.listings
    }

    pub fun sell(picture: @LocalArtist.Picture, seller: Address, price: UFix64) {
      let canvas = picture.canvas
      self.pictures[canvas.pixels] <-! picture
      let listing = Listing(
        canvas: canvas,
        seller: seller,
        price: price
      )
      self.listings.append(listing)

      emit ItemPosted(seller: seller, pixels: canvas.pixels)
    }
    pub fun withdraw(listingIndex: Int, to seller: Address) {
      let listing = self.listings[listingIndex]
      if listing.seller == seller {
        self.listings.remove(at: listingIndex)
        let picture <- self.pictures.remove(key: listing.canvas.pixels)!

        emit ItemWithdrawn(seller: seller, pixels: listing.canvas.pixels)

        let sellerCollection = getAccount(seller)
          .getCapability(/public/LocalArtistPictureReceiver)
          .borrow<&{LocalArtist.PictureReceiver}>()
          ?? panic("Couldn't borrow seller Picture Collection.")
        
        sellerCollection.deposit(picture: <- picture)
      }
    }
    pub fun buy(listing listingIndex: Int, with tokenVault: @FungibleToken.Vault, buyer: Address) {
      pre {
        self.listings[listingIndex] != nil
        : "Listing no longer exists."
        tokenVault.balance >= self.listings[listingIndex].price
        : "Not enough FLOW to complete purchase."
      }

      let listing = self.listings.remove(at: listingIndex)

      let sellerVault = getAccount(listing.seller)
        .getCapability(/public/flowTokenReceiver)
        .borrow<&FlowToken.Vault{FungibleToken.Receiver}>()
        ?? panic("Couldn't borrow seller vault.")

      let buyerCollection = getAccount(buyer)
        .getCapability(/public/LocalArtistPictureReceiver)
        .borrow<&{LocalArtist.PictureReceiver}>()
        ?? panic("Couldn't borrow buyer Picture Collection.")

      emit ItemSold(seller: listing.seller, pixels: listing.canvas.pixels, buyer: buyer)

      sellerVault.deposit(from: <- tokenVault)
      buyerCollection.deposit(picture: <- self.pictures.remove(key: listing.canvas.pixels)!)
    }
  }

  

  init() {
    self.account.save(
      <- create Market(),
      to: /storage/LocalArtistMarket
    )
    self.account.link<&{MarketInterface}>(
      /public/LocalArtistMarket,
      target: /storage/LocalArtistMarket
    )
  }
}