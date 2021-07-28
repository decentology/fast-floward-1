pub contract Artist {

  pub event PicturePrintSuccess(pixels: String)
  pub event PicturePrintFailure(pixels: String)

  pub resource Collection {
    pub let pictures: @[Picture]

    pub fun deposit(picture: @Picture) {
      self.pictures.append(<- picture)
    }

    init() {
      self.pictures <- []
    }

    destroy() {
      destroy self.pictures
    }
  }
}