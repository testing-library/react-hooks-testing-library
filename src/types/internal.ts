import { Renderer, RendererProps, RenderResult } from '.'

export type CreateRenderer<TProps, TResult, TOptions, TRenderer extends Renderer<TProps>> = (
  props: RendererProps<TProps, TResult>,
  options: TOptions
) => TRenderer

export type ResultContainer<TValue> = {
  result: RenderResult<TValue>
  addResolver: (resolver: () => void) => void
  setValue: (val: TValue) => void
  setError: (error: Error) => void
}

export type RenderHookOptions<TProps, TOptions extends {}> = TOptions & {
  initialProps?: TProps
}
