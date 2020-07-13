import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { createRenderHook, cleanup } from '../core'

function Fallback() {
  return null
}

function createRenderer(TestHook, testHookProps, { wrapper: Wrapper }) {
  const container = document.createElement('div')

  const toRender = (props) =>
    console.log(props) || (
      <Wrapper {...props}>
        <TestHook {...props} {...testHookProps} />
      </Wrapper>
    )

  return {
    render(props) {
      document.body.appendChild(container)
      act(() => {
        ReactDOM.render(<Suspense fallback={<Fallback />}>{toRender(props)}</Suspense>, container)
      })
    },
    rerender(props) {
      act(() => {
        ReactDOM.render(<Suspense fallback={<Fallback />}>{toRender(props)}</Suspense>, container)
      })
    },
    unmount() {
      act(() => {
        ReactDOM.unmountComponentAtNode(container)
      })
      document.body.removeChild(container)
    },
    act
  }
}

const renderHook = createRenderHook(createRenderer)

export { renderHook, act, cleanup }
