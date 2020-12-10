import flushMicroTasks from './flushMicrotasks'

let cleanupCallbacks = []

async function cleanup() {
  await flushMicroTasks()
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

cleanup.autoRegister = () => {
  // Automatically registers cleanup in supported testing frameworks
  if (typeof afterEach === 'function' && !process.env.RHTL_SKIP_AUTO_CLEANUP) {
    afterEach(async () => {
      await cleanup()
    })
  }
}

export { cleanup, addCleanup, removeCleanup }
