function resolveAfter(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

export async function callAfter(callback: () => void, ms: number) {
  await resolveAfter(ms)
  callback()
}

function isPromise<T>(value: unknown): boolean {
  return typeof (value as PromiseLike<T>).then === 'function'
}

export { isPromise, resolveAfter }
