const resolveAfter = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

const isPromise = <T>(value: unknown): boolean =>
  typeof (value as PromiseLike<T>).then === 'function'

export { isPromise, resolveAfter }
