class ConfigFileMissingDataError extends Error {
  constructor () {
    super(`
      You are missing crucial config data.  
      Please ensure bundle, assets, and routes are specified to proceed.
    `, 500)
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = ConfigFileMissingDataError