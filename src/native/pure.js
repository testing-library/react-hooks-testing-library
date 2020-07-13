import React, { Suspense } from 'react'
import { act, create } from 'react-test-renderer'
import { createRenderHook, cleanup } from '../core'

function Fallback() {
  return null
}
function createRenderer(TestHook, testHookProps, { wrapper: Wrapper }) {
  let container

  const toRender = (props) => (
    <Wrapper {...props}>
      <TestHook {...props} {...testHookProps} />
    </Wrapper>
  )

  return {
    render(props) {
      act(() => {
        container = create(<Suspense fallback={<Fallback />}>{toRender(props)}</Suspense>)
      })
    },
    rerender(props) {
      act(() => {
        container.update(<Suspense fallback={<Fallback />}>{toRender(props)}</Suspense>)
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
