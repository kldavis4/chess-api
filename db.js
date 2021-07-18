const mongoose = require('mongoose')
const ChessGame = require('./model/chessgame')

const MONGO_HOST = process.env.MONGO_HOST || 'localhost'
const MONGO_PORT = process.env.MONGO_PORT || 27017

let connected = false
mongoose.connect(`mongodb://${MONGO_HOST}:${MONGO_PORT}/chess`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  connected = true
})

const createGame = async () => {
  if (!connected) {
    throw 'Database not connected'
  }

  const game = new ChessGame()
  return await game.save()
}

const saveGame = async (id, game) => {
  if (!connected) {
    throw 'Database not connected'
  }

  return await ChessGame.findByIdAndUpdate(id, game, {
    new: true,
    useFindAndModify: false,
  })
}

const loadGame = async (id) => {
  if (!connected) {
    throw 'Database not connected'
  }

  return await ChessGame.findOne({ _id: id })
}

const isValidGameId = (id) => {
  return id && mongoose.Types.ObjectId.isValid(id)
}

module.exports = {
  createGame,
  isValidGameId,
  loadGame,
  saveGame,
}
