import {
  ReactHooksRenderer,
  ReactHooksServerRenderer,
  RenderHookOptions,
  RenderHookResult
} from '../../types/react'

type RendererResolvers = typeof rendererResolvers
type Renderer = keyof RendererResolvers
type InferredRenderer<TRenderers extends Renderer> = ReturnType<RendererResolvers[TRenderers]>

declare global {
  function runForRenderers<TRenderers extends Renderer>(
    renderers: TRenderers[],
    fn: (renderer: InferredRenderer<TRenderers>, rendererName: Renderer) => void
  ): void

  function runForLazyRenderers<TRenderer extends Renderer>(
    renderers: TRenderer[],
    fn: (getRenderer: () => InferredRenderer<TRenderer>, rendererName: Renderer) => void
  ): void
}

function requireRenderer<TRendererType extends ReactHooksRenderer = ReactHooksRenderer>(
  rendererName: Renderer
) {
  let requirePath = `../../${rendererName}`
  if (rendererName.startsWith('default')) {
    requirePath = requirePath.replace('/default', '')
  }
  /* eslint-disable @typescript-eslint/no-var-requires */
  return require(requirePath) as TRendererType
}

function hydratedServerRenderer(pure: boolean): ReactHooksRenderer {
  const { renderHook, ...otherImports } = requireRenderer<ReactHooksServerRenderer>(
    pure ? 'server/pure' : 'server'
  )

  return {
    renderHook<TProps, TResult>(
      callback: (props: TProps) => TResult,
      options?: RenderHookOptions<TProps>
    ): RenderHookResult<TProps, TResult> {
      const { hydrate, ...otherUtils } = renderHook<TProps, TResult>(callback, options)
      hydrate()
      return {
        ...otherUtils
      }
    },
    ...otherImports
  }
}

const rendererResolvers = {
  default: () => requireRenderer('default'),
  dom: () => requireRenderer('dom'),
  native: () => requireRenderer('native'),
  server: () => requireRenderer<ReactHooksServerRenderer>('server'),
  'default/pure': () => requireRenderer('default/pure'),
  'dom/pure': () => requireRenderer('default/pure'),
  'native/pure': () => requireRenderer('default/pure'),
  'server/pure': () => requireRenderer<ReactHooksServerRenderer>('server/pure'),
  'server/hydrated': () => hydratedServerRenderer(false),
  'server/hydrated/pure': () => hydratedServerRenderer(true)
}

global.runForRenderers = function runForRenderers<TRenderer extends Renderer>(
  renderers: TRenderer[],
  fn: (renderer: InferredRenderer<TRenderer>, rendererName: Renderer) => void
): void {
  runForLazyRenderers(renderers, (getRenderer, rendererName) => fn(getRenderer(), rendererName))
}

global.runForLazyRenderers = function runForLazyRenderers<TRenderer extends Renderer>(
  renderers: TRenderer[],
  fn: (getRenderer: () => InferredRenderer<TRenderer>, rendererName: Renderer) => void
): void {
  renderers.forEach((renderer) => {
    describe(renderer, () => {
      fn(() => rendererResolvers[renderer]() as InferredRenderer<TRenderer>, renderer)
    })
  })
}

export {}
