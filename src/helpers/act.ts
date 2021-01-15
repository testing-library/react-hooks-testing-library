/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Act } from '../types/react'

import { suppressErrorOutput } from './console'

function createActWrapper(baseAct: Act) {
  const act: Act = async (callback: () => any) => {
    const restoreOutput = suppressErrorOutput()
    try {
      let awaitRequired = false
      const actResult = (baseAct(() => {
        const callbackResult = callback()
        awaitRequired = callbackResult !== undefined && !!callbackResult.then
        return callbackResult
      }) as any) as PromiseLike<undefined>

      return awaitRequired ? await actResult : undefined
    } finally {
      restoreOutput()
    }
  }

  return act
}

export { createActWrapper }
