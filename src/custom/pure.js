import { createRenderHook, cleanup } from '../core'

function createCustomRenderer(createRenderer) {
  const renderHook = createRenderHook(createRenderer)
  return { renderHook }
}

export { createCustomRenderer, cleanup }
