import { fakeTimersAreEnabled, advanceTimers } from './fakeTimers'

function createTimeoutController(timeout: number | false, { allowFakeTimers = false } = {}) {
  let timeoutId: NodeJS.Timeout
  const timeoutCallbacks: Array<() => void> = []
  let finished = false

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
            finished = true
            timeoutController.timedOut = true
            timeoutCallbacks.forEach((callback) => callback())
            resolve()
          }, timeout)
        }

        if (fakeTimersAreEnabled() && allowFakeTimers) {
          advanceTimers(() => finished)
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
