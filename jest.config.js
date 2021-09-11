/** @typedef {import('ts-jest/dist/types')} */
/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  moduleDirectories: ['node_modules', 'src'],
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      diagnostics: false,
      isolatedModules: true,
    },
  },
}
