import { act } from 'react-test-renderer'

function createTimeoutError(utilName, { timeout }) {
  const timeoutError = new Error(`Timed out in ${utilName} after ${timeout}ms.`)
  timeoutError.timeout = true
  return timeoutError
}

function resolveAfter(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

let hasWarnedDeprecatedWait = false

function asyncUtils(addResolver) {
  let nextUpdatePromise = null

  const waitForNextUpdate = async (options = {}) => {
    if (!nextUpdatePromise) {
      nextUpdatePromise = new Promise((resolve, reject) => {
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
      })
      await act(() => nextUpdatePromise)
    }
    await nextUpdatePromise
  }

  const waitFor = async (callback, { interval, timeout, suppressErrors = true } = {}) => {
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
          const nextCheck = interval
            ? Promise.race([waitForNextUpdate({ timeout }), resolveAfter(interval)])
            : waitForNextUpdate({ timeout })

          await nextCheck

          if (checkResult()) {
            return
          }
        } catch (e) {
          if (e.timeout) {
            throw createTimeoutError('waitFor', { timeout: initialTimeout })
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
      await waitFor(() => selector() !== initialValue, {
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

  const wait = async (callback, { timeout, suppressErrors } = {}) => {
    if (!hasWarnedDeprecatedWait) {
      hasWarnedDeprecatedWait = true
      console.warn(
        '`wait` has been deprecated. Use `waitFor` instead: https://react-hooks-testing-library.com/reference/api#waitfor.'
      )
    }
    try {
      await waitFor(callback, { timeout, suppressErrors })
    } catch (e) {
      if (e.timeout) {
        throw createTimeoutError('wait', { timeout })
      }
      throw e
    }
  }

  return {
    wait,
    waitFor,
    waitForNextUpdate,
    waitForValueToChange
  }
}

export default asyncUtils
