import { Act } from '../types/react'

import { suppressErrorOutput } from './console'

import { isPromise } from './promises'

function createActWrapper(baseAct: Act) {
  const act: Act = async (callback: () => unknown) => {
    const restoreOutput = suppressErrorOutput()
    try {
      let awaitRequired = false
      const actResult = baseAct(() => {
        const callbackResult = callback()
        awaitRequired = isPromise(callbackResult)
        return callbackResult as Promise<void>
      })
      return awaitRequired ? await actResult : undefined
    } finally {
      restoreOutput()
    }
  }

  return act
}

export { createActWrapper }
