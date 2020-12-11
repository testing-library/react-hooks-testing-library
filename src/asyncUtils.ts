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
  const timeoutError = new TimeoutError(`Timed out in ${utilName} after ${timeout as number}ms.`)
  return timeoutError
}

function resolveAfter(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function asyncUtils(addResolver: (callback: () => void) => void) {
  let nextUpdatePromise: Promise<void> | null = null

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
      await act(() => nextUpdatePromise as Promise<void>)
    }
    await nextUpdatePromise
  }

  // TODO: Discuss with Kent and Maintainers about behavior of returning nothing currently there are tests handling this behavior that may be an anti-pattern.
  // ? Should waitFor() always expect something returned
  const waitFor = async <T>(
    callback: () => T | Promise<T>,
    { interval, timeout, suppressErrors = true }: WaitOptions = {}
  ) => {
    const checkResult = () => {
      try {
        const callbackResult = callback()
        return callbackResult || callbackResult === undefined
      } catch (error: unknown) {
        if (!suppressErrors) {
          throw error as Error
        }
        return undefined
      }
    }

    const waitForResult = async () => {
      const initialTimeout = timeout
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
        } catch (error: unknown) {
          if (error instanceof TimeoutError) {
            throw createTimeoutError('waitFor', { timeout: initialTimeout })
          }
          throw error as Error
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
    } catch (error: unknown) {
      if (error instanceof TimeoutError) {
        throw createTimeoutError('waitForValueToChange', options)
      }
      throw error as Error
    }
  }

  return {
    waitFor,
    waitForNextUpdate,
    waitForValueToChange
  }
}

export default asyncUtils
