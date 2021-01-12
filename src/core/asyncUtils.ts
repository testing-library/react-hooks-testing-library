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
  const wait = async (callback: () => boolean | void, { interval, timeout }: WaitOptions) => {
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

    let timedOut = false

    if (!checkResult()) {
      if (timeout) {
        const timeoutPromise = () =>
          callAfter(() => {
            timedOut = true
          }, timeout)

        await act(() => Promise.race([waitForResult(), timeoutPromise()]))
      } else {
        await act(waitForResult)
      }
    }

    return !timedOut
  }

  const waitFor = async (
    callback: () => boolean | void,
    { interval = DEFAULT_INTERVAL, timeout = DEFAULT_TIMEOUT }: WaitForOptions = {}
  ) => {
    const safeCallback = () => {
      try {
        return callback()
      } catch (error: unknown) {
        return false
      }
    }

    const result = await wait(safeCallback, { interval, timeout })
    if (!result && timeout) {
      throw new TimeoutError(waitFor, timeout)
    }
  }

  const waitForValueToChange = async (
    selector: () => unknown,
    { interval = DEFAULT_INTERVAL, timeout = DEFAULT_TIMEOUT }: WaitForValueToChangeOptions = {}
  ) => {
    const initialValue = selector()

    const result = await wait(() => selector() !== initialValue, { interval, timeout })
    if (!result && timeout) {
      throw new TimeoutError(waitForValueToChange, timeout)
    }
  }

  const waitForNextUpdate = async ({
    timeout = DEFAULT_TIMEOUT
  }: WaitForNextUpdateOptions = {}) => {
    let updated = false
    addResolver(() => {
      updated = true
    })

    const result = await wait(() => updated, { interval: false, timeout })
    if (!result && timeout) {
      throw new TimeoutError(waitForNextUpdate, timeout)
    }
  }

  return {
    waitFor,
    waitForValueToChange,
    waitForNextUpdate
  }
}

export { asyncUtils }
