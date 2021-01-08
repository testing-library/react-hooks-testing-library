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
) {
  const renderHook = (
    callback: (props: TProps) => TResult,
    options: RenderHookOptions<TProps, TOptions> = {} as RenderHookOptions<TProps, TOptions>
  ): RenderHook<TProps, TResult, TRenderer> => {
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
  // it seems to vanish in nodejs and does not appear in stack traces.
  // This dummy usage works around that.
  const _name = renderHook.name // eslint-disable-line @typescript-eslint/no-unused-vars

  return renderHook
}

export { createRenderHook, cleanup, addCleanup, removeCleanup }
