import keyIndex from "key-index"

export class BidirectionalMap<K, V> extends Map<K, V> {
  public reverse: Map<V, K> = new Map

  set(k: K, v: V) {
    this.reverse.set(v, k)
    return super.set(k, v)
  }
  delete(k: K) {
    this.reverse.delete(this.get(k))
    return super.delete(k)
  }
}

export class MultiMap<K, V> {
  private index = keyIndex<K, V[]>(() => [])
  constructor(...index: {key: K, val: V}[]) {
    for (const e of index) {
      this.index(e.key).push(e.val)
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