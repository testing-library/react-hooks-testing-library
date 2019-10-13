import { act } from 'react-test-renderer'

function createTimeoutError(utilName, timeout) {
  const timeoutError = new Error(`Timed out in ${utilName} after ${timeout}ms.`)
  timeoutError.timeout = true
  return timeoutError
}

function asyncUtils(addResolver) {
  let nextUpdatePromise = null

  const resolveOnNextUpdate = ({ timeout }) => (resolve, reject) => {
    let timeoutId
    if (timeout > 0) {
      timeoutId = setTimeout(
        () => reject(createTimeoutError('waitForNextUpdate', timeout)),
        timeout
      )
    }
    addResolver(() => {
      clearTimeout(timeoutId)
      nextUpdatePromise = null
      resolve()
    })
  }

  const waitForNextUpdate = async (options = {}) => {
    if (!nextUpdatePromise) {
      nextUpdatePromise = new Promise(resolveOnNextUpdate(options))
      await act(() => nextUpdatePromise)
    }
    return await nextUpdatePromise
  }

  return {
    waitForNextUpdate
  }
}

export default asyncUtils
