import React from 'react'
import { render, cleanup } from 'react-testing-library'
import invariant from 'invariant'
import uuid from 'uuid-v4'

export const useHook = (hook, ...props) => {
  const context = {
    id: uuid(),
    resolveComponent: (Component) => Component,
    rendered: false,
    props
  }

  const HookHarness = () => {
    context.currentValue = hook(...context.props)
    return <div data-testid={context.id} />
  }

  const renderHook = () => {
    const { queryByTestId, rerender } = render(context.resolveComponent(<HookHarness />))
    const container = queryByTestId(context.id)

    invariant(container !== null, 'Failed to render wrapper component')

    context.rendered = true
    context.rerender = () => rerender(context.resolveComponent(<HookHarness />))
  }

  const getCurrentValue = () => {
    if (!context.rendered) {
      renderHook()
    } else {
      context.rerender()
    }
    return context.currentValue
  }

  const setProps = (...newProps) => {
    context.props = newProps
  }

  const addContextProvider = (ContextProvider, contextProps) => {
    const Provider = ContextProvider.Provider || ContextProvider
    const { resolveComponent } = context
    const updateContext = (newContextProps) => {
      contextProps = newContextProps
    }
    context.resolveComponent = (Component) => (
      <Provider {...contextProps}>{resolveComponent(Component)}</Provider>
    )
    return { updateContext }
  }

  const flushEffects = (minTimes = 1, maxTimes = Math.max(minTimes + 1, 100)) => {
    invariant(minTimes > 0, `minTimes (${minTimes}) must be a positive number`)
    invariant(maxTimes > 0, `maxTimes (${maxTimes}) must be a positive number`)
    invariant(
      minTimes <= maxTimes,
      `maxTimes (${maxTimes}) must be less than maxTimes (${maxTimes})`
    )

    let lastValue
    let currentValue
    let flushCount = 0

    while ((currentValue !== lastValue || flushCount < minTimes) && flushCount < maxTimes) {
      lastValue = currentValue
      currentValue = getCurrentValue()
      flushCount++
    }

    invariant(
      flushCount < maxTimes,
      `Hook values have not resolved after flushing ${maxTimes} times`
    )
  }

  return {
    getCurrentValue,
    getCurrentValues: getCurrentValue,
    flushEffects,
    setProps,
    addContextProvider
  }
}

export { cleanup }
