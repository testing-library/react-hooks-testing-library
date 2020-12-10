const RENDERERS = [{ required: 'react-test-renderer', renderer: './native/pure' }]

function getRenderer(renderers) {
  const hasDependency = (name) => {
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
    const options = renderers.map(({ option }) => `  - ${option}`).join('\n')
    throw new Error(`Could not auto-detect a React renderer.  Options are:\n${options}`)
  }
}

module.exports = require(getRenderer(RENDERERS))
