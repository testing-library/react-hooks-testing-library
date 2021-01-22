import filterConsole from 'filter-console'

function enableErrorOutputSuppression() {
  // Automatically registers console error suppression and restoration in supported testing frameworks
  if (
    typeof beforeEach === 'function' &&
    typeof afterEach === 'function' &&
    !process.env.RHTL_DISABLE_ERROR_FILTERING
  ) {
    let restoreConsole: () => void

    beforeEach(() => {
      restoreConsole = filterConsole(
        [
          /^The above error occurred in the <TestComponent> component:/, // error boundary output
          /^Error: Uncaught .+/ // jsdom output
        ],
        {
          methods: ['error']
        }
      )
    })

    afterEach(() => restoreConsole?.())
  }
}

export { enableErrorOutputSuppression }
