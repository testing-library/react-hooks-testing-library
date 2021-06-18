import * as actualRenderer from '..'
import * as expectedRenderer from '../native'

describe('default renderer', () => {
  test('should resolve native renderer as default renderer', () => {
    expect(actualRenderer).toEqual(expectedRenderer)
  })
})
