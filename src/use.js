import React from 'react'
import { render } from 'react-testing-library'
import invariant from 'invariant'

export default (hook, context) => (props) => {
  const HookHarness = (props) => {
    context.update({ result: hook(props) })
    return <div data-testid={context.id} />
  }

  const { queryByTestId, rerender } = render(context.resolveComponent(<HookHarness {...props} />))

  const container = queryByTestId(context.id)

  invariant(container !== null, 'Failed to render wrapper component')

  context.update({
    rerender: (newProps) => rerender(context.resolveComponent(<HookHarness {...newProps} />)),
    flush: () => context.rerender(props)
  })

  return context.result
}
