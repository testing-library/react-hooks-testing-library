import { RenderingEngineArray, ReactHooksRenderer } from 'types'

const RENDERERS: RenderingEngineArray = [
  { required: 'react-test-renderer', renderer: './native/pure' },
  { required: 'react-dom', renderer: './dom/pure' }
]

function getRenderer(renderers: RenderingEngineArray) {
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
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(validRenderer.renderer) as ReactHooksRenderer
  } else {
    const options = renderers.map(({ renderer }) => `  - ${renderer}`).join('\n')
    throw new Error(`Could not auto-detect a React renderer.  Options are:\n${options}`)
  }
}

const { renderHook, act, cleanup } = getRenderer(RENDERERS)

export { renderHook, act, cleanup }
