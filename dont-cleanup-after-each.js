try {
  process.env.RHTL_SKIP_AUTO_CLEANUP = true
} catch {
  // falling back in the case that process.env.RHTL_SKIP_AUTO_CLEANUP cannot be accessed (e.g. browser environment)
  console.warn(
    'Could not skip auto cleanup as process.env.RHTL_SKIP_AUTO_CLEANUP could not be accessed.'
  )
}
