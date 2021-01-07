import { CreateRenderer, Renderer, RenderResult, RenderHook } from '../types'
import { ResultContainer, RenderHookOptions } from '../types/internal'

import asyncUtils from './asyncUtils'
import { cleanup, addCleanup, removeCleanup } from './cleanup'

function resultContainer<TValue>(): ResultContainer<TValue> {
  const results: Array<{ value?: TValue; error?: Error }> = []
  const resolvers: Array<() => void> = []

  const result: RenderResult<TValue> = {
    get all() {
      return results.map(({ value, error }) => error ?? value)
    },
    get current() {
      const { value, error } = results[results.length - 1]
      if (error) {
        throw error
      }
      return value as TValue
    },
    get error() {
      const { error } = results[results.length - 1]
      return error
    }
  }

  const updateResult = (value?: TValue, error?: Error) => {
    results.push({ value, error })
    resolvers.splice(0, resolvers.length).forEach((resolve) => resolve())
  }

  return {
    result,
    addResolver: (resolver: () => void) => {
      resolvers.push(resolver)
    },
    setValue: (value: TValue) => updateResult(value),
    setError: (error: Error) => updateResult(undefined, error)
  }
}

const createRenderHook = <TProps, TResult, TOptions extends {}, TRenderer extends Renderer<TProps>>(
  createRenderer: CreateRenderer<TProps, TResult, TOptions, TRenderer>
) => (
  callback: (props: TProps) => TResult,
  options: RenderHookOptions<TProps, TOptions> = {} as RenderHookOptions<TProps, TOptions>
): RenderHook<TProps, TResult, TRenderer> => {
  const { result, setValue, setError, addResolver } = resultContainer<TResult>()
  const renderProps = { callback, setValue, setError }
  let hookProps = options.initialProps

  const { render, rerender, unmount, act, ...renderUtils } = createRenderer(renderProps, options)

  render(hookProps)

  function rerenderHook(newProps = hookProps) {
    hookProps = newProps
    rerender(hookProps)
  }

  function unmountHook() {
    removeCleanup(unmountHook)
    unmount()
  }

  addCleanup(unmountHook)

  return {
    result,
    rerender: rerenderHook,
    unmount: unmountHook,
    ...asyncUtils(act, addResolver),
    ...renderUtils
  }
}

export { createRenderHook, cleanup, addCleanup, removeCleanup }
