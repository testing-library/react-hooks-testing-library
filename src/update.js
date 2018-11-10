import invariant from 'invariant'

export default (context) => (props) => {
  invariant(context.rerender, 'You must use the hook before it can be updated')

  context.rerender(props)

  return context.result
}
