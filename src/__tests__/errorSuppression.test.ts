import { useEffect } from 'react'

describe('error output suppression tests', () => {
  const consoleError = console.error

  runForRenderers(
    ['default', 'dom', 'native', 'server/hydrated'],
    ({ renderHook, act, suppressErrorOutput }, rendererName) => {
      test('should not suppress relevant errors', () => {
        console.error = jest.fn()
        try {
          const restoreConsole = suppressErrorOutput()

          console.error('expected')
          console.error(new Error('expected'))
          console.error('expected with args', new Error('expected'))

          restoreConsole()

          expect(console.error).toBeCalledWith('expected')
          expect(console.error).toBeCalledWith(new Error('expected'))
          expect(console.error).toBeCalledWith('expected with args', new Error('expected'))
          expect(console.error).toBeCalledTimes(3)
        } finally {
          console.error = consoleError
        }
      })

      test('should allow console.error to be mocked', async () => {
        console.error = jest.fn()

        try {
          const { rerender, unmount } = renderHook(
            (stage) => {
              useEffect(() => {
                console.error(`expected in effect`)
                return () => {
                  console.error(`expected in unmount`)
                }
              }, [])
              console.error(`expected in ${stage}`)
            },
            {
              initialProps: 'render'
            }
          )

          act(() => {
            console.error('expected in act')
          })

          await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 100))
            console.error('expected in async act')
          })

          rerender('rerender')

          unmount()

          expect(console.error).toBeCalledWith('expected in render')
          expect(console.error).toBeCalledWith('expected in effect')
          expect(console.error).toBeCalledWith('expected in act')
          expect(console.error).toBeCalledWith('expected in async act')
          expect(console.error).toBeCalledWith('expected in rerender')
          expect(console.error).toBeCalledWith('expected in unmount')
          expect(console.error).toBeCalledTimes(rendererName.includes('hydrated') ? 7 : 6)
        } finally {
          console.error = consoleError
        }
      })
    }
  )
})
