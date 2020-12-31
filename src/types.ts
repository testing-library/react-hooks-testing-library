import { act as RTRAct } from 'react-test-renderer'
import { act as RDAct } from 'react-dom/test-utils'

/**
 *
 * Shared
 *
 */

export type ActTypes = typeof RTRAct | typeof RDAct

export interface WaitOptions {
  interval?: number
  timeout?: number
  suppressErrors?: boolean
}

export type WrapperComponent = React.ComponentType

/**
 *
 * pure
 *
 */

export interface ReactHooksRenderer {
  renderHook: <TProps, TResult>() => RenderHookReturn<TProps, TResult>
  act: ActTypes
  cleanup: {
    autoRegister: () => void
  }
}

export type RenderingEngineArray = Array<{ required: string; renderer: string }>

/**
 *
 * core/asyncUtils
 *
 */

export type AsyncUtilsReturn = {
  waitFor: (
    callback: () => boolean | void,
    { interval, timeout, suppressErrors }?: WaitOptions
  ) => Promise<void>
  waitForNextUpdate: ({ timeout }?: Pick<WaitOptions, 'timeout'>) => Promise<void>
  waitForValueToChange: (selector: () => unknown, options?: WaitOptions) => Promise<void>
}

/**
 *
 * core/index
 *
 */

export type RenderResult<TValue> = {
  readonly all: (TValue | Error | undefined)[]
  readonly current: TValue
  readonly error: Error | undefined
}

export type ResultContainerReturn<TValue> = {
  result: RenderResult<TValue>
  addResolver: (resolver: () => void) => void
  setValue: (val: TValue) => void
  setError: (error: Error) => void
}

export interface RenderHookOptions<TProps> {
  initialProps?: TProps
  wrapper?: WrapperComponent
}

export type RenderHookReturn<TProps, TValue> = {
  result: RenderResult<TValue>
  rerender: (props?: TProps) => void
  unmount: () => void
} & AsyncUtilsReturn

/**
 *
 * native/pure
 *
 */

export type NativeRendererReturn<TProps> = {
  render: (props?: TProps) => void
  rerender: (props?: TProps) => void
  unmount: () => void
  act: typeof RTRAct
}

export type NativeRendererOptions = {
  wrapper: WrapperComponent
}

export type TestHookProps<TProps, TResult> = {
  hookProps: TProps | undefined
  callback: (props: TProps) => TResult
  setError: (error: Error) => void
  setValue: (value: TResult) => void
}
