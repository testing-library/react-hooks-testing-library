import use from './use'
import withContextProvider from './withContextProvider'
import flush from './flush'
import update from './update'

export default (hook, context) => {
  return {
    use: use(hook, context),
    withContextProvider: withContextProvider(hook, context),
    flush: flush(context),
    update: update(context)
  }
}
