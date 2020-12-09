type CleanupCallback = () => Promise<void>

let cleanupCallbacks: CleanupCallback[] = []

async function cleanup() {
  for (const callback of cleanupCallbacks) {
    await callback()
  }
  cleanupCallbacks = []
}

function addCleanup(callback: CleanupCallback) {
  cleanupCallbacks.unshift(callback)
  return () => removeCleanup(callback)
}

function removeCleanup(callback: CleanupCallback) {
  cleanupCallbacks = cleanupCallbacks.filter((cb) => cb !== callback)
}

export { cleanup, addCleanup, removeCleanup }
