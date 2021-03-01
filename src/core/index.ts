import { CreateRenderer, Renderer, RenderResult, RenderHookOptions } from '../types'

import { asyncUtils } from './asyncUtils'
import { cleanup, addCleanup, removeCleanup } from './cleanup'
import { suppressErrorOutput } from './console'

function resultContainer<TValue>() {
  const results: Array<{ value?: TValue; error?: Error }> = []
  const resolvers: Array<() => void> = []

  const result: RenderResult<TValue> = {
    get all() {
      return results.map(({ value, error }) => error ?? (value as TValue))
    },
    get current() {
      const { value, error } = results[results.length - 1] ?? {}
      if (error) {
        throw error
      }
      return value as TValue
    },
    get error() {
      const { error } = results[results.length - 1] ?? {}
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

function createRenderHook<
  TProps,
  TResult,
  TRendererOptions extends object,
  TRenderer extends Renderer<TProps>
>(createRenderer: CreateRenderer<TProps, TResult, TRendererOptions, TRenderer>) {
  const renderHook = (
    callback: (props: TProps) => TResult,
    options = {} as RenderHookOptions<TProps> & TRendererOptions
  ) => {
    const { result, setValue, setError, addResolver } = resultContainer<TResult>()
    const renderProps = { callback, setValue, setError }
    let hookProps = options.initialProps

    const { render, rerender, unmount, act, ...renderUtils } = createRenderer(renderProps, options)

    render(hookProps)

    const rerenderHook = (newProps = hookProps) => {
      hookProps = newProps
      rerender(hookProps)
    }

    const unmountHook = () => {
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

  return renderHook
}

export { createRenderHook, cleanup, addCleanup, removeCleanup, suppressErrorOutput }
