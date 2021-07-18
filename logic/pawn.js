const { BLACK } = require('../constants')
const Position = require('./position')

module.exports = (board, src, piece) => {
  const direction = BLACK === piece.player ? -1 : 1
  const moves = {}

  //Forward 1
  let pos = Position.relativeTo(src, 0, direction)
  if (pos && board[pos.file][pos.rank] == null) {
    moves[Position.stringify(pos)] = { capture: false }
  }

  //Attack 1
  pos = Position.relativeTo(src, 1, direction)
  if (
    pos &&
    board[pos.file][pos.rank] &&
    board[pos.file][pos.rank].player !== piece.player
  ) {
    moves[Position.stringify(pos)] = { capture: true }
  }

  //Attack 2
  pos = Position.relativeTo(src, -1, direction)
  if (
    pos &&
    board[pos.file][pos.rank] &&
    board[pos.file][pos.rank].player !== piece.player
  ) {
    moves[Position.stringify(pos)] = { capture: true }
  }

  // Initial move
  if (piece.moves == 0) {
    let pos = Position.relativeTo(src, 0, direction)
    if (!board[pos.file][pos.rank]) {
      pos = Position.relativeTo(src, 0, direction * 2)
      if (!board[pos.file][pos.rank]) {
        moves[Position.stringify(pos)] = { capture: false }
      }
    }
  }

  return moves
}
