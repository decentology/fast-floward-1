import LocalArtist from "../contract.cdc"

pub fun main(address: Address): [LocalArtist.Canvas] {
  let account = getAccount(address)
  let pictureReceiverRef = account
    .getCapability<&{LocalArtist.PictureReceiver}>(/public/LocalArtistPictureReceiver)
    .borrow()
    ?? panic("Couldn't borrow Picture Receiver reference.")

  return pictureReceiverRef.getCanvases()
}