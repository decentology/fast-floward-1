pub contract LocalArtist {

  pub event PrinterCreated()
  pub event PicturePrintSuccess(pixels: String)
  pub event PicturePrintFailure(pixels: String)
  pub event PictureDeposit(pixels: String)
  pub event CollectionCreated()

  // A structure that will store a two dimensional canvas made up of ASCII
  // characters (usually one character to indicate an on pixel, and one for off).
  pub struct Canvas {

    pub let width: Int
    pub let height: Int
    pub let pixels: String

    init(width: Int, height: Int, pixels: String) {
      self.width = width
      self.height = height
      // The following canvas
      // 123
      // 456
      // 789
      // should be serialized as
      // 123456789
      self.pixels = pixels
    }
    
  }

  // A resource that will store a single canvas
  pub resource Picture {

    pub let canvas: Canvas
    
    init(canvas: Canvas) {
      self.canvas = canvas
    }
  }

  pub resource interface PictureReceiver {
    pub fun deposit(picture: @Picture)
    pub fun getCanvases(): [Canvas]
  }

  pub resource Collection: PictureReceiver {
    pub let pictures: @[Picture]

    pub fun deposit(picture: @Picture) {
      let pixels = picture.canvas.pixels
      self.pictures.append(<- picture)
      emit PictureDeposit(pixels: pixels)
    }
    pub fun withdraw(pixels: String): @Picture? {
      var index = 0
      while index < self.pictures.length {
        if self.pictures[index].canvas.pixels == pixels {
          return <- self.pictures.remove(at: index)
        }
        index = index + 1
      }

      return nil
    }
    pub fun getCanvases(): [Canvas] {
      var canvases: [Canvas] = []
      var index = 0
      while index < self.pictures.length {
        canvases.append(
          self.pictures[index].canvas
        )
        index = index + 1
      }

      return canvases;
    }

    init() {
      self.pictures <- []
    }
    destroy() {
      destroy self.pictures
    }
  }

  pub fun createCollection(): @Collection {
    emit CollectionCreated()
    return <- create Collection()
  }

  // Printer ensures that only one picture can be printed for each canvas.
  // It also ensures each canvas is correctly formatted (dimensions and pixels).
  pub resource Printer {
    pub let prints: {String: Canvas}

    init() {
      self.prints = {}
    }

    // possible synonyms for the word "canvas"
    pub fun print(width: Int, height: Int, pixels: String): @Picture? {
      // Canvas can only use visible ASCII characters.
      for symbol in pixels.utf8 {
        if symbol < 32 || symbol > 126 {
          return nil
        }
      }

      // Printer is only allowed to print unique canvases.
      if self.prints.containsKey(pixels) == false {
        let canvas = Canvas(
          width: width,
          height: height,
          pixels: pixels
        )
        let picture <- create Picture(canvas: canvas)
        self.prints[canvas.pixels] = canvas

        emit PicturePrintSuccess(pixels: canvas.pixels)

        return <- picture
      } else {
        emit PicturePrintFailure(pixels: pixels)
        return nil
      }
    }
  }

  init() {
    self.account.save(
      <- create Printer(),
      to: /storage/LocalArtistPicturePrinter
    )
    emit PrinterCreated()
    self.account.link<&Printer>(
      /public/LocalArtistPicturePrinter,
      target: /storage/LocalArtistPicturePrinter
    )

    self.account.save(
      <- self.createCollection(),
      to: /storage/LocalArtistPictureCollection
    )
    self.account.link<&{PictureReceiver}>(
      /public/LocalArtistPictureReceiver,
      target: /storage/LocalArtistPictureCollection
    )
  }
}