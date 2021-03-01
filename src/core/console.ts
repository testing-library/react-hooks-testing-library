import filterConsole from 'filter-console'

function suppressErrorOutput() {
  if (process.env.RHTL_DISABLE_ERROR_FILTERING) {
    return () => {}
  }

  return filterConsole(
    [
      /^The above error occurred in the <TestComponent> component:/, // error boundary output
      /^Error: Uncaught .+/ // jsdom output
    ],
    {
      methods: ['error']
    }
  )
}

function enableErrorOutputSuppression() {
  // Automatically registers console error suppression and restoration in supported testing frameworks
  if (typeof beforeEach === 'function' && typeof afterEach === 'function') {
    let restoreConsole!: () => void

    beforeEach(() => {
      restoreConsole = suppressErrorOutput()
    })

    afterEach(() => restoreConsole())
  }
}

export { enableErrorOutputSuppression, suppressErrorOutput }
