/*eslint no-undef: "error"*/
/*global module  */

/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': ['ts-jest', {}],
  },
  setupFilesAfterEnv:['./setupTest.ts'],
  testMatch: ['**/__tests__/**/*.test.ts'],
}
