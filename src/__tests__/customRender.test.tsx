import React, { useRef } from 'react'

describe('custom render tests', () => {
  function useDomRef() {
    const domRef = useRef<HTMLElement>()
    const refCallback = (el: HTMLElement | null) => {
      if (el) {
        domRef.current = el
      }
    }

    return { refCallback, domRef }
  }

  runForRenderers(['default', 'dom', 'native', 'server/hydrated'], ({ renderHook }) => {
    test("custom render won't throw error", () => {
      const TestComponent = (props: ReturnType<typeof useDomRef>) => {
        return <div ref={props.refCallback}>1</div>
      }
      expect(() => {
        renderHook(() => useDomRef(), {
          customRender: TestComponent
        })
      }).not.toThrow()

      // console.log(rendererName, result.current.domRef)
    })
  })
  runForRenderers(['dom'], ({ renderHook }) => {
    test('custom render will get a dom ref', () => {
      const TestComponent = (props: ReturnType<typeof useDomRef>) => {
        return <div ref={props.refCallback}>1</div>
      }
      const { result } = renderHook(() => useDomRef(), {
        customRender: TestComponent
      })
      expect(result.current.domRef.current).toBeDefined()
    })
  })
})
