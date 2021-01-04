import { createRenderHook, cleanup, addCleanup, removeCleanup } from '../core'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createCustomRenderer = (createRenderer: any) => ({
  renderHook: createRenderHook(createRenderer)
})

export { createCustomRenderer, cleanup, addCleanup, removeCleanup }
