const path = require('path')
const locateProjectRoot = require('./helpers/locate-project-root')

class AppConfig {
  constructor ({configPath = './.appstrap/config.js', port = 5000}) {
    this.port = port
    this.projectRoot = locateProjectRoot()
    let {dir, base} = path.parse(path.resolve(this.projectRoot, configPath))
    this.configRoot = `${dir}${path.sep}${base}`
    this._load()
    this._validate()
    this._loadAppInfo()
  }

  _load () {
    try {
      const configData = require(`${this.configRoot}${path.sep}config.js`)
      for (let key in configData) {
        if (configData.hasOwnProperty(key)) {
          this[key] = configData[key]
        }
      }
    } catch (e) {
      console.log(e)
      console.log(`
        Unable to load config file at ${this.configRoot}${path.sep}config.js
        Please provide a valid configuration file to proceed
      `)
      process.exit()
    }
  }

  _validate () {
    if (!this.bundle || !this.assets || !this.routes) {
      console.log(`
        You are missing crucial config data.  
        Please ensure bundle, assets, and routes are specified to proceed.
      `)
      process.exit()
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
