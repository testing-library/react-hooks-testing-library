import { ReactHooksRenderer } from './types/react'

const renderers = [
  { required: 'react-test-renderer', renderer: './native/pure' },
  { required: 'react-dom', renderer: './dom/pure' }
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
  const validRenderer = renderers.find(({ required }) => hasDependency(required))

  if (validRenderer) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(validRenderer.renderer) as ReactHooksRenderer
  } else {
    const options = renderers
      .map(({ required }) => `  - ${required}`)
      .sort((a, b) => a.localeCompare(b))
      .join('\n')

    throw new Error(
      `Could not auto-detect a React renderer. Are you sure you've installed one of the following\n${options}`
    )
  }
}

const { renderHook, act, cleanup, addCleanup, removeCleanup } = getRenderer()

export { renderHook, act, cleanup, addCleanup, removeCleanup }

export * from './types'
export * from './types/react'
