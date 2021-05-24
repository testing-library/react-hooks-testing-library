try {
  process.env.RHTL_DISABLE_ERROR_FILTERING = true
} catch {
  // falling back in the case that process.env.RHTL_DISABLE_ERROR_FILTERING cannot be accessed (e.g. browser environment)
  console.warn(
    'Could not disable error filtering as process.env.RHTL_DISABLE_ERROR_FILTERING could not be accessed.'
  )
}
