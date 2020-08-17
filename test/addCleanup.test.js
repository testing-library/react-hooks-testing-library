import { useEffect } from 'react'
import { renderHook, addCleanup } from 'src'

let callSequence = []
addCleanup(() => {
  callSequence.push('cleanup')
})
addCleanup(() => {
  callSequence.push('another cleanup')
})

describe('addCleanup tests', () => {
  test('first', () => {
    const hookWithCleanup = () => {
      useEffect(() => {
        return () => {
          callSequence.push('unmount')
        }
      })
    }
    renderHook(() => hookWithCleanup())
  })

  test('second', () => {
    expect(callSequence).toEqual(['unmount', 'cleanup', 'another cleanup'])
  })
})
