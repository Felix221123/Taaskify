import { Add } from './../src/server'

describe('Server.ts', () => {
  test('it should output 2', () => {
    expect(Add(1, 1)).toEqual(2)
  })
})
