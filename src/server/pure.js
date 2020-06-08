import ReactDOMServer from 'react-dom/server'
import ReactDOM from 'react-dom'
import { act as baseAct } from 'react-dom/test-utils'
import { createRenderHook, cleanup } from '../core'

let act

function createRenderer() {
  const container = document.createElement('div')
  let hydrated = false
  let ssrComponent

  act = function act(...args) {
    if (!hydrated) {
      throw new Error('You must hydrate the component before you can act')
    }
    return baseAct(...args)
  }

  return {
    render(component) {
      ssrComponent = component
      baseAct(() => {
        const serverOutput = ReactDOMServer.renderToString(component)
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
          ReactDOM.hydrate(ssrComponent, container)
        })
        hydrated = true
      }
    },
    rerender(component) {
      if (!hydrated) {
        throw new Error('You must hydrate the component before you can rerender')
      }
      baseAct(() => {
        ReactDOM.render(component, container)
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
