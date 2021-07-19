const { PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING } = require('../constants')

const pawnMovement = require('./pawn')

const MOVEMENT_FUNCTIONS = {
  [PAWN]: pawnMovement,
  [ROOK]: null,
  [KNIGHT]: null,
  [BISHOP]: null,
  [QUEEN]: null,
  [KING]: null,
}

const availableMoves = (board, src, piece) => {
  const availableMovesFn = MOVEMENT_FUNCTIONS[piece.type]
  if (!availableMovesFn) {
    throw 'Not Implemented'
  }
  return availableMovesFn(board, src, piece)
}

module.exports = {
  availableMoves,
}
