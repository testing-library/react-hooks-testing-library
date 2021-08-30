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

// This render turns the `server` renderer into a client renderer as many of the tests only
// require hydration after the hook is renderer to be able to be reused for all the renderers
function hydratedServerRenderer(baseRenderer: 'server' | 'server/pure'): ReactHooksRenderer {
  const { renderHook, ...otherImports } = requireRenderer<ReactHooksServerRenderer>(baseRenderer)

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
  'dom/pure': () => requireRenderer('dom/pure'),
  'native/pure': () => requireRenderer('native/pure'),
  'server/pure': () => requireRenderer<ReactHooksServerRenderer>('server/pure'),
  'server/hydrated': () => hydratedServerRenderer('server'),
  'server/hydrated/pure': () => hydratedServerRenderer('server/pure')
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
    // eslint-disable-next-line jest/valid-title
    describe(renderer, () => {
      fn(() => rendererResolvers[renderer]() as InferredRenderer<TRenderer>, renderer)
    })
  })
}

export {}
