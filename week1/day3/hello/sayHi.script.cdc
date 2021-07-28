import Hello from "./contract.cdc"

pub fun main(name: String): String {
  return Hello.sayHi(to: name)
}