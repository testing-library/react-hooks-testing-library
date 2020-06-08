function hasDependency(name) {
  try {
    require(name)
    return true
  } catch {
    return false
  }
}

const autoDetectableRenderers = [
  { required: 'react-dom', renderer: './dom/pure' },
  { required: 'react-test-renderer', renderer: './native/pure' }
]

const validRenderers = autoDetectableRenderers.filter(({ required }) => hasDependency(required))

if (validRenderers.length === 0) {
  const options = autoDetectableRenderers.map(({ required }) => `  - ${required}`).join('\n')
  throw new Error(`Could not auto-detect a React renderer.  Options are:\n${options}`)
}

module.exports = require(validRenderers[0].renderer)
