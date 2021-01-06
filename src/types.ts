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

export type ReactRendererOptions<TProps> = {
  wrapper?: WrapperComponent<TProps>
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
  cleanup: () => void
  addCleanup: (callback: () => Promise<void> | void) => () => void
  removeCleanup: (callback: () => Promise<void> | void) => void
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

export type RendererProps<TProps, TResult> = {
  callback: (props: TProps) => TResult
  setError: (error: Error) => void
  setValue: (value: TResult) => void
}

export type CreateRenderer<TProps, TResult, TOptions, TRenderer extends Renderer<TProps>> = (
  props: RendererProps<TProps, TResult>,
  options: TOptions
) => TRenderer

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

export type RenderHookOptions<TProps, TOptions extends {}> = TOptions & {
  initialProps?: TProps
}

export type RenderHookReturn<
  TProps,
  TValue,
  TRenderer extends Renderer<TProps> = Renderer<TProps>
> = {
  result: RenderResult<TValue>
} & Omit<Renderer<TProps>, 'render' | 'act'> &
  RendererUtils<TRenderer> &
  AsyncUtilsReturn

/**
 *
 * core/testHook
 *
 */

export type TestHookProps<TProps, TResult> = RendererProps<TProps, TResult> & {
  hookProps: TProps | undefined
}

/**
 *
 * server/pure
 *
 */

export interface ServerRenderer<TProps> extends Renderer<TProps> {
  hydrate: () => void
}
