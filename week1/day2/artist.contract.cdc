pub contract Artist {
  pub struct Canvas {}
  pub resource Picture {}
  pub resource Printer {}

  // Quest W1Q3
  pub resource Collection {
    pub fun deposit(picture: @Picture)
  }
  pub fun createCollection(): Collection

  init() {}
}