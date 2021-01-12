class TimeoutError extends Error {
  constructor(util: Function, timeout: number) {
    super(`Timed out in ${util.name} after ${timeout}ms.`)
  }
}

export { TimeoutError }
