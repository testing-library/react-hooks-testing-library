import React from 'react'

import {
  TestHookProps,
  NativeRendererOptions,
  NativeRendererReturn,
  ResultContainerReturn,
  RenderHookOptions,
  RenderResult,
  ServerRendererReturn,
  ServerRendererOptions
} from '../types'

import asyncUtils from './asyncUtils'
import { cleanup, addCleanup, removeCleanup } from './cleanup'

function resultContainer<TValue>(): ResultContainerReturn<TValue> {
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

// typed this way in relation to this https://github.com/DefinitelyTyped/DefinitelyTyped/issues/44572#issuecomment-625878049
function defaultWrapper({ children }: { children?: React.ReactNode }) {
  return (children as unknown) as JSX.Element
}

const createRenderHook = (
  createRenderer: <TProps, TResult>(
    testProps: Omit<TestHookProps<TProps, TResult>, 'hookProps'>,
    opts: NativeRendererOptions<TProps> | ServerRendererOptions<TProps>
  ) => NativeRendererReturn<TProps> | ServerRendererReturn<TProps>
) => <TProps, TResult>(
  callback: (props: TProps) => TResult,
  { initialProps, wrapper = defaultWrapper }: RenderHookOptions<TProps> = {}
) => {
  const { result, setValue, setError, addResolver } = resultContainer<TResult>()
  const hookProps = { current: initialProps }
  const props = { callback, setValue, setError }
  const options = { wrapper }

  const { render, rerender, unmount, act, ...renderUtils } = createRenderer<TProps, TResult>(
    props,
    options
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
