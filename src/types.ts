/**
 *
 * Shared
 *
 */

export type ActTypes = NativeModifedAct | ServerModifiedAct

export interface WaitOptions {
  interval?: number
  timeout?: number
  suppressErrors?: boolean
}

export type WrapperComponent<TProps> = React.ComponentType<TProps>

export type GenericRendererOptions<TProps> = {
  wrapper: WrapperComponent<TProps>
}

export type GenericRendererReturn<TProps> = {
  render: (props?: TProps) => void
  rerender: (props?: TProps) => void
  unmount: () => void
}

/**
 *
 * pure
 *
 */

export interface ReactHooksRenderer {
  renderHook: <TProps, TResult>() =>
    | RenderHookReturn<TProps, TResult>
    | ServerRenderHook<TProps, TResult>
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
  waitFor: (callback: () => boolean | void, opts?: WaitOptions) => Promise<void>
  waitForNextUpdate: (opts?: Pick<WaitOptions, 'timeout'>) => Promise<void>
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
  wrapper?: WrapperComponent<TProps>
}

export type RenderHookReturn<TProps, TValue> = {
  result: RenderResult<TValue>
} & Omit<GenericRendererReturn<TProps>, 'render'> &
  AsyncUtilsReturn

export type ServerRenderHook<TProps, TValue> = RenderHookReturn<TProps, TValue> & {
  hydrate: () => void
}

/**
 *
 * core/testHook
 *
 */

export type TestHookProps<TProps, TResult> = {
  hookProps: TProps | undefined
  callback: (props: TProps) => TResult
  setError: (error: Error) => void
  setValue: (value: TResult) => void
}

/**
 *
 * native/pure
 *
 */

export type NativeModifedAct = (callback: () => Promise<void | undefined>) => Promise<undefined>

export interface NativeRendererReturn<TProps> extends GenericRendererReturn<TProps> {
  act: NativeModifedAct
}

export type NativeRendererOptions<TProps> = GenericRendererOptions<TProps>

/**
 *
 * server/pure
 *
 */

export type ServerRendererOptions<TProps> = GenericRendererOptions<TProps>

export type ServerActCallbackAsync = () => Promise<void | undefined>

export type ServerActCallback = () => void | undefined

export type ServerModifiedAct = (
  cb: ServerActCallbackAsync | ServerActCallback
) => Promise<undefined> | void

export interface ServerRendererReturn<TProps> extends GenericRendererReturn<TProps> {
  act: ServerModifiedAct
  hydrate: () => void
}
