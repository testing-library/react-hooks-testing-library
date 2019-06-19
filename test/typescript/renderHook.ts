import { useState, useCallback, useEffect } from 'react'
import { renderHook } from '@testing-library/react-hooks'

const useCounter = (initialCount: number = 0) => {
  const [count, setCount] = useState(initialCount)
  const incrementBy = useCallback(
    (n: number) => {
      setCount(count + n)
    },
    [count]
  )
  const decrementBy = useCallback(
    (n: number) => {
      setCount(count - n)
    },
    [count]
  )
  return {
    count,
    incrementBy,
    decrementBy
  }
}

function checkTypesWithNoInitialProps() {
  const { result, unmount, rerender } = renderHook(() => useCounter())

  // check types
  const _result: {
    current: {
      count: number
      incrementBy: (_: number) => void
      decrementBy: (_: number) => void
    }
  } = result
  const _unmount: () => boolean = unmount
  const _rerender: () => void = rerender
}

function checkTypesWithInitialProps() {
  const { result, unmount, rerender } = renderHook(({ count }) => useCounter(count), {
    initialProps: { count: 10 }
  })

  // check types
  const _result: {
    current: {
      count: number
      incrementBy: (_: number) => void
      decrementBy: (_: number) => void
    }
  } = result
  const _unmount: () => boolean = unmount
  const _rerender: (_?: { count: number }) => void = rerender
}

function checkTypesWhenHookReturnsVoid() {
  const { result, unmount, rerender } = renderHook(() => useEffect(() => {}))

  // check types
  const _result: {
    current: void
  } = result
  const _unmount: () => boolean = unmount
  const _rerender: () => void = rerender
}

function checkTypesWithError() {
  const { result } = renderHook(() => useCounter())

  // check types
  const _result: {
    error: Error
  } = result
}

async function checkTypesForWaitForNextUpdate() {
  const { waitForNextUpdate } = renderHook(() => {})

  await waitForNextUpdate()

  // check type
  const _waitForNextUpdate: () => Promise<void> = waitForNextUpdate
}
