import React from 'react'
import { render, cleanup } from 'react-testing-library'
import invariant from 'invariant'
import uuid from 'uuid-v4'

const use = (hook, context) => (props) => {
  const HookHarness = (props) => {
    context.result = hook(props)
    return <div data-testid={context.id} />
  }

  const { queryByTestId, rerender } = render(context.resolveComponent(<HookHarness {...props} />))

  const container = queryByTestId(context.id)

  invariant(container !== null, 'Failed to render wrapper component')

  context.rerender = (newProps) => rerender(context.resolveComponent(<HookHarness {...newProps} />))
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

const withContextProvider = (hook, context) => (ContextProvider, props) => {
  const { resolveComponent } = context
  return useHookAdvanced(hook, {
    ...context,
    resolveComponent: (Component) => (
      <ContextProvider {...props}>{resolveComponent(Component)}</ContextProvider>
    )
  })
}

const useHookAdvanced = (hook, context) => {
  return {
    use: use(hook, context),
    withContextProvider: withContextProvider(hook, context),
    update: update(context),
    flushEffects: flushEffects(context)
  }
}

export const useHook = (hook) => {
  const context = {
    id: uuid(),
    resolveComponent: (Component) => Component
  }
  return useHookAdvanced(hook, context)
}

export { cleanup }
