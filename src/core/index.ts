import {
  CreateRenderer,
  Renderer,
  ResultContainer,
  RenderHookOptions,
  RenderResult,
  RenderHook
} from 'types'

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
  { initialProps, ...options }: RenderHookOptions<TProps, TOptions> = {} as RenderHookOptions<
    TProps,
    TOptions
  >
): RenderHook<TProps, TResult, TRenderer> => {
  const { result, setValue, setError, addResolver } = resultContainer<TResult>()
  const hookProps = { current: initialProps }
  const props = { callback, setValue, setError }

  const { render, rerender, unmount, act, ...renderUtils } = createRenderer(
    props,
    options as TOptions
  )

  render(hookProps.current)

  function rerenderHook(newProps = hookProps.current) {
    hookProps.current = newProps
    rerender(hookProps.current)
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
