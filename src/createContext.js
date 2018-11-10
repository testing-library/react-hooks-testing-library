import uuid from 'uuid-v4'

export default () => {
  const context = {
    id: uuid(),
    resolveComponent: (Component) => Component
  }

  context.update = (newValues) => {
    Object.entries(newValues).forEach(([key, value]) => (context[key] = value))
    return context
  }

  return context
}
