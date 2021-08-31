import {
  Act,
  WaitOptions,
  WaitForOptions,
  WaitForValueToChangeOptions,
  WaitForNextUpdateOptions,
  AsyncUtils
} from '../types'

import { createTimeoutController } from '../helpers/createTimeoutController'
import { TimeoutError } from '../helpers/error'

const DEFAULT_INTERVAL = 50
const DEFAULT_TIMEOUT = 1000

function asyncUtils(act: Act, addResolver: (callback: () => void) => void): AsyncUtils {
  const wait = async (callback: () => boolean | void, { interval, timeout }: WaitOptions) => {
    const checkResult = () => {
      const callbackResult = callback()
      return callbackResult ?? callbackResult === undefined
    }

    const timeoutSignal = createTimeoutController(timeout)

    const waitForResult = async () => {
      while (true) {
        const intervalSignal = createTimeoutController(interval)
        timeoutSignal.onTimeout(() => intervalSignal.cancel())

        await intervalSignal.wrap(new Promise<void>(addResolver))

        if (checkResult() || timeoutSignal.timedOut) {
          return
        }
      }
    }

    if (!checkResult()) {
      await act(() => timeoutSignal.wrap(waitForResult()))
    }

    return !timeoutSignal.timedOut
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
