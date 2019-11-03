import flushMicroTasks from './flush-microtasks'

let cleanupCallbacks = []

async function cleanup() {
  await flushMicroTasks()
  cleanupCallbacks.forEach((cb) => cb())
  cleanupCallbacks = []
}

function addCleanup(callback) {
  cleanupCallbacks.push(callback)
}

function removeCleanup(callback) {
  cleanupCallbacks = cleanupCallbacks.filter((cb) => cb !== callback)
}

export { cleanup, addCleanup, removeCleanup }
