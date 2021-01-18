import filterConsole from 'filter-console'

function enableErrorOutputSuppression() {
  if (!process.env.RHTL_DISABLE_ERROR_FILTERING) {
    const restoreConsole = filterConsole(
      [
        /^The above error occurred in the <TestComponent> component:/, // error boundary output
        /^Error: Uncaught .+/ // jsdom output
      ],
      {
        methods: ['error']
      }
    )

    // Automatically registers restoration in supported testing frameworks
    if (typeof afterAll === 'function') {
      afterAll(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100))
        restoreConsole()
      })
    }
  }
}

export { enableErrorOutputSuppression }
