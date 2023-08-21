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
  
  has(key: K) {
    return !!this.getAll(key)
  }
  forEach(cb: (key: K, vals: V[]) => void) {
    for (let e of this.index.entries()) {
      // @ts-ignore
      cb(...e)
    }
  }
  *[Symbol.iterator](): IterableIterator<[key: K, vals: V[]]> {
    return this.index.entries()
  }
  entries() {
    return this[Symbol.iterator]()
  }
}