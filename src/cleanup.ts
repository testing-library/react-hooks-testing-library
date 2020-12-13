let cleanupCallbacks: (() => Promise<void> | void)[] = []

async function cleanup() {
  for (const callback of cleanupCallbacks) {
    await callback()
  }
  cleanupCallbacks = []
}

function addCleanup(callback: () => Promise<void> | void) {
  cleanupCallbacks = [callback, ...cleanupCallbacks]
  return () => removeCleanup(callback)
}

function removeCleanup(callback: () => Promise<void> | void) {
  cleanupCallbacks = cleanupCallbacks.filter((cb) => cb !== callback)
}

export { cleanup, addCleanup, removeCleanup }
