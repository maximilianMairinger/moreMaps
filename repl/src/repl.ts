// import moreMaps from "../../app/src/moreMaps"
// //const testElem = document.querySelector("#test")

// moreMaps()


import keyIndex from "key-index"
import { MultiMap } from "../../app/src/moreMaps"


const lel = new MultiMap()



lel.add("a", "1")
lel.add("b", "1")
lel.add("c", "1")
lel.add("a", "2")

console.log(lel.entries())





const ind = keyIndex(() => {
  return Math.random()
})

ind("a")
ind("b")
ind("c")

console.log(ind.entries())

const map = new Map()

map