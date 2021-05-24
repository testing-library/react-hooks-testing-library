export type Renderer<TProps> = {
  render: (props?: TProps) => void
  rerender: (props?: TProps) => void
  unmount: () => void
  act: Act
}

export type ServerRenderer<TProps> = Renderer<TProps> & {
  hydrate: () => void
}

export type RendererProps<TProps, TResult> = {
  callback: (props: TProps) => TResult
  setError: (error: Error) => void
  setValue: (value: TResult) => void
}

export type CreateRenderer<
  TProps,
  TResult,
  TRendererOptions extends object,
  TRenderer extends Renderer<TProps>
> = (props: RendererProps<TProps, TResult>, options: TRendererOptions) => TRenderer

export type RenderResult<TValue> = {
  readonly all: Array<TValue | Error>
  readonly current: TValue
  readonly error?: Error
}

export type ResultContainer<TValue> = {
  result: RenderResult<TValue>
}

export type WaitOptions = {
  interval?: number | false
  timeout?: number | false
}

export type WaitForOptions = WaitOptions
export type WaitForValueToChangeOptions = WaitOptions
export type WaitForNextUpdateOptions = Pick<WaitOptions, 'timeout'>

export type WaitFor = (callback: () => boolean | void, options?: WaitForOptions) => Promise<void>
export type WaitForValueToChange = (
  selector: () => unknown,
  options?: WaitForValueToChangeOptions
) => Promise<void>
export type WaitForNextUpdate = (options?: WaitForNextUpdateOptions) => Promise<void>

export type AsyncUtils = {
  waitFor: WaitFor
  waitForValueToChange: WaitForValueToChange
  waitForNextUpdate: WaitForNextUpdate
}

export type RenderHookResult<
  TProps,
  TValue,
  TRenderer extends Renderer<TProps> = Renderer<TProps>
> = ResultContainer<TValue> &
  Omit<Renderer<TProps>, 'render' | 'act'> &
  Omit<TRenderer, keyof Renderer<TProps>> &
  AsyncUtils

export type ServerRenderHookResult<
  TProps,
  TValue,
  TRenderer extends ServerRenderer<TProps> = ServerRenderer<TProps>
> = RenderHookResult<TProps, TValue, TRenderer>

export type RenderHookOptions<TProps> = {
  initialProps?: TProps
}

export type Act = {
  (callback: () => Promise<void | undefined>): Promise<undefined>
  (callback: () => void | undefined): void
}

export type CleanupCallback = () => Promise<void> | void
