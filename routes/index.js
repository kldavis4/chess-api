var express = require('express')
var router = express.Router()

const { WHITE, BLACK } = require('../constants')
const { ChessGame } = require('../model/chessgame')
const Position = require('../logic/position')
const { createGame, isValidGameId, loadGame, saveGame } = require('../db')

const MESSAGE_412 = 'Invalid move'
const MESSAGE_404 = 'Chess game not found'
const MESSAGE_500 = 'Unexpected error'

router.post('/games', async (req, res, next) => {
  try {
    res.status(200).json(await createGame())
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Unexpected error' })
  }
})

router.get('/games/:gameId', async (req, res, next) => {
  const id = req.params['gameId']

  if (!isValidGameId(id)) {
    res.status(400).json({ message: 'Missing or invalid game id' })
    return
  }

  try {
    const game = await loadGame(id)
    if (game) {
      res.status(200).json(game)
    } else {
      res.status(404).json({ message: MESSAGE_404 })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: MESSAGE_500 })
  }
})

router.get('/games/:gameId/history', async (req, res, next) => {
  const id = req.params['gameId']

  if (!isValidGameId(id)) {
    res.status(400).json({ message: 'Missing or invalid game id' })
    return
  }

  res.status(500).json({ message: 'Not Implemented' })
})

router.get('/games/:gameId/moves/:position', async (req, res, next) => {
  const id = req.params['gameId']
  const position = req.params['position']

  if (!isValidGameId(id)) {
    res.status(400).json({ message: 'Missing or invalid game id' })
    return
  }

  if (!Position.isValid(position)) {
    res.status(400).json({ message: 'Move start position is invalid' })
    return
  }

  let game
  try {
    game = await loadGame(id)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: MESSAGE_500 })
    return
  }

  if (game) {
    res
      .status(200)
      .json({ _id: game._id, position, moves: game.availableMoves(position) })
  } else {
    res.status(404).json({ message: MESSAGE_404 })
  }
})

router.post('/games/:gameId/moves/:position', async (req, res, next) => {
  const id = req.params['gameId']
  const body = req.body
  const srcPos = req.params['position']
  const dstPos = body['position']

  if (!isValidGameId(id)) {
    res.status(400).json({ message: 'Missing or invalid game id' })
    return
  }

  if (!Position.isValid(srcPos)) {
    res.status(400).json({ message: 'Move start position is invalid' })
    return
  }

  if (!Position.isValid(dstPos)) {
    res.status(400).json({ message: 'Move end position is invalid' })
    return
  }

  const player = body['player']
  if (player !== WHITE && player !== BLACK) {
    res.status(400).json({ message: 'Invalid player' })
    return
  }

  let game
  try {
    game = await loadGame(id)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: MESSAGE_500 })
    return
  }

  if (game) {
    const error = game.move(player, srcPos, dstPos)
    if (!error) {
      try {
        game = await saveGame(id, game)
        res.status(200).json(game)
      } catch (err) {
        res.status(500).json({ message: MESSAGE_500 })
      }
    } else {
      res.status(412).json({ message: error })
    }
  } else {
    res.status(404).json({ message: MESSAGE_404 })
  }
})

module.exports = router
