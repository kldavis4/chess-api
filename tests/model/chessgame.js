const ChessGame = require('../../model/chessgame')
const { WHITE, BLACK, ROOK } = require('../../constants')

describe('game', () => {
  let game
  beforeEach(() => {
    game = new ChessGame()
  })

  it('initializes', () => {
    expect(game).toBeDefined()
    expect(game.turn).toEqual(WHITE)
    expect(game.board).toBeDefined()
    expect(game.captured).toBeDefined()
  })

  describe('WHITE pawn movement', () => {
    beforeEach(() => {
      game = new ChessGame()
    })

    it('initial move', () => {
      expect(game.move(WHITE, 'a2', 'a4')).toBeFalsy()
    })

    it('move', () => {
      expect(game.move(WHITE, 'a2', 'a3')).toBeFalsy()
    })

    it('captures pawn', () => {
      game.move(BLACK, 'b7', 'b3', true)

      expect(game.move(WHITE, 'a2', 'b3')).toBeFalsy()
    })

    it('invalid position', () => {
      src = 'a2'
      dst = 'a5'
      expected = `${src} -> ${dst} is not a valid move for ${WHITE}`
      expect(game.move(WHITE, 'a2', 'a5')).toEqual(expected)
    })

    it('invalid turn', () => {
      expect(game.move(BLACK, src, dst)).toEqual(`It is ${WHITE}'s turn`)
    })

    it('invalid player', () => {
      game.turn = BLACK
      src = 'a2'
      dst = 'a3'
      expected = `${src} -> ${dst} is not a valid move for ${BLACK}`
      expect(game.move(BLACK, src, dst)).toEqual(expected)
    })

    it('no piece', () => {
      src = 'a3'
      expect(game.move(WHITE, src, 'a4')).toEqual(`Invalid piece: ${src}`)
    })
  })

  describe('BLACK pawn movement', () => {
    beforeEach(() => {
      game = new ChessGame()
    })

    it('initial move', () => {
      game.turn = BLACK
      expect(game.move(BLACK, 'a7', 'a5')).toBeFalsy()
    })

    it('move', () => {
      game.turn = BLACK
      expect(game.move(BLACK, 'a7', 'a6')).toBeFalsy()
    })

    it('captures pawn', () => {
      game.move(WHITE, 'a2', 'a6', true)
      game.turn = BLACK

      expect(game.move(BLACK, 'b7', 'b6')).toBeFalsy()
    })

    it('invalid position', () => {
      game.turn = BLACK
      src = 'a7'
      dst = 'a4'
      expected = `${src} -> ${dst} is not a valid move for ${BLACK}`
      expect(game.move(BLACK, src, dst)).toEqual(expected)
    })

    it('invalid turn', () => {
      game.turn = BLACK
      expect(game.move(WHITE, 'a7', 'a6')).toEqual(`It is ${BLACK}'s turn`)
    })

    it('invalid player', () => {
      src = 'a7'
      dst = 'a4'
      expected = `${src} -> ${dst} is not a valid move for ${WHITE}`
      expect(game.move(WHITE, src, dst)).toEqual(expected)
    })

    it('no piece', () => {
      game.turn = BLACK
      src = 'a3'
      expect(game.move(BLACK, src, 'a4')).toEqual(`Invalid piece: ${src}`)
    })
  })

  describe('WHITE rook available moves', () => {
    beforeEach(() => {
      game = new ChessGame()
    })

    it('rook move throws exception', () => {
      expect(() => {
        game.availableMoves('a1')
      }).toThrow(`${ROOK} Not Implemented`)
    })
  })

  describe('WHITE pawn available moves', () => {
    beforeEach(() => {
      game = new ChessGame()
    })

    it('initial move', () => {
      const moves = game.availableMoves('a2')
      expect(Object.keys(moves).length).toEqual(2)
      expect(moves).toHaveProperty('a3')
      expect(moves['a3'].captured).toBeFalsy()
      expect(moves).toHaveProperty('a4')
      expect(moves['a4'].captured).toBeFalsy()
    })

    it('initial attack right', () => {
      game.move(BLACK, 'b7', 'b3', true)

      const moves = game.availableMoves('a2')
      expect(Object.keys(moves).length).toEqual(3)
      expect(moves).toHaveProperty('a3')
      expect(moves['a3'].capture).toBeFalsy()
      expect(moves).toHaveProperty('a4')
      expect(moves['a4'].capture).toBeFalsy()
      expect(moves).toHaveProperty('b3')
      expect(moves['b3'].capture).toBeTruthy()
    })

    it('initial attack left', () => {
      game.move(BLACK, 'a7', 'a3', true)

      const moves = game.availableMoves('b2')
      expect(Object.keys(moves).length).toEqual(3)
      expect(moves).toHaveProperty('b3')
      expect(moves['b3'].capture).toBeFalsy()
      expect(moves).toHaveProperty('b4')
      expect(moves['b4'].capture).toBeFalsy()
      expect(moves).toHaveProperty('a3')
      expect(moves['a3'].capture).toBeTruthy()
    })

    it('initial attack left and right', () => {
      game.move(BLACK, 'a7', 'a3', true)
      game.move(BLACK, 'c7', 'c3', true)

      const moves = game.availableMoves('b2')
      expect(Object.keys(moves).length).toEqual(4)
      expect(moves).toHaveProperty('b3')
      expect(moves['b3'].capture).toBeFalsy()
      expect(moves).toHaveProperty('b4')
      expect(moves['b4'].capture).toBeFalsy()
      expect(moves).toHaveProperty('a3')
      expect(moves['a3'].capture).toBeTruthy()
      expect(moves).toHaveProperty('c3')
      expect(moves['c3'].capture).toBeTruthy()
    })

    it('attack right', () => {
      game.move(BLACK, 'b7', 'b4', true)
      game.move(WHITE, 'a2', 'a3', true)

      const moves = game.availableMoves('a3')
      expect(Object.keys(moves).length).toEqual(2)
      expect(moves).toHaveProperty('a4')
      expect(moves['a4'].capture).toBeFalsy()
      expect(moves).toHaveProperty('b4')
      expect(moves['b4'].capture).toBeTruthy()
    })

    it('attack left', () => {
      game.move(BLACK, 'a7', 'a4', true)
      game.move(WHITE, 'b2', 'b3', true)

      const moves = game.availableMoves('b3')
      expect(Object.keys(moves).length).toEqual(2)
      expect(moves).toHaveProperty('b4')
      expect(moves['b4'].capture).toBeFalsy()
      expect(moves).toHaveProperty('a4')
      expect(moves['a4'].capture).toBeTruthy()
    })

    it('attack left and right', () => {
      game.move(BLACK, 'a7', 'a4', true)
      game.move(BLACK, 'c7', 'c4', true)
      game.move(WHITE, 'b2', 'b3', true)

      const moves = game.availableMoves('b3')
      expect(Object.keys(moves).length).toEqual(3)
      expect(moves).toHaveProperty('b4')
      expect(moves['b4'].capture).toBeFalsy()
      expect(moves).toHaveProperty('a4')
      expect(moves['a4'].capture).toBeTruthy()
      expect(moves).toHaveProperty('c4')
      expect(moves['c4'].capture).toBeTruthy()
    })

    it('initial blocked by WHITE zero moves', () => {
      game.move(WHITE, 'b2', 'a3', true)

      const moves = game.availableMoves('a2')
      expect(Object.keys(moves).length).toEqual(0)
    })

    it('initial blocked by WHITE one move', () => {
      game.move(WHITE, 'b2', 'a4', true)

      const moves = game.availableMoves('a2')
      expect(Object.keys(moves).length).toEqual(1)
      expect(moves).toHaveProperty('a3')
      expect(moves['a3'].capture).toBeFalsy()
    })

    it('initial blocked by BLACK zero moves', () => {
      game.move(BLACK, 'b7', 'a3', true)

      const moves = game.availableMoves('a2')
      expect(Object.keys(moves).length).toEqual(0)
    })

    it('initial blocked by BLACK one move', () => {
      game.move(BLACK, 'b7', 'a4', true)

      const moves = game.availableMoves('a2')
      expect(Object.keys(moves).length).toEqual(1)
      expect(moves).toHaveProperty('a3')
      expect(moves['a3'].capture).toBeFalsy()
    })

    it('invalid piece', () => {
      const moves = game.availableMoves('a3')
      expect(Object.keys(moves).length).toEqual(0)
    })
  })

  describe('BLACK pawn available moves', () => {
    beforeEach(() => {
      game = new ChessGame()
    })

    it('initial move', () => {
      const moves = game.availableMoves('a7')
      expect(Object.keys(moves).length).toEqual(2)
      expect(moves).toHaveProperty('a6')
      expect(moves['a6'].capture).toBeFalsy()
      expect(moves).toHaveProperty('a5')
      expect(moves['a5'].capture).toBeFalsy()
    })

    it('initial attack left', () => {
      game.move(WHITE, 'b2', 'b6', true)

      const moves = game.availableMoves('a7')
      expect(Object.keys(moves).length).toEqual(3)
      expect(moves).toHaveProperty('a6')
      expect(moves['a6'].capture).toBeFalsy()
      expect(moves).toHaveProperty('a5')
      expect(moves['a5'].capture).toBeFalsy()
      expect(moves).toHaveProperty('b6')
      expect(moves['b6'].capture).toBeTruthy()
    })

    it('initial attack right', () => {
      game.move(WHITE, 'a2', 'a6', true)

      const moves = game.availableMoves('b7')
      expect(Object.keys(moves).length).toEqual(3)
      expect(moves).toHaveProperty('b6')
      expect(moves['b6'].capture).toBeFalsy()
      expect(moves).toHaveProperty('b5')
      expect(moves['b5'].capture).toBeFalsy()
      expect(moves).toHaveProperty('a6')
      expect(moves['a6'].capture).toBeTruthy()
    })

    it('initial attack left and right', () => {
      game.move(WHITE, 'a2', 'a6', true)
      game.move(WHITE, 'c2', 'c6', true)

      const moves = game.availableMoves('b7')
      expect(Object.keys(moves).length).toEqual(4)
      expect(moves).toHaveProperty('b6')
      expect(moves['b6'].capture).toBeFalsy()
      expect(moves).toHaveProperty('b5')
      expect(moves['b5'].capture).toBeFalsy()
      expect(moves).toHaveProperty('a6')
      expect(moves['a6'].capture).toBeTruthy()
      expect(moves).toHaveProperty('c6')
      expect(moves['c6'].capture).toBeTruthy()
    })

    it('attack left', () => {
      game.move(WHITE, 'b2', 'b5', true)
      game.move(BLACK, 'a7', 'a6', true)

      const moves = game.availableMoves('a6')
      expect(Object.keys(moves).length).toEqual(2)
      expect(moves).toHaveProperty('a5')
      expect(moves['a5'].capture).toBeFalsy()
      expect(moves).toHaveProperty('b5')
      expect(moves['b5'].capture).toBeTruthy()
    })

    it('attack right', () => {
      game.move(WHITE, 'a2', 'a5', true)
      game.move(BLACK, 'b7', 'b6', true)

      const moves = game.availableMoves('b6')
      expect(Object.keys(moves).length).toEqual(2)
      expect(moves).toHaveProperty('b5')
      expect(moves['b5'].capture).toBeFalsy()
      expect(moves).toHaveProperty('a5')
      expect(moves['a5'].capture).toBeTruthy()
    })

    it('attack left and right', () => {
      game.move(WHITE, 'a2', 'a5', true)
      game.move(WHITE, 'c2', 'c5', true)
      game.move(BLACK, 'b7', 'b6', true)

      const moves = game.availableMoves('b6')
      expect(Object.keys(moves).length).toEqual(3)
      expect(moves).toHaveProperty('b5')
      expect(moves['b5'].capture).toBeFalsy()
      expect(moves).toHaveProperty('a5')
      expect(moves['a5'].capture).toBeTruthy()
      expect(moves).toHaveProperty('c5')
      expect(moves['c5'].capture).toBeTruthy()
    })

    it('initial blocked by BLACK zero moves', () => {
      game.move(BLACK, 'b7', 'a6', true)

      const moves = game.availableMoves('a7')
      expect(Object.keys(moves).length).toEqual(0)
    })

    it('initial blocked by BLACK one move', () => {
      game.move(BLACK, 'b7', 'a5', true)

      const moves = game.availableMoves('a7')
      expect(Object.keys(moves).length).toEqual(1)
      expect(moves).toHaveProperty('a6')
      expect(moves['a6'].capture).toBeFalsy()
    })

    it('initial blocked by WHITE zero moves', () => {
      game.move(WHITE, 'b2', 'a6', true)

      const moves = game.availableMoves('a7')
      expect(Object.keys(moves).length).toEqual(0)
    })

    it('initial blocked by WHITE one move', () => {
      game.move(WHITE, 'b2', 'a5', true)

      const moves = game.availableMoves('a7')
      expect(Object.keys(moves).length).toEqual(1)
      expect(moves).toHaveProperty('a6')
      expect(moves['a6'].capture).toBeFalsy()
    })
  })
})
