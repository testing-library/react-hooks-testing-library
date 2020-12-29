type RendererArray = Array<{ required: string; renderer: string }>

const RENDERERS: RendererArray = [{ required: 'react-test-renderer', renderer: './native/pure' }]

function getRenderer (renderers: RendererArray): string {
  const hasDependency = (name: string) => {
    try {
      require(name)
      return true
    } catch {
      return false
    }
  }

  const [validRenderer] = renderers.filter(({ required }) => hasDependency(required))

  if (validRenderer) {
    return validRenderer.renderer
  } else {
    const options = renderers.map(({ renderer }) => `  - ${renderer}`).join('\n')
    throw new Error(`Could not auto-detect a React renderer.  Options are:\n${options}`)
  }
}

interface Renderer {
  renderHook: () => void
  act: () => void
  cleanup: () => void
}

const { renderHook, act, cleanup } = require(getRenderer(RENDERERS)) as Renderer

export { renderHook, act, cleanup }
