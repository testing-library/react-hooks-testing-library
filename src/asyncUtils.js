import { act } from 'react-test-renderer'

function createTimeoutError(utilName, { timeout }) {
  const timeoutError = new Error(`Timed out in ${utilName} after ${timeout}ms.`)
  timeoutError.timeout = true
  return timeoutError
}

function asyncUtils(addResolver) {
  let nextUpdatePromise = null

  const waitForNextUpdate = async (options = {}) => {
    if (!nextUpdatePromise) {
      const resolveOnNextUpdate = (resolve, reject) => {
        let timeoutId
        if (options.timeout > 0) {
          timeoutId = setTimeout(
            () => reject(createTimeoutError('waitForNextUpdate', options)),
            options.timeout
          )
        }
        addResolver(() => {
          clearTimeout(timeoutId)
          nextUpdatePromise = null
          resolve()
        })
      }

      nextUpdatePromise = new Promise(resolveOnNextUpdate)
      await act(() => nextUpdatePromise)
    }
    return await nextUpdatePromise
  }

  const wait = async (callback, { timeout, suppressErrors = true } = {}) => {
    const checkResult = () => {
      try {
        const callbackResult = callback()
        return callbackResult || callbackResult === undefined
      } catch (e) {
        if (!suppressErrors) {
          throw e
        }
      }
    }

    const waitForResult = async () => {
      const initialTimeout = timeout
      while (true) {
        const startTime = Date.now()
        try {
          await waitForNextUpdate({ timeout })
          if (checkResult()) {
            return
          }
        } catch (e) {
          if (e.timeout) {
            throw createTimeoutError('wait', { timeout: initialTimeout })
          }
          throw e
        }
        timeout -= Date.now() - startTime
      }
    }

    if (!checkResult()) {
      await waitForResult()
    }
  }

  const waitForValueToChange = async (selector, options = {}) => {
    const initialValue = selector()
    try {
      await wait(() => selector() !== initialValue, {
        suppressErrors: false,
        ...options
      })
    } catch (e) {
      if (e.timeout) {
        throw createTimeoutError('waitForValueToChange', options)
      }
      throw e
    }
  }

  return {
    wait,
    waitForNextUpdate,
    waitForValueToChange
  }
}

export default asyncUtils
