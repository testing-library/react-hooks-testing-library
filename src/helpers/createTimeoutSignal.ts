import { WaitOptions } from '../types'

function createTimeoutSignal(timeout: WaitOptions['timeout']) {
  let timeoutId: NodeJS.Timeout
  const timeoutCallbacks: Array<() => void> = []

  const timeoutSignal = {
    onTimeout(callback: () => void) {
      timeoutCallbacks.push(callback)
    },
    wrap(promise: Promise<void>) {
      return new Promise<void>((resolve, reject) => {
        timeoutSignal.timedOut = false
        timeoutSignal.onTimeout(resolve)

        if (timeout) {
          timeoutId = setTimeout(() => {
            timeoutSignal.timedOut = true
            timeoutCallbacks.forEach((callback) => callback())
            resolve()
          }, timeout)
        }

        promise
          .then(resolve)
          .catch(reject)
          .finally(() => timeoutSignal.cancel())
      })
    },
    cancel() {
      clearTimeout(timeoutId)
    },
    timedOut: false
  }

  return timeoutSignal
}

export { createTimeoutSignal }
