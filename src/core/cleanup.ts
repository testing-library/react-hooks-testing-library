import { CleanupCallback } from '../types'

let cleanupCallbacks: Array<CleanupCallback> = []

async function cleanup() {
  for (const callback of cleanupCallbacks) {
    await callback()
  }
  cleanupCallbacks = []
}

function addCleanup(callback: CleanupCallback) {
  cleanupCallbacks = [callback, ...cleanupCallbacks]
  return () => removeCleanup(callback)
}

function removeCleanup(callback: CleanupCallback) {
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
