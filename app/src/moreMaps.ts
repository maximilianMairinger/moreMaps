import keyIndex from "key-index"


export class BidirectionalMap<K = any, V = any> extends Map<K, V> {
  public reverse: BidirectionalMap<V, K>
  constructor(entries_revereMap?: readonly (readonly [K, V])[] | null | BidirectionalMap<V, K>) {
    if (entries_revereMap instanceof BidirectionalMap) {
      super()
      this.reverse = entries_revereMap
    }
    else {
      super(entries_revereMap)
      this.reverse = new BidirectionalMap(this)
    }
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


export class BidirectionalMultiMap<K = any, V = any> extends MultiMap<K, V> {
  public reverse: BidirectionalMultiMap<V, K>
  constructor(...entries: {key: K, val: V}[])
  constructor(revereMap: BidirectionalMultiMap<V, K>)
  constructor(...entries_revereMap: [BidirectionalMultiMap<V, K> | {key: K, val: V}, ...{key: K, val: V}[]]) {
    if (entries_revereMap[0] instanceof BidirectionalMultiMap) {
      super()
      this.reverse = entries_revereMap[0]
    }
    else {
      super(...entries_revereMap as {key: K, val: V}[])
      this.reverse = new BidirectionalMultiMap(this)
    }
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

