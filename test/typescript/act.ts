import { act } from '@testing-library/react-hooks'

function checkTypesWithUndefinedResult() {
  const callback = () => undefined;
  act(callback)
}

function checkTypesWithVoidResult() {
  const callback = () => {};
  act(callback)
}
