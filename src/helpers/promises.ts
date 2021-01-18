function resolveAfter(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

async function callAfter(callback: () => void, ms: number) {
  await resolveAfter(ms)
  callback()
}

export { resolveAfter, callAfter }
