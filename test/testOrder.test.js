import React, { useRef, useEffect, useLayoutEffect, useCallback } from 'react'
import { create } from 'react-test-renderer'

const Child = ({ callback }) => {
  const value = callback()
  console.log(`child receiving ${value}`)
  return <div>{value}</div>
}

const Parent = ({ value }) => {
  const valueRef = useRef(value)
  console.log(`rendering ${value} (previously ${valueRef.current})`)
  // useLayoutEffect(() => {
  console.log(`updating ${valueRef.current} to ${value}`)
  valueRef.current = value
  // }, [value])
  const callback = useCallback(() => valueRef.current, [valueRef])

  return <Child callback={callback} />
}

it('this one', () => {
  const { update } = create(<Parent value="testing" />)
  update(<Parent value="testing 2" />)
})
