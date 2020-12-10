import { act } from 'react-test-renderer'

export interface WaitOptions {
  interval?: number
  timeout?: number
  suppressErrors?: boolean
}

class TimeoutError extends Error {
  timeout = true
}

function createTimeoutError(utilName: string, { timeout }: Pick<WaitOptions, 'timeout'>) {
  //eslint-disable-next-line
  const timeoutError = new TimeoutError(`Timed out in ${utilName} after ${timeout}ms.`)
  return timeoutError
}

function resolveAfter(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

// eslint-disable-next-line
function asyncUtils(addResolver: any) {
  let nextUpdatePromise: Promise<void | undefined> | null = null

  const waitForNextUpdate = async (options: Pick<WaitOptions, 'timeout'> = {}) => {
    if (!nextUpdatePromise) {
      nextUpdatePromise = new Promise((resolve, reject) => {
        let timeoutId: number
        if (options.timeout && options.timeout > 0) {
          timeoutId = window.setTimeout(
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
      // eslint-disable-next-line
      await act(() => nextUpdatePromise!)
    }
    await nextUpdatePromise
  }

  const waitFor = async (
    callback: () => boolean | void | undefined,
    { interval, timeout, suppressErrors = true }: WaitOptions = {}
  ) => {
    // eslint-disable-next-line consistent-return
    const checkResult = () => {
      try {
        const callbackResult = callback()
        return callbackResult ?? callbackResult === undefined
      } catch (e) {
        if (!suppressErrors) {
          throw e
        }
      }
    }

    const waitForResult = async () => {
      const initialTimeout = timeout
      // eslint-disable-next-line
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
        if (timeout) timeout -= Date.now() - startTime
      }
    }

    if (!checkResult()) {
      await waitForResult()
    }
  }

  const waitForValueToChange = async (selector: () => unknown, options = {}) => {
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

  return {
    waitFor,
    waitForNextUpdate,
    waitForValueToChange
  }
}

export default asyncUtils
