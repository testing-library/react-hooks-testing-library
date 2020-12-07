let cleanupCallbacks = []

async function cleanup() {
  for (const callback of cleanupCallbacks) {
    await callback()
  }
  cleanupCallbacks = []
}

function addCleanup(callback) {
  cleanupCallbacks.unshift(callback)
  return () => removeCleanup(callback)
}

function removeCleanup(callback) {
  cleanupCallbacks = cleanupCallbacks.filter((cb) => cb !== callback)
}

export { cleanup, addCleanup, removeCleanup }
