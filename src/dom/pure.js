import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { createRenderHook, cleanup } from '../core'

function Fallback() {
  return null
}

function createRenderer() {
  const container = document.createElement('div')

  return {
    render(component) {
      document.body.appendChild(container)
      act(() => {
        ReactDOM.render(<Suspense fallback={<Fallback />}>{component}</Suspense>, container)
      })
    },
    rerender(component) {
      act(() => {
        ReactDOM.render(<Suspense fallback={<Fallback />}>{component}</Suspense>, container)
      })
    },
    unmount() {
      act(() => {
        ReactDOM.unmountComponentAtNode(container)
        document.body.removeChild(container)
      })
    },
    act
  }
}

const renderHook = createRenderHook(createRenderer)

export { renderHook, act, cleanup }
