import { createRenderHook, cleanup } from '../core/index'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createCustomRenderer(createRenderer: any) {
  const renderHook = createRenderHook(createRenderer)
  return { renderHook }
}

export { createCustomRenderer, cleanup }
