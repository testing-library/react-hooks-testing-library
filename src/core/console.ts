const consoleFilters = [
  /^The above error occurred in the <.*?> component:/, // error boundary output
  /^Error: Uncaught .+/ // jsdom output
]

function suppressErrorOutput() {
  const originalError = console.error

  const error = (...args: Parameters<typeof originalError>) => {
    const message = typeof args[0] === 'string' ? args[0] : null
    if (!message || !consoleFilters.some((filter) => filter.test(message))) {
      originalError(...args)
    }
  }

  console.error = error

  return () => {
    console.error = originalError
  }
}

function errorFilteringDisabled() {
  try {
    return !!process.env.RHTL_DISABLE_ERROR_FILTERING
  } catch {
    // falling back in the case that process.env.RHTL_DISABLE_ERROR_FILTERING cannot be accessed (e.g. browser environment)
    return false
  }
}

function enableErrorOutputSuppression() {
  // Automatically registers console error suppression and restoration in supported testing frameworks
  if (
    typeof beforeEach === 'function' &&
    typeof afterEach === 'function' &&
    !errorFilteringDisabled()
  ) {
    let restoreConsole!: () => void

    beforeEach(() => {
      restoreConsole = suppressErrorOutput()
    })

    afterEach(() => restoreConsole())
  }
}

export { enableErrorOutputSuppression, suppressErrorOutput }
