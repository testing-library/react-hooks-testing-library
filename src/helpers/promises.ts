function resolveAfter(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

async function callAfter(callback: () => void, ms: number) {
  await resolveAfter(ms)
  callback()
}

function isPromise<T>(value: unknown): boolean {
  return value !== undefined && typeof (value as PromiseLike<T>).then === 'function'
}

export { resolveAfter, callAfter, isPromise }
