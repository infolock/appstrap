const http = require('http')
const ServerConfig = require('./ServerConfig')
const path = require('path')
const Store = require('./store')
const Net = require('net')
const openport = require('openport')

class Appstrap {
  constructor ({configPath, port, invokedFromCLI = false} = {}) {
    this.store = new Store()
    this.store.dispatch({type: 'LOAD_CONFIG', configPath, port})
    this.store.dispatch({type: 'SET_DEFAULTS'})
    let { app } = new ServerConfig(invokedFromCLI, this.store)
    this.server = http.createServer(app)
  }

  async start () {
    await this._ensurePortIsOpen()
    const { config } = this.store.getState()
    this.host = `http://localhost:${config.port}`
    return new Promise(resolve => {
      this.server.listen(config.port, () => {
        console.log(`Listening on port : ${config.port}`)
        resolve()
      })
    })
  }

  _ensurePortIsOpen() {
    return new Promise((resolve, reject) => {
      const { config } = this.store.getState()
      isPortTaken(config.port)
      .then(portIsOpen => {
        if (!portIsOpen) {
          openport.find((err, port) => {
            this.store.dispatch({type: 'OVERRIDE_CONFIG_PORT', port})
            resolve()
          })
        } else {
          resolve()
        }
      })
      .catch(reject)
    })
  }

  reset () {
    this.store.dispatch({type: 'SET_DEFAULTS'})
  }

  async stop () {
    await this.server.close()
  }

  setModifier (endpoint, method, data) {
    this.store.dispatch({type: 'SET_MODIFIER_DATA', endpoint, method, data})
  }

  loadPreset (presetName) {
    const { config } = this.store.getState()
    try {
      const { data } = require(path.resolve(config.configRoot, 'presets', presetName))
      this.store.dispatch({type: 'SET_ROUTE_DATA', routeData: data})
    } catch (e) {
      throw('failed to load preset')
    }
  }

  loadPresets (presetArray) {
    const { config } = this.store.getState()
    try {
      const combinedPresetData = presetArray.reduce((dataObj, nextFileName) => {
        const mergeData = require(path.resolve(config.configRoot, 'presets', nextFileName))
        return Object.assign(dataObj, mergeData.data)
      }, {})
      this.store.dispatch({type: 'SET_ROUTE_DATA', routeData: combinedPresetData})
    } catch (e) {
      throw('failed to load presets')
    }
  }

}

const isPortTaken = (port) => new Promise((resolve, reject) => {
  const tester = Net.createServer()
    .once('error', err => (err.code == 'EADDRINUSE' ? resolve(false) : reject(err)))
    .once('listening', () => tester.once('close', () => resolve(true)).close())
    .listen(port)
})

module.exports = Appstrap
