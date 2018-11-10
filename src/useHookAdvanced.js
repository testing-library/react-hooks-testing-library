import use from './use'
import withContextProvider from './withContextProvider'
import update from './update'
import flushEffects from './flushEffects'

export default (hook, context) => {
  return {
    use: use(hook, context),
    withContextProvider: withContextProvider(hook, context),
    update: update(context),
    flushEffects: flushEffects(context)
  }
}
