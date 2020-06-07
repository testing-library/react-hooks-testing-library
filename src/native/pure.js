import React, { Suspense } from 'react'
import { act, create } from 'react-test-renderer'
import { createRenderHook, cleanup } from '../core'

function Fallback() {
  return null
}

function createRenderer() {
  let container

  return {
    render(component) {
      act(() => {
        container = create(<Suspense fallback={<Fallback />}>{component}</Suspense>)
      })
    },
    rerender(component) {
      act(() => {
        container.update(<Suspense fallback={<Fallback />}>{component}</Suspense>)
      })
    },
    unmount() {
      act(() => {
        container.unmount()
      })
    },
    act
  }
}

const renderHook = createRenderHook(createRenderer)

export { renderHook, act, cleanup }
