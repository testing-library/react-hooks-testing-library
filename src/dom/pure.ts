import ReactDOM from 'react-dom'
import { act as baseAct } from 'react-dom/test-utils'

import {
  TestHookProps,
  DomRendererOptions,
  DomRendererReturn,
  ReactDomAct,
  ReactDomActCallbackAsync,
  ReactDomActCallback
} from '../types'

import { createRenderHook, cleanup, addCleanup, removeCleanup } from '../core/index'

import toRender from '../helpers/toRender'

// eslint-disable-next-line import/no-mutable-exports
let act: ReactDomAct

function createDomRenderer<TProps, TResult>(
  testHookProps: Omit<TestHookProps<TProps, TResult>, 'hookProps'>,
  { wrapper }: DomRendererOptions<TProps>
): DomRendererReturn<TProps> {
  const container = document.createElement('div')

  const testHook = toRender(testHookProps, wrapper)

  act = (cb: ReactDomActCallbackAsync | ReactDomActCallback) => baseAct(cb as ReactDomActCallback)

  return {
    render(props) {
      document.body.appendChild(container)
      baseAct(() => {
        ReactDOM.render(testHook(props), container)
      })
    },
    rerender(props) {
      baseAct(() => {
        ReactDOM.render(testHook(props), container)
      })
    },
    unmount() {
      baseAct(() => {
        ReactDOM.unmountComponentAtNode(container)
      })
      document.body.removeChild(container)
    },
    act
  }
}

const renderHook = createRenderHook(createDomRenderer)

export { renderHook, act, cleanup, addCleanup, removeCleanup }
