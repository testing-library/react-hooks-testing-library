/* eslint-disable @typescript-eslint/no-var-requires */
import { ReactHooksRenderer } from '../types/react'

describe('default renderer', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  test('should resolve native renderer as default renderer', () => {
    const expectedRenderer = require('../native/pure') as ReactHooksRenderer
    const actualRenderer = require('..') as ReactHooksRenderer

    expect(actualRenderer).toEqual(expectedRenderer)
  })

  test('should resolve dom renderer as default renderer', () => {
    jest.doMock('react-test-renderer', () => {
      throw new Error('missing dependency')
    })

    const expectedRenderer = require('../dom/pure') as ReactHooksRenderer
    const actualRenderer = require('..') as ReactHooksRenderer

    expect(actualRenderer).toEqual(expectedRenderer)
  })

  test('should throw error if a default renderer cannot be resolved', () => {
    jest.doMock('react-test-renderer', () => {
      throw new Error('missing dependency')
    })

    jest.doMock('react-dom', () => {
      throw new Error('missing dependency')
    })

    const expectedMessage =
      "Could not auto-detect a React renderer. Are you sure you've installed one of the following\n  - react-dom\n  - react-test-renderer\nIf you are using a bundler, please update your imports to use a specific renderer.\nFor instructions see: https://react-hooks-testing-library.com/installation#being-specific"

    expect(() => require('..')).toThrowError(new Error(expectedMessage))
  })
})
