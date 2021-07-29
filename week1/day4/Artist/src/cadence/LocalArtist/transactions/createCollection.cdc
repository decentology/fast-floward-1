import LocalArtist from "../contract.cdc"

transaction() {
  prepare(account: AuthAccount) {
    account.save<@LocalArtist.Collection>(
      <- LocalArtist.createCollection(),
      to: /storage/LocalArtistPictureCollection
    )
    account.link<&{LocalArtist.PictureReceiver}>(
      /public/LocalArtistPictureReceiver,
      target: /storage/LocalArtistPictureCollection
    )
  }
}