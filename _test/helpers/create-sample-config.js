const fs = require('fs-extra')

async function createSampleConfig (dir) {
  await fs.ensureDir(dir)
  await fs.copy(`./_test/helpers/_sampleConfig`, dir)
}

module.exports = createSampleConfig
