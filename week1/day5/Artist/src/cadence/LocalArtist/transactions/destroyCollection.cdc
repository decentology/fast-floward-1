import LocalArtist from "../contract.cdc"

transaction() {
  prepare(account: AuthAccount) {
    account.unlink(/public/LocalArtistPictureReceiver)
    let collection <- account.load<@LocalArtist.Collection>(
      from: /storage/LocalArtistPictureCollection
    )
    destroy collection
  }
}