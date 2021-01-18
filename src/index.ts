import { autoRegisterCleanup } from './core/cleanup'
import { enableErrorOutputSuppression } from './core/console'

autoRegisterCleanup()
enableErrorOutputSuppression()

export * from './pure'
