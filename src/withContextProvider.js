import React from 'react'
import useHookAdvanced from './useHookAdvanced'

export default (hook, context) => (ContextProvider, props) => {
  const { resolveComponent } = context
  return useHookAdvanced(
    hook,
    context.update({
      resolveComponent: (Component) => (
        <ContextProvider {...props}>{resolveComponent(Component)}</ContextProvider>
      )
    })
  )
}
