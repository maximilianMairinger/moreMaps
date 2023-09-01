import keyIndex from "key-index"
import { iterate } from "iterare"
import { LengthLinkedList } from "fast-linked-list"


let reverse: any = undefined
export class BidirectionalMap<K = any, V = any> extends Map<K, V> {
  public reverse: BidirectionalMap<V, K>
  constructor(entries?: readonly (readonly [K, V])[] | Iterable<readonly [K, V]>) {
    super()
    
    if (reverse !== undefined) this.reverse = reverse
    else {
      reverse = this
      this.reverse = new BidirectionalMap()
      reverse = undefined
    }
    if (entries !== undefined) for (const [key, value] of entries) this.set(key, value)
  }

  set(k: K, v: V) {
    Map.prototype.set.call(this.reverse, v, k)
    return super.set(k, v)
  }
  delete(k: K) {
    Map.prototype.delete.call(this.reverse, this.get(k))
    return super.delete(k)
  }
}





export class MultiMap<K = any, V = any> {
  private index = keyIndex<K, V[]>(() => [])

  constructor(entries?: readonly (readonly [K, V[]])[] | Iterable<readonly [K, V[]]>) {
    if (entries) {
      for (const [key, val] of entries) {
        this.index(key).push(...val)
      }
    }
  }
  add(key: K, val: V) {
    this.index(key).push(val)
  }
  getAll(key: K) {
    return this.index(key)
  }
  get(key: K, atIndex: number = 0) {
    return this.getAll(key)[atIndex]
  }

  delete(key: K, val?: V) {
    if (val) {
      const all = this.getAll(key)
      const i = all.indexOf(val)
      if (i === -1) return false
      all.splice(i, 1)
      return true
    } else {
      return this.index.delete(key)
    }
  }

  keys() {
    return this.index.keys()
  }

  values() {
    return iterate(this.index.entries()).map(([key, vals]) => vals).flatten()
  }

  clear() {
    this.index.clear()
  }

  get size() {
    return this.index.size
  }

  // accumulated size over all keys and their values
  get accSize() {
    let len = 0
    for (let [key, val] of this) {
      len += val.length
    }
    return len
  }
  
  has(key: K) {
    return !!this.getAll(key)
  }
  forEach(cb: (key: K, vals: V[]) => void) {
    for (let e of this) {
      cb(...e)
    }
  }
  [Symbol.iterator](): IterableIterator<[key: K, vals: V[]]> {
    return this.index[Symbol.iterator]()
  }
  entries() {
    return this.index.entries()
  }
}




export class BidirectionalMultiMap<K = any, V = any> extends MultiMap<K, V> {
  public reverse: BidirectionalMultiMap<V, K>
  
  constructor(entries?: readonly (readonly [K, V[]])[] | Iterable<readonly [K, V[]]>) {
    super()
    if (reverse !== undefined) this.reverse = reverse
    else {
      reverse = this
      this.reverse = new BidirectionalMultiMap()
      reverse = undefined
    }
    if (entries !== undefined) for (const [key, values] of entries) for (const value of values) this.add(key, value)
  }

  add(key: K, val: V) {
    MultiMap.prototype.add.call(this.reverse, val, key)
    return super.add(key, val)
  }

  delete(key: K, val?: V) {
    if (val) {
      MultiMap.prototype.delete.call(this.reverse, val, key)
      return super.delete(key, val)
    } else {
      for (const val of this.getAll(key)) MultiMap.prototype.delete.call(this.reverse, val, key)
      return super.delete(key)
    }
  }

}

export class Borrow<T> {
  private freeElems = new LengthLinkedList<T>()
  private takenElems = new LengthLinkedList<T>()
  get length() {
    return this.takenElems.length
  }
  constructor(private makeElem: () => T) {}

  borrow() {
    if (this.freeElems.first === undefined) {
      this.freeElems.push(this.makeElem())
    }
    const token = this.freeElems.popToken()
    this.takenElems.pushToken(token)
    return { elem: token.value, done: () => {
      this.freeElems.pushToken(token)
    }};
  }
}

export class BorrowMap<T> {
  private map = new Map<string, Borrow<T>>()
  constructor(private makeElem?: (key: string) => T) {

  }
  borrow(key: string, makeElem?: () => T) {
    if (!this.map.has(key)) {
      this.map.set(key, new Borrow(makeElem !== undefined ? makeElem : this.makeElem !== undefined ? () => this.makeElem(key) : () => { throw new Error("No makeElem function provided") }))
    }
    return this.map.get(key).borrow()
  }
}