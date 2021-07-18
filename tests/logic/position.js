const Position = require('../../logic/position')

describe('position', () => {
  it('isValid', () => {
    expect(Position.isValid('a2')).toBeTruthy()
    expect(Position.isValid('x2')).toBeFalsy()
    expect(Position.isValid('a9')).toBeFalsy()
    expect(Position.isValid()).toBeFalsy()
  })

  it('parse and stringify', () => {
    const expected = 'a2'
    expect(Position.stringify(Position.parse(expected))).toEqual(expected)
  })

  it('relativeTo valid', () => {
    let start = Position.parse('a2')
    let end = Position.relativeTo(start, 2, 2)
    expect(end).toBeDefined()
    expect(Position.stringify(end)).toEqual('c4')

    start = Position.parse('c2')
    end = Position.relativeTo(start, -2, 2)
    expect(end).toBeDefined()
    expect(Position.stringify(end)).toEqual('a4')

    start = Position.parse('c4')
    end = Position.relativeTo(start, -2, -2)
    expect(end).toBeDefined()
    expect(Position.stringify(end)).toEqual('a2')

    start = Position.parse('a4')
    end = Position.relativeTo(start, 2, -2)
    expect(end).toBeDefined()
    expect(Position.stringify(end)).toEqual('c2')
  })

  it('relativeTo below min rank', () => {
    const start = Position.parse('a2')
    const end = Position.relativeTo(start, 0, -2)
    expect(end).toBeNull()
  })

  it('relativeTo above max rank', () => {
    const start = Position.parse('a7')
    const end = Position.relativeTo(start, 0, 2)
    expect(end).toBeNull()
  })

  it('relativeTo below min file', () => {
    const start = Position.parse('a2')
    const end = Position.relativeTo(start, -1, 0)
    expect(end).toBeNull()
  })

  it('relativeTo above max rank', () => {
    const start = Position.parse('h2')
    const end = Position.relativeTo(start, 1, 0)
    expect(end).toBeNull()
  })
})
