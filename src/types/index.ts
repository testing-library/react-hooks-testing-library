export interface ReactHooksRenderer {
  renderHook: <TProps, TResult>() => RenderHook<TProps, TResult>
  act: Act
  cleanup: () => void
  addCleanup: (callback: () => Promise<void> | void) => () => void
  removeCleanup: (callback: () => Promise<void> | void) => void
}

export type CreateRenderer<TProps, TResult, TOptions, TRenderer extends Renderer<TProps>> = (
  props: RendererProps<TProps, TResult>,
  options: TOptions
) => TRenderer

export type Renderer<TProps> = {
  render: (props?: TProps) => void
  rerender: (props?: TProps) => void
  unmount: () => void
  act: Act
}

export type RendererProps<TProps, TResult> = {
  callback: (props: TProps) => TResult
  setError: (error: Error) => void
  setValue: (value: TResult) => void
}

export type RenderResult<TValue> = {
  readonly all: (TValue | Error | undefined)[]
  readonly current: TValue
  readonly error?: Error
}

export type RendererUtils<TRenderer extends Renderer<never>> = Omit<
  TRenderer,
  keyof Renderer<never>
>

export interface WaitOptions {
  interval?: number
  timeout?: number
  suppressErrors?: boolean
}

export type AsyncUtils = {
  waitFor: (callback: () => boolean | void, opts?: WaitOptions) => Promise<void>
  waitForNextUpdate: (opts?: Pick<WaitOptions, 'timeout'>) => Promise<void>
  waitForValueToChange: (selector: () => unknown, options?: WaitOptions) => Promise<void>
}

export type RenderHook<TProps, TValue, TRenderer extends Renderer<TProps> = Renderer<TProps>> = {
  result: RenderResult<TValue>
} & Omit<Renderer<TProps>, 'render' | 'act'> &
  RendererUtils<TRenderer> &
  AsyncUtils

export interface Act {
  (callback: () => void | undefined): void
  (callback: () => Promise<void | undefined>): Promise<undefined>
}
