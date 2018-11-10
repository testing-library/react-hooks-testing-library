import React from 'react'
import { render, cleanup } from 'react-testing-library'
import invariant from 'invariant'
import uuid from 'uuid-v4'

const use = (hook, context) => (props) => {

  const HookHarness = (props) => {
    context.result = hook(props)
    return <div data-testid={context.id} />
  }

  const { queryByTestId, rerender } = render(context.resolveComponent({ children: <HookHarness {...props} /> }))

  const container = queryByTestId(context.id)

  invariant(container !== null, 'You must render children when wrapping the hook')

  context.rerender = (newProps) => rerender(context.resolveComponent({ children: <HookHarness {...newProps} /> }))
  context.flushEffects = () => context.rerender(props)

  return context.result 
}

const update = (context) => (props) => {
  invariant(context.rerender, 'You must render the hook before it can be updated')

  context.rerender(props)

  return context.result
}

const flushEffects = (context) => () => {
  invariant(context.rerender, 'You must render the hook before effects can be flushed')

  context.flushEffects()

  return context.result
}

const wrap = (hook, context) => (wrap) => {
  invariant(typeof wrap === 'function', 'wrap must be provided a function')
  const { resolveComponent } = context
  return useHookAdvanced(hook, { ...context, resolveComponent: (props) => wrap({ children: resolveComponent(props) }) })
}

const useHookAdvanced = (hook, context) => {
  return {
    use: use(hook, context),
    update: update(context),
    flushEffects: flushEffects(context),
    wrap: wrap(hook, context)
  }
}

export const useHook = (hook) => {
  const context = {
    id: uuid(),
    resolveComponent: ({ children }) => children
  }
  return useHookAdvanced(hook, context)
}

export { cleanup }
