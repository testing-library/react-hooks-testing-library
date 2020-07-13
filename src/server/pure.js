import React from 'react'
import ReactDOMServer from 'react-dom/server'
import ReactDOM from 'react-dom'
import { act as baseAct } from 'react-dom/test-utils'
import { createRenderHook, cleanup } from '../core'

let act

function createRenderer(TestHook, testHookProps, { wrapper: Wrapper }) {
  const container = document.createElement('div')

  const toRender = (props) => (
    <Wrapper {...props}>
      <TestHook {...props} {...testHookProps} />
    </Wrapper>
  )

  let renderProps
  let hydrated = false

  act = function act(...args) {
    if (!hydrated) {
      throw new Error('You must hydrate the component before you can act')
    }
    return baseAct(...args)
  }

  return {
    render(props) {
      renderProps = props
      baseAct(() => {
        const serverOutput = ReactDOMServer.renderToString(toRender(props))
        container.innerHTML = serverOutput
      })
    },
    hydrate() {
      if (hydrated) {
        throw new Error('The component can only be hydrated once')
      }
      if (!hydrated) {
        document.body.appendChild(container)
        baseAct(() => {
          ReactDOM.hydrate(toRender(renderProps), container)
        })
        hydrated = true
      }
    },
    rerender(props) {
      if (!hydrated) {
        throw new Error('You must hydrate the component before you can rerender')
      }
      baseAct(() => {
        ReactDOM.render(toRender(props), container)
      })
    },
    unmount() {
      if (hydrated) {
        baseAct(() => {
          ReactDOM.unmountComponentAtNode(container)
          document.body.removeChild(container)
        })
      }
    },
    act
  }
}

const renderHook = createRenderHook(createRenderer)

export { renderHook, act, cleanup }
