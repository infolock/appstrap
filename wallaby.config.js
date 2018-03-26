module.exports = function (wallaby) {
  return {
    files: [
      {pattern: 'interface/src/**/*.js'},
      {pattern: 'interface/src/**/*.spec.js', ignore: true},
      {pattern: 'lib/**/*.js'},
      {pattern: '_test/**/*.js'},
      {pattern: '_test/**/*.spec.js', ignore: true}
    ],

    tests: [
      {pattern: 'interface/src/**/*.spec.js'},
      {pattern: 'lib/**/*.spec.js'},
      {pattern: '_test/**/*.spec.js'}
    ],

    testFramework: 'jest',

    workers: {
      initial: 1,
      regular: 1
    },

    env: {
      type: 'node',
      runner: 'node'
    },

    compilers: {
      'interface/src/**/*.js': wallaby.compilers.babel(),
      '_test/**/*.js': wallaby.compilers.babel(),
      'lib/src/**/*.js': wallaby.compilers.babel()
    }
  }
}
