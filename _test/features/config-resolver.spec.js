const createSampleConfig = require('../helpers/create-sample-config')
const getProjectRoot = require('../../lib/src/helpers/locate-project-root')
const fs = require('fs-extra')
const path = require('path')
const Appstrap = require('../../lib/src/Appstrap')

describe('Configuration resolver', () => {
  describe('CLI', () => {
    describe('using default configuration', function () {
      this.dir = `${getProjectRoot()}${path.sep}.appstrap`
      describe('valid configuration', () => {
        test('Loading app config should not throw', async () => {
          expect.assertions(4)
          await createSampleConfig(this.dir)
          expect(await fs.exists(`${this.dir}${path.sep}config.js`)).toBe(true)
          expect(await fs.exists(`${this.dir}${path.sep}assets`)).toBe(true)
          expect(await fs.exists(`${this.dir}${path.sep}assets/bundle.js`)).toBe(true)
          try {
            const server = new Appstrap({invokedFromCLI: true})
            expect(server).toBeDefined()
          } catch (e) {
            console.log(e)
          }
          await fs.remove(this.dir)
        })
      })
      describe('invalid configuration', () => {
        test('Loading app config should throw', async () => {
          expect.assertions(2)
          expect(await fs.exists(`${this.dir}${path.sep}config.js`)).toBe(false)
          try {
            const server = new Appstrap({invokedFromCLI: true})
          } catch (e) {
            expect(e).toBeDefined()
          }
        })
      })
    })
    describe('with -c --config specified', () => {

    })
  })
})