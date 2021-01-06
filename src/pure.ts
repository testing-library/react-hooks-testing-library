import { ReactHooksRenderer } from './types'

const RENDERERS = [
  { required: 'react-test-renderer', renderer: './native/pure' },
  { required: 'react-dom', renderer: './dom/pure' }
]

const KNOWN_RENDERERS = [
  '@testing-library/react-hooks/dom',
  '@testing-library/react-hooks/native',
  '@testing-library/react-hooks/server'
]

function hasDependency(name: string) {
  try {
    require(name)
    return true
  } catch {
    return false
  }
}

function getRenderer() {
  const validRenderer = RENDERERS.find(({ required }) => hasDependency(required))

  if (validRenderer) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(validRenderer.renderer) as ReactHooksRenderer
  } else {
    const options = KNOWN_RENDERERS.map((renderer) => `  - ${renderer}`).join('\n')
    throw new Error(`Could not auto-detect a React renderer.  Options are:\n${options}`)
  }
}

const { renderHook, act, cleanup, addCleanup, removeCleanup } = getRenderer()

export { renderHook, act, cleanup, addCleanup, removeCleanup }

export * from './types'
export * from './types/react'
