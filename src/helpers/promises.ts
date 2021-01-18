function resolveAfter(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

async function callAfter(callback: () => void, ms: number) {
  await resolveAfter(ms)
  callback()
}

function isPromise(value: unknown): boolean {
  return value !== undefined && typeof (value as PromiseLike<unknown>).then === 'function'
}

export { resolveAfter, callAfter, isPromise }
