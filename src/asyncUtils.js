import { act } from 'react-test-renderer'

function actForResult(callback) {
  let value
  act(() => {
    value = callback()
  })
  return value
}

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

  const wait = async (callback, options = {}) => {
    const initialTimeout = options.timeout
    while (true) {
      const startTime = Date.now()
      try {
        await waitForNextUpdate(options)
        const callbackResult = actForResult(callback)
        if (callbackResult || callbackResult === undefined) {
          break
        }
      } catch (e) {
        if (e.timeout) {
          throw createTimeoutError('wait', initialTimeout)
        }
      }
      options.timeout -= Date.now() - startTime
    }
  }

  const waitForValueToChange = async (selector, options = {}) => {
    const initialTimeout = options.timeout
    const initialValue = actForResult(selector)
    while (true) {
      const startTime = Date.now()
      try {
        await waitForNextUpdate(options)
        if (actForResult(selector) !== initialValue) {
          break
        }
      } catch (e) {
        if (e.timeout) {
          throw createTimeoutError('waitForValueToChange', initialTimeout)
        }
        throw e
      }
      options.timeout -= Date.now() - startTime
    }
  }

  return {
    wait,
    waitForNextUpdate,
    waitForValueToChange
  }
}

export default asyncUtils
