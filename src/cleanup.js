import { act } from 'react-test-renderer'

let cleanupCallbacks = []

async function cleanup() {
  await act(async () => {})
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
