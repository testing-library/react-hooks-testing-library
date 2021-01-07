import { ComponentType } from 'react'

export type WrapperComponent<TProps> = ComponentType<TProps>

export type RendererOptions<TProps> = {
  wrapper?: WrapperComponent<TProps>
}
