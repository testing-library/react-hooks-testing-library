class TimeoutError extends Error {
  timeout: number

  constructor(util: Function, timeout: number) {
    super(`Timed out in ${util.name} after ${timeout}ms.`)
    this.timeout = timeout
  }
}

export { TimeoutError }
