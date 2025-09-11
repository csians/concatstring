// store/memoryStorage.ts
const memoryStorage = (() => {
  let storage: Record<string, string> = {}

  return {
    getItem: (key: string) => Promise.resolve(storage[key] || null),
    setItem: (key: string, value: string) => {
      storage[key] = value
      return Promise.resolve()
    },
    removeItem: (key: string) => {
      delete storage[key]
      return Promise.resolve()
    },
  }
})()

export default memoryStorage
