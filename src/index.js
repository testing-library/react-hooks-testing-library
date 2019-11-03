import { cleanup } from './pure'

// Automatically registers cleanup in supported testing frameworks
if (typeof afterEach === 'function' && !process.env.RHTL_SKIP_AUTO_CLEANUP) {
  afterEach(async () => {
    await cleanup()
  })
}

export * from './pure'
