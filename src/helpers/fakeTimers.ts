export const fakeTimersAreEnabled = () => {
  /* istanbul ignore else */
  if (typeof jest !== 'undefined' && jest !== null) {
    return (
      // legacy timers
      jest.isMockFunction(setTimeout) ||
      // modern timers
      Object.prototype.hasOwnProperty.call(setTimeout, 'clock')
    )
  }
  // istanbul ignore next
  return false
}

export function advanceTimers(checkComplete: () => boolean) {
  const advanceTime = async () => {
    if (!checkComplete()) {
      jest.advanceTimersByTime(1)
      await Promise.resolve()
      await advanceTime()
    }
  }
  return advanceTime()
}
