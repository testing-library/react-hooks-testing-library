import React, { ReactElement, ReactNode, Suspense } from 'react'
import { act, create, ReactTestRenderer } from 'react-test-renderer'
import asyncUtils from './asyncUtils'
import { cleanup, addCleanup, removeCleanup } from './cleanup'

function isPromise<T>(value: unknown): boolean {
  return typeof (value as PromiseLike<T>).then === 'function'
}

type TestHookProps<TProps, TResult> = {
  callback: (props: TProps) => TResult
  hookProps: TProps | undefined
  onError: (error: Error) => void
  children: (value: TResult) => void
}

function TestHook<TProps, TResult>({
  callback,
  hookProps,
  onError,
  children
}: TestHookProps<TProps, TResult>) {
  try {
    // coerce undefined into TProps, so it maintains the previous behaviour
    children(callback(hookProps as TProps))
  } catch (err: unknown) {
    if (isPromise(err)) {
      throw err
    } else {
      onError(err as Error)
    }
  }
  return null
}

function Fallback() {
  return null
}

function resultContainer<TValue>() {
  const results: Array<{ value?: TValue; error?: Error }> = []
  const resolvers: Array<() => void> = []

  const result = {
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

export interface RenderHookOptions<TProps> {
  initialProps?: TProps
  wrapper?: React.ComponentType<TProps>
}

function renderHook<TProps, TResult>(
  callback: (props: TProps) => TResult,
  { initialProps, wrapper }: RenderHookOptions<TProps> = {}
) {
  const { result, setValue, setError, addResolver } = resultContainer<TResult>()
  const hookProps = { current: initialProps }

  const wrapUiIfNeeded = (innerElement: ReactNode) =>
    wrapper ? React.createElement(wrapper, hookProps.current, innerElement) : innerElement

  const toRender = () =>
    wrapUiIfNeeded(
      <Suspense fallback={<Fallback />}>
        <TestHook callback={callback} hookProps={hookProps.current} onError={setError}>
          {setValue}
        </TestHook>
      </Suspense>
    ) as ReactElement

  let testRenderer: ReactTestRenderer
  act(() => {
    testRenderer = create(toRender())
  })

  function rerenderHook(newProps: typeof initialProps = hookProps.current) {
    hookProps.current = newProps
    act(() => {
      testRenderer.update(toRender())
    })
  }

  function unmountHook() {
    act(() => {
      removeCleanup(unmountHook)
      testRenderer.unmount()
    })
  }

  addCleanup(unmountHook)

  return {
    result,
    rerender: rerenderHook,
    unmount: unmountHook,
    ...asyncUtils(addResolver)
  }
}

export { renderHook, cleanup, addCleanup, removeCleanup, act }
