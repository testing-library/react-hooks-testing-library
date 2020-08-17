import flushMicroTasks from './flush-microtasks'

let internalCleanupCbs = []
let cleanupCbs = []

async function cleanup() {
  await flushMicroTasks()
  internalCleanupCbs.forEach((cb) => cb())
  internalCleanupCbs = []
  cleanupCbs.forEach((cb) => cb())
}

function addInternalCleanup(callback) {
  internalCleanupCbs.push(callback)
}

function addCleanup(callback) {
  cleanupCbs.push(callback)
}

function removeInternalCleanup(callback) {
  internalCleanupCbs = internalCleanupCbs.filter((cb) => cb !== callback)
}

export { cleanup, addCleanup, addInternalCleanup, removeInternalCleanup }
