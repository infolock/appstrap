const path = require('path')
const locateProjectRoot = require('./helpers/locate-project-root')
const ConfigFileNotFoundError = require('./errors/config/ConfigFileNotFoundError')
const ConfigFileMissingDataError = require('./errors/config/ConfigFileMissingDataError')
const fs = require('fs-extra')

class AppConfig {
  constructor ({configPath = './.appstrap', port = 5000}) {
    this.port = port
    this.projectRoot = locateProjectRoot()
    let {dir, base} = path.parse(path.resolve(this.projectRoot, configPath))
    this.configRoot = `${dir}${path.sep}${base}`
    this._load()
    this._validate()
    this._loadAppInfo()
  }

  async _load () {
    const filePath = `${this.configRoot}${path.sep}config.js`
    try {
      delete require.cache[require.resolve(filePath)]
      const configData = require(filePath)
      console.log(configData)
      for (let key in configData) {
        if (configData.hasOwnProperty(key)) {
          this[key] = configData[key]
        }
      }
    } catch (e) {
      throw new ConfigFileNotFoundError(e.message, filePath)
    }
  }

  _validate () {
    if (!this.bundle || !this.assets || !this.routes) {
      throw new ConfigFileMissingDataError()
    }
  }

  _loadAppInfo () {
    try {
      const {name, version} = require(path.resolve(`${this.projectRoot}${path.sep}package.json`))
      this.appName = name
      this.appVersion = version
    } catch (e) {}
  }

}

module.exports = AppConfig
