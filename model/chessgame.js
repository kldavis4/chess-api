const mongoose = require('mongoose')
const Position = require('../logic/position')

const { availableMoves } = require('../logic/chesspiece')
const {
  BLACK,
  WHITE,
  PAWN,
  ROOK,
  KNIGHT,
  BISHOP,
  QUEEN,
  KING,
} = require('../constants')

const defaultBoard = () => {
  board = Position.FILES.reduce((result, file) => {
    result[file] = Position.RANKS.reduce((ranks, rank) => {
      ranks[rank] = null
      return ranks
    }, {})
    return result
  }, {})

  for (const file of Position.FILES) {
    // Pawns
    board[file]['2'] = { type: PAWN, player: WHITE, moves: 0 }
    board[file]['7'] = { type: PAWN, player: BLACK, moves: 0 }
  }

  board['a']['1'] = { type: ROOK, player: WHITE, moves: 0 }
  board['b']['1'] = { type: KNIGHT, player: WHITE, moves: 0 }
  board['c']['1'] = { type: BISHOP, player: WHITE, moves: 0 }
  board['d']['1'] = { type: QUEEN, player: WHITE, moves: 0 }
  board['e']['1'] = { type: KING, player: WHITE, moves: 0 }
  board['f']['1'] = { type: BISHOP, player: WHITE, moves: 0 }
  board['g']['1'] = { type: KNIGHT, player: WHITE, moves: 0 }
  board['h']['1'] = { type: ROOK, player: WHITE, moves: 0 }

  board['a']['8'] = { type: ROOK, player: BLACK, moves: 0 }
  board['b']['8'] = { type: KNIGHT, player: BLACK, moves: 0 }
  board['c']['8'] = { type: BISHOP, player: BLACK, moves: 0 }
  board['d']['8'] = { type: QUEEN, player: BLACK, moves: 0 }
  board['e']['8'] = { type: KING, player: BLACK, moves: 0 }
  board['f']['8'] = { type: BISHOP, player: BLACK, moves: 0 }
  board['g']['8'] = { type: KNIGHT, player: BLACK, moves: 0 }
  board['h']['8'] = { type: ROOK, player: BLACK, moves: 0 }

  return board
}

const schema = new mongoose.Schema({
  board: { type: mongoose.Schema.Types.Mixed, default: defaultBoard },
  captured: {
    type: mongoose.Schema.Types.Mixed,
    default: { [BLACK]: [], [WHITE]: [] },
  },
  turn: { type: mongoose.Schema.Types.String, default: WHITE },
})

schema.methods.availableMoves = function (src) {
  const pos = Position.parse(src)
  const piece = this.board[pos.file][pos.rank]
  let result = []
  if (piece) {
    result = availableMoves(this.board, pos, piece)
  }
  return result
}

schema.methods.move = function (player, src, dst, override = false) {
  if (this.turn !== player && !override) {
    return `It is ${this.turn}'s turn`
  }

  const srcPos = Position.parse(src)
  const dstPos = Position.parse(dst)
  const piece = this.board[srcPos.file][srcPos.rank]

  if (!piece) {
    return `Invalid piece: ${src}`
  }

  let validMove = false
  let isCapture = false
  if (override) {
    validMove = true
  } else {
    if (piece.player === player) {
      const requestedMove = availableMoves(this.board, srcPos, piece)[dst]
      validMove = !!requestedMove
      isCapture = validMove && requestedMove.capture
    }
  }

  if (validMove) {
    // Copy the captured piece to the current users set of captured pieces
    if (isCapture && !override) {
      this.captured[this.turn].push(this.board[dstPos.file][dstPos.rank])
    }

    this.board[srcPos.file][srcPos.rank] = null
    this.board[dstPos.file][dstPos.rank] = piece
    piece.moves += 1

    // Update the turn state
    if (!override) {
      this.turn = this.turn === WHITE ? BLACK : WHITE
    }
  }

  if (!validMove) {
    return `${src} -> ${dst} is not a valid move for ${player}`
  }
}

module.exports = mongoose.model('ChessGame', schema)
