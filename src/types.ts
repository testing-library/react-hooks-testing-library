/**
 *
 * Shared
 *
 */

export interface Act {
  (callback: () => void | undefined): void
  (callback: () => Promise<void | undefined>): Promise<undefined>
}

export interface WaitOptions {
  interval?: number
  timeout?: number
  suppressErrors?: boolean
}

export type WrapperComponent<TProps> = React.ComponentType<TProps>

export type RendererOptions<TProps> = {
  wrapper: WrapperComponent<TProps>
}

export type Renderer<TProps> = {
  render: (props?: TProps) => void
  rerender: (props?: TProps) => void
  unmount: () => void
  act: Act
}

/**
 *
 * pure
 *
 */

export interface ReactHooksRenderer {
  renderHook: <TProps, TResult>() => RenderHookReturn<TProps, TResult>
  act: Act
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

export type CreateRenderer = <TProps, TResult>(
  props: Omit<TestHookProps<TProps, TResult>, 'hookProps'>,
  options: RendererOptions<TProps>
) => Renderer<TProps>

export type RendererUtils<TRenderer extends Renderer<never>> = Omit<
  TRenderer,
  keyof Renderer<never>
>

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
} & Omit<Renderer<TProps>, 'render' | 'act'> &
  AsyncUtilsReturn

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
 * server/pure
 *
 */

export interface ServerRenderer<TProps> extends Renderer<TProps> {
  hydrate: () => void
}
