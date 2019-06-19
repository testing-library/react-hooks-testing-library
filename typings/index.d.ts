export function renderHook<P, R>(
  callback: (props: P) => R,
  options?: {
    initialProps?: P,
    wrapper?: React.ComponentType
  }
): {
  readonly result: {
    readonly current: R,
    readonly error: Error
  }
  readonly waitForNextUpdate: () => Promise<void>
  readonly unmount: () => boolean
  readonly rerender: (hookProps?: P) => void
}

export function act(callback: () => void): void
