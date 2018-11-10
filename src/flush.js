import invariant from 'invariant'

export default (context) => () => {
  invariant(context.flush, 'You must use the hook before effects can be flushed')

  context.flush()

  return context.result
}
