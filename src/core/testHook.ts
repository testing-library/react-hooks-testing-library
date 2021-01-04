import { isPromise } from '../helpers/promises'

import { TestHookProps } from '../types'

export default function TestHook<TProps, TResult>({
  hookProps,
  callback,
  setError,
  setValue
}: TestHookProps<TProps, TResult>) {
  try {
    // coerce undefined into TProps, so it maintains the previous behaviour
    setValue(callback(hookProps as TProps))
  } catch (err: unknown) {
    if (isPromise(err)) {
      throw err
    } else {
      setError(err as Error)
    }
  }
  return null
}
