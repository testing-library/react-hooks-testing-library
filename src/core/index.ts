import { CreateRenderer, Renderer, RenderResult, RenderHook, RenderHookOptions } from '../types'
import { ResultContainer } from '../types/internal'

import { asyncUtils } from './asyncUtils'
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

function createRenderHook<TProps, TResult, TOptions extends {}, TRenderer extends Renderer<TProps>>(
  createRenderer: CreateRenderer<TProps, TResult, TOptions, TRenderer>
): RenderHook<TProps, TResult, TOptions> {
  const renderHook: RenderHook<TProps, TResult, TOptions> = (
    callback,
    options = {} as RenderHookOptions<TProps, TOptions>
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

  // If the function name does not get used before it is returned,
  // it's name is removed by babel-plugin-minify-dead-code-elimination.
  // This dummy usage works around that.
  renderHook.name // eslint-disable-line @typescript-eslint/no-unused-expressions

  return renderHook
}

export { createRenderHook, cleanup, addCleanup, removeCleanup }
