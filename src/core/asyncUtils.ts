import {
  Act,
  WaitOptions,
  WaitForOptions,
  WaitForValueToChangeOptions,
  WaitForNextUpdateOptions,
  AsyncUtils
} from '../types'

import { resolveAfter, callAfter } from '../helpers/promises'
import { TimeoutError } from '../helpers/error'

const DEFAULT_INTERVAL = 50
const DEFAULT_TIMEOUT = 1000

function asyncUtils(act: Act, addResolver: (callback: () => void) => void): AsyncUtils {
  const wait = async (
    callback: () => boolean | void,
    { interval = DEFAULT_INTERVAL, timeout = DEFAULT_TIMEOUT }: WaitOptions = {}
  ) => {
    const checkResult = () => {
      const callbackResult = callback()
      return callbackResult ?? callbackResult === undefined
    }

    const waitForResult = async () => {
      while (true) {
        await Promise.race(
          [
            new Promise<void>((resolve) => addResolver(resolve)),
            interval && resolveAfter(interval)
          ].filter(Boolean)
        )

        if (checkResult()) {
          return
        }
      }
    }

    if (!checkResult()) {
      if (timeout) {
        const timeoutPromise = callAfter(() => {
          throw new TimeoutError(wait, timeout)
        }, timeout)

        await act(() => Promise.race([waitForResult(), timeoutPromise]))
      } else {
        await act(waitForResult)
      }
    }
  }

  const waitFor = async (callback: () => boolean | void, options: WaitForOptions = {}) => {
    const safeCallback = () => {
      try {
        return callback()
      } catch (error: unknown) {
        return false
      }
    }
    try {
      await wait(safeCallback, options)
    } catch (error: unknown) {
      if (error instanceof TimeoutError) {
        throw new TimeoutError(waitFor, error.timeout)
      }
      throw error
    }
  }

  const waitForValueToChange = async (
    selector: () => unknown,
    options: WaitForValueToChangeOptions = {}
  ) => {
    const initialValue = selector()
    try {
      await wait(() => selector() !== initialValue, options)
    } catch (error: unknown) {
      if (error instanceof TimeoutError) {
        throw new TimeoutError(waitForValueToChange, error.timeout)
      }
      throw error
    }
  }

  const waitForNextUpdate = async (options: WaitForNextUpdateOptions = {}) => {
    let updated = false
    addResolver(() => {
      updated = true
    })

    try {
      await wait(() => updated, {
        interval: false,
        ...options
      })
    } catch (error: unknown) {
      if (error instanceof TimeoutError) {
        throw new TimeoutError(waitForNextUpdate, error.timeout)
      }
      throw error
    }
  }

  return {
    waitFor,
    waitForValueToChange,
    waitForNextUpdate
  }
}

export { asyncUtils }
