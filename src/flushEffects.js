import invariant from 'invariant'

export default (context) => () => {
  invariant(context.rerender, 'You must use the hook before effects can be flushed')

  context.flushEffects()

  return context.result
}
