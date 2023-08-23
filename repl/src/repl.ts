// import moreMaps from "../../app/src/moreMaps"
// //const testElem = document.querySelector("#test")

// moreMaps()


import { MultiMap, BidirectionalMap, BidirectionalMultiMap } from "../../app/src/moreMaps"

(() => {
  const map = new MultiMap<string, number>()

  map.add("one", 1)
  map.add("one", 2)
  map.add("one", 3)
  map.add("two", 4)
  
  console.log(map.getAll("one")) // [1, 2, 3]
  console.log(map.get("one")) // 1
  console.log(map.get("two")) // 4
  
  map.delete("one", 2)
  console.log(map.getAll("one")) // [1, 3]
  
  map.delete("one")
  console.log(map.getAll("one")) // [1, 3]
  console.log(map.get("one")) // [1, 3]
  
})();

console.log("-------");

(() => {
  const map = new BidirectionalMap<string, number>()

  map.set("one", 1)
  map.set("two", 2)
  
  console.log(map.get("one")) // 1
  console.log(map.reverse.get(2)) // "two"
  
  console.log(map.reverse.reverse === map) // true
})();


console.log("-------");

(() => {
  const map = new BidirectionalMultiMap<string, number>()

  map.add("one", 1)
  map.add("one", 2)
  map.add("two", 3)
  map.add("three", 2)

  console.log(map.getAll("one")) // [1, 2]
  console.log(map.reverse.getAll(2)) // ["one", "three"]

  map.delete("one", 2)
  console.log(map.getAll("one")) // [1]
  console.log(map.reverse.getAll(2)) // ["three"]
})();