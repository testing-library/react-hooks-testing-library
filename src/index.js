import createContext from './createContext'
import useHookAdvanced from './useHookAdvanced'

export { cleanup } from 'react-testing-library'

export const useHook = (hook) => useHookAdvanced(hook, createContext())
