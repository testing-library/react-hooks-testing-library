import filterConsole from 'filter-console'

function suppressErrorOutput() {
  // The error output from error boundaries is notoriously difficult to suppress.  To save
  // our users from having to work it out, we crudely suppress the output matching the patterns
  // below.  For more information, see these issues:
  //   - https://github.com/testing-library/react-hooks-testing-library/issues/50
  //   - https://github.com/facebook/react/issues/11098#issuecomment-412682721
  //   - https://github.com/facebook/react/issues/15520
  //   - https://github.com/facebook/react/issues/18841
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

export { suppressErrorOutput }
