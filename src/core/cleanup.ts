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

function skipAutoCleanup() {
  try {
    return !!process.env.RHTL_SKIP_AUTO_CLEANUP
  } catch {
    // falling back in the case that process.env.RHTL_SKIP_AUTO_CLEANUP cannot be accessed (e.g. browser environment)
    return false
  }
}

function autoRegisterCleanup() {
  // Automatically registers cleanup in supported testing frameworks
  if (typeof afterEach === 'function' && !skipAutoCleanup()) {
    afterEach(async () => {
      await cleanup()
    })
  }
}

export { cleanup, addCleanup, removeCleanup, autoRegisterCleanup }
