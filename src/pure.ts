import { RenderingEngineArray, ReactHooksRenderer } from 'types'

const RENDERERS: RenderingEngineArray = [
  { required: 'react-test-renderer', renderer: './native/pure' },
  { required: 'react-dom', renderer: './server/pure' }
]

function getRenderer(renderers: RenderingEngineArray): string {
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

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { renderHook, act, cleanup } = require(getRenderer(RENDERERS)) as ReactHooksRenderer

export { renderHook, act, cleanup }
