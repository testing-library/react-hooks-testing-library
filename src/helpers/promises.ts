function resolveAfter(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function isPromise<T>(value: unknown): boolean {
  return typeof (value as PromiseLike<T>).then === 'function'
}

export { isPromise, resolveAfter }
