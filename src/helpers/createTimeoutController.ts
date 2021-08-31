import { WaitOptions } from '../types'

function createTimeoutController(timeout: WaitOptions['timeout']) {
  let timeoutId: NodeJS.Timeout
  const timeoutCallbacks: Array<() => void> = []

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

        promise
          .then(resolve)
          .catch(reject)
          .finally(() => timeoutController.cancel())
      })
    },
    cancel() {
      clearTimeout(timeoutId)
    },
    timedOut: false
  }

  return timeoutController
}

export { createTimeoutController }
