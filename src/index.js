import React from 'react'
import { render, cleanup } from 'react-testing-library'
import invariant from 'invariant'
import uuid from 'uuid-v4'

const renderHook = (hook, context) => (props) => {

  const containerId = uuid()

  const HookHarness = (props) => {
    context.result = hook(props)
    return <div data-testid={containerId} />
  }

  const { queryByTestId, rerender } = render(context.resolveComponent({ children: <HookHarness {...props} /> }))

  const container = queryByTestId(containerId)

  invariant(container !== null, 'You must render children when wrapping the hook')

  context.rerender = (newProps) => rerender(context.resolveComponent({ children: <HookHarness {...newProps} /> }))
  context.flushEffects = () => rerender(context.resolveComponent({ children: <HookHarness {...props} /> }))

  return context.result 
}

const updateHook = (context) => (props) => {
  invariant(context.rerender, 'You must render the hook before it can be updated')

  context.rerender(props)

  return context.result
}

const flushHookEffects = (context) => () => {
  invariant(context.rerender, 'You must render the hook before effects can be flushed')

  context.flushEffects()

  return context.result
}

const wrapHook = (hook, context) => (wrap) => {
  invariant(typeof wrap === 'function', 'wrap must be provided a function')
  const { resolveComponent } = context
  return useHookAdvanced(hook, { ...context, resolveComponent: (props) => wrap({ children: resolveComponent(props) }) })
}

const useHookAdvanced = (hook, context) => {
  return {
    render: renderHook(hook, context),
    update: updateHook(context),
    flushEffects: flushHookEffects(context),
    wrap: wrapHook(hook, context)
  }
}

export const useHook = (hook) => useHookAdvanced(hook, { resolveComponent: ({ children }) => children })

export { cleanup }
