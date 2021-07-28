pub contract Hello {
  pub event IssuedGreeting(greeting: String)

  pub fun sayHi(to name: String): String {
    let greeting = "Hi, ".concat(name)

    emit IssuedGreeting(greeting: greeting)

    return greeting
  }
}