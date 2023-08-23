# More Maps

A collection of additional map-like data structures. Including a bidirectional map, a multi map, and a bidirectional multi map.

## Installation

```shell
 $ npm i more-maps
```

## Usage

### BidirectionalMap

A map that allows bidirectional lookup between keys and values. It extends the built-in `Map` class.

```ts
import { BidirectionalMap } from "more-maps"

const map = new BidirectionalMap<string, number>()

map.set("one", 1)
map.set("two", 2)

console.log(map.get("one")) // 1
console.log(map.reverse.get(2)) // "two"

console.log(map.reverse.reverse === map) // true
```

Be aware that if you set the same value twice to a different key, the second key will overwrite the first one in the reverse map. So make sure they do not conflict. If you want to avoid this, use the BidirectionalMultiMap.


### MultiMap

A map that allows multiple values per key. It stores the values in an array. It provides methods to add, retrieve, and delete values. 

```ts
import { MultiMap } from "more-maps"

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
console.log(map.getAll("one")) // []
console.log(map.get("one")) // undefined
```

### BidirectionalMultiMap

A bidirectional version of the MultiMap. It allows bidirectional lookup between keys and values, and also supports adding and deleting values.

```ts
import { BidirectionalMultiMap } from "more-maps"

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
```

## Contribute

All feedback is appreciated. Create a pull request or write an issue.