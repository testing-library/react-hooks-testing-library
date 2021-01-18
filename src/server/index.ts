import { autoRegisterCleanup } from '../core/cleanup'
import { enableErrorOutputSuppression } from '../helpers/console'

autoRegisterCleanup()
enableErrorOutputSuppression()

export * from './pure'
