import { useEffect } from 'react'

import { ReactHooksServerRenderer } from '../../types/react'

describe('error output suppression tests', () => {
  test('should not suppress relevant errors', () => {
    const consoleError = console.error
    console.error = jest.fn()

    const { suppressErrorOutput } = require('..') as ReactHooksServerRenderer

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
    const { renderHook, act } = require('..') as ReactHooksServerRenderer
    const consoleError = console.error
    console.error = jest.fn()

    try {
      const { hydrate, rerender, unmount } = renderHook(
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

      hydrate()

      act(() => {
        console.error('expected in act')
      })

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100))
        console.error('expected in async act')
      })

      rerender('rerender')

      unmount()

      expect(console.error).toBeCalledWith('expected in render') // twice render/hydrate
      expect(console.error).toBeCalledWith('expected in effect')
      expect(console.error).toBeCalledWith('expected in act')
      expect(console.error).toBeCalledWith('expected in async act')
      expect(console.error).toBeCalledWith('expected in rerender')
      expect(console.error).toBeCalledWith('expected in unmount')
      expect(console.error).toBeCalledTimes(7)
    } finally {
      console.error = consoleError
    }
  })
})
