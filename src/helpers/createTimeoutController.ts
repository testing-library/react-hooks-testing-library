import { jestFakeTimersAreEnabled } from './jestFakeTimersAreEnabled'

function createTimeoutController(timeout: number | false, options: { allowFakeTimers: boolean }) {
  let timeoutId: NodeJS.Timeout
  const timeoutCallbacks: Array<() => void> = []
  let finished = false

  const { allowFakeTimers } = options

  const advanceTime = async (currentMs: number) => {
    if (!timeout || currentMs < timeout) {
      jest.advanceTimersByTime(1)

      await Promise.resolve()

      if (finished) {
        return
      }
      await advanceTime(currentMs + 1)
    }
  }

  const timeoutController = {
    onTimeout(callback: () => void) {
      timeoutCallbacks.push(callback)
    },
    wrap(promise: Promise<void>) {
      return new Promise<void>((resolve, reject) => {
        timeoutController.timedOut = false
        timeoutController.onTimeout(resolve)
        if (timeout) {
          timeoutId = setTimeout(() => {
            timeoutController.timedOut = true
            timeoutCallbacks.forEach((callback) => callback())
            resolve()
          }, timeout)
        }
        if (jestFakeTimersAreEnabled() && allowFakeTimers) {
          advanceTime(0)
        }

        promise
          .then(resolve)
          .catch(reject)
          .finally(() => {
            finished = true
            timeoutController.cancel()
          })
      })
    },
    cancel() {
      finished = true
      clearTimeout(timeoutId)
    },
    timedOut: false
  }

  return timeoutController
}

export { createTimeoutController }
