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

function autoRegisterCleanup() {
  // Automatically registers cleanup in supported testing frameworks
  if (typeof afterEach === 'function' && !process.env.RHTL_SKIP_AUTO_CLEANUP) {
    afterEach(async () => {
      await cleanup()
    })
  }
}

export { cleanup, addCleanup, removeCleanup, autoRegisterCleanup }
