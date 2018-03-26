class ConfigFileNotFoundError extends Error {
  constructor (message, filePath) {
    super(`
      Unable to load config file at ${filePath}
      Please provide a valid configuration file to proceed
    `, 500)
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = ConfigFileNotFoundError