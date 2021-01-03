import { createRenderHook, cleanup } from '../core/index'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createCustomRenderer = (createRenderer: any) => ({
  renderHook: createRenderHook(createRenderer)
})

export { createCustomRenderer, cleanup }
