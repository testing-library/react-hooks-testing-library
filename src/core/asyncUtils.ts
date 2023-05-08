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

// This is so the stack trace the developer sees is one that's
// closer to their code (because async stack traces are hard to follow).
function copyStackTrace(target: Error, source: Error) {
  target.stack = source.stack?.replace(source.message, target.message)
}

function jestFakeTimersAreEnabled() {
  /* istanbul ignore else */
  if (typeof jest !== 'undefined' && jest !== null) {
    return (
      // legacy timers
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
      (setTimeout as any)._isMockFunction === true ||
      // modern timers
      Object.prototype.hasOwnProperty.call(setTimeout, 'clock')
    )
  }
  // istanbul ignore next
  return false
}

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

  /**
   * `waitFor` implementation from `@testing-library/dom` for Jest fake timers
   * @param callback
   * @param param1
   * @returns
   */
  const waitForInJestFakeTimers = (
    callback: () => boolean | void,
    {
      interval,
      stackTraceError,
      timeout
    }: { interval: number; timeout: number; stackTraceError: Error }
  ) => {
    return new Promise(async (resolve, reject) => {
      let lastError: unknown
      let finished = false

      const overallTimeoutTimer = setTimeout(handleTimeout, timeout)

      checkCallback()
      // this is a dangerous rule to disable because it could lead to an
      // infinite loop. However, eslint isn't smart enough to know that we're
      // setting finished inside `onDone` which will be called when we're done
      // waiting or when we've timed out.
      // eslint-disable-next-line no-unmodified-loop-condition
      while (!finished) {
        if (!jestFakeTimersAreEnabled()) {
          const error = new Error(
            `Changed from using fake timers to real timers while using waitFor. This is not allowed and will result in very strange behavior. Please ensure you're awaiting all async things your test is doing before changing to real timers. For more info, please go to https://github.com/testing-library/dom-testing-library/issues/830`
          )
          copyStackTrace(error, stackTraceError)
          reject(error)
          return
        }
        // we *could* (maybe should?) use `advanceTimersToNextTimer` but it's
        // possible that could make this loop go on forever if someone is using
        // third party code that's setting up recursive timers so rapidly that
        // the user's timer's don't get a chance to resolve. So we'll advance
        // by an interval instead. (We have a test for this case).
        jest.advanceTimersByTime(interval)

        // It's really important that checkCallback is run *before* we flush
        // in-flight promises. To be honest, I'm not sure why, and I can't quite
        // think of a way to reproduce the problem in a test, but I spent
        // an entire day banging my head against a wall on this.
        checkCallback()

        if (finished) {
          break
        }

        // In this rare case, we *need* to wait for in-flight promises
        // to resolve before continuing. We don't need to take advantage
        // of parallelization so we're fine.
        // https://stackoverflow.com/a/59243586/971592
        await act(async () => {
          await new Promise((r) => {
            setTimeout(r, 0)
            jest.advanceTimersByTime(0)
          })
        })
      }

      function onDone(error: unknown, result: boolean | void | null) {
        finished = true
        clearTimeout(overallTimeoutTimer)

        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      }

      function checkCallback() {
        try {
          const result = callback()

          onDone(null, result)

          // If `callback` throws, wait for the next mutation, interval, or timeout.
        } catch (error: unknown) {
          // Save the most recent callback error to reject the promise with it in the event of a timeout
          lastError = error
        }
      }

      function handleTimeout() {
        let error
        if (lastError) {
          error = lastError
        } else {
          error = new Error('Timed out in waitFor.')
          copyStackTrace(error, stackTraceError)
        }
        onDone(error, null)
      }
    })
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

    if (typeof interval === 'number' && typeof timeout === 'number' && jestFakeTimersAreEnabled()) {
      // create the error here so its stack trace is as close to the
      // calling code as possible
      const stackTraceError = new Error('STACK_TRACE_MESSAGE')
      return act(async () => {
        await waitForInJestFakeTimers(callback, { interval, stackTraceError, timeout })
      })
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
