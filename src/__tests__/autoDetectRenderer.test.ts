/* eslint-disable @typescript-eslint/no-var-requires */
import { ReactHooksRenderer } from '../types/react'

describe('auto-detect renderer', () => {
  function setUpDependencies({
    reactTestRenderer,
    reactDom
  }: {
    reactTestRenderer?: boolean
    reactDom?: boolean
  }) {
    jest.resetModules()
    jest.unmock('react-test-renderer')
    jest.unmock('react-dom')

    if (!reactTestRenderer) {
      jest.doMock('react-test-renderer', () => require('missing-dependency'))
    }

    if (!reactDom) {
      jest.doMock('react-dom', () => require('missing-dependency'))
    }
  }

  runForLazyRenderers(['default', 'default/pure'], (getRenderer, rendererName) => {
    describe('react-test-renderer available', () => {
      setUpDependencies({ reactTestRenderer: true, reactDom: true })

      const actualRenderer = getRenderer()
      const expectedRenderer = require(rendererName.includes('pure')
        ? '../native/pure'
        : '../native') as ReactHooksRenderer

      test('should resolve native renderer as default renderer', () => {
        expect(actualRenderer).toEqual(expectedRenderer)
      })
    })

    describe('react-dom available', () => {
      setUpDependencies({ reactTestRenderer: false, reactDom: true })

      const actualRenderer = getRenderer()
      const expectedRenderer = require(rendererName.includes('pure')
        ? '../dom/pure'
        : '../dom') as ReactHooksRenderer

      test('should resolve dom renderer as default renderer', () => {
        expect(actualRenderer).toEqual(expectedRenderer)
      })
    })

    describe('no renderers available', () => {
      setUpDependencies({ reactTestRenderer: false, reactDom: false })

      test('should throw error if a default renderer cannot be resolved', () => {
        jest.doMock('react-test-renderer', () => {
          throw new Error('missing dependency')
        })
        jest.doMock('react-dom', () => {
          throw new Error('missing dependency')
        })

        const expectedMessage =
          "Could not auto-detect a React renderer. Are you sure you've installed one of the following\n  - react-dom\n  - react-test-renderer\nIf you are using a bundler, please update your imports to use a specific renderer.\nFor instructions see: https://react-hooks-testing-library.com/installation#being-specific"

        expect(() => getRenderer()).toThrowError(new Error(expectedMessage))
      })
    })
  })
})
