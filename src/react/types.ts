import { RendererProps } from 'types'

export type WrapperComponent<TProps> = React.ComponentType<TProps>

export type ReactRendererOptions<TProps> = {
  wrapper?: WrapperComponent<TProps>
}

export type TestHookProps<TProps, TResult> = RendererProps<TProps, TResult> & {
  hookProps: TProps | undefined
}
