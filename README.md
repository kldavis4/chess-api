# chess-api

A RESTful Chess api.

## Pre-requisites

- Node 14.x
- Docker

## Setup

```
npm install
```

## Running the application locally

```
docker-compose up
```

## API

### Create a new game

`POST /games`

Returns a 200 status code and the current game state. The `_id` field should be used for all subsequent api requests.

Example:
```
curl --request POST 'http://localhost:3000/games'
```

### Get game state

`GET /games/<id>`

Returns a json response body with the following fields:

- `_id` - the id of the game
- `turn` - which player's turn is current, either `black` or `white`
- `board` - object containing the current board state
- `captured.black` - array of pieces captured by `black`
- `captured.white` - array of pieces captured by `white`

Example:
```
curl 'http://localhost:3000/games/60f4b0c912e1d6001e82c68d'
```

### Get available moves for a piece in a game

`GET http://localhost:3000/games/<id>/moves/<position>`

The `position` should be in [Algebraic notation](https://en.wikipedia.org/wiki/Algebraic_notation_(chess)).

A 200 status code and json response body is returned with the following fields:

- `position` - the position being checked
- `moves` - object containing all the moves that are currently available. The keys are the position names. The values have a single field `capture`. If the `capture` field is `true`, the move will result in the capture of an opponent's piece.

Example:
```
curl 'http://localhost:3000/games/60f4b0c912e1d6001e82c68d/moves/a2'
```

### Get game move history

`GET /games/<id>/history`

Example:
```
curl 'http://localhost:3000/games/60f4b0c912e1d6001e82c68d/history'
```

### Move

`POST /games/<id>/moves/<position>`

The `position` fields should be in [Algebraic notation](https://en.wikipedia.org/wiki/Algebraic_notation_(chess)).

The request should include a json request body with a `player` field and a destination `position` field.

A 200 status code and json response body is returned with the updated game state if the move was successful.

If the move is not possible, a 412 status code and json response body describing the problem is returned.

Example:
```
curl --location --request POST 'http://localhost:3000/games/60f4b0c912e1d6001e82c68d/moves/a2' \
--header 'Content-Type: application/json' \
--data-raw '{
    "player": "white",
    "position": "a4"
}'
```

### Environment Variables

- `PORT` - The port that the application listens on. Defaults to 3000
- `MONGO_HOST` - Hostname of the mongodb server
- `MONGO_PORT` - Port that the mongodb server listens on.

## Scripts

Scripts should be run using `npm run <script>`

- `prettify` - format source code using `prettier-eslint`
- `start` - start the application locally. NOTE: When running locally, a mongodb server instance must be available and configured using `MONGO_HOST` and `MONGO_PORT` environment variables.
- `nodemon` - start the application locally using `nodemon` to automatically reload the application when files are changed.
- `test` - run unit tests
- `test-watch` - run unit tests with automatic reruns when files are changed

## Docker

A `Dockerfile` is included to build a docker image for the api.

### Running with `docker-compose`

`docker-compose up` will start an instance of the application and a mongodb container. The api can be accessed at http://localhost:3000. The application is configured in development mode and will restart automatically when source files are modified.

The mongodb data is stored in the `.data` folder to allow it to persist across database restarts.

## Organization

- `app.js` - Express application
- `constants.js` - Game related constants
- `db.js` - implements crud operations for chess games
- `logic` - game related business logic
- `model` - Mongoose application models
- `routes` - Express route definitions
- `tests/logic` - unit tests for logic modules
- `tests/model` - unit tests for model modules

## Schema

### Game state

- `_id` - game id
- `turn` - the current turn's player. `black` or `white`.
- `board` - object with the current board state.
- `captured` - object like `{ "black": [], "white": [] }` where `black` is an array of the pieces captured by the black player and `white` is an array of the pieces captured by the white player.

### Game Piece

- `type` - the type of the chess piece. Possible values: `Pawn`, `Rook`, `Knight`, `Bishop`, `Queen`, `King`.
- `player` - the player who owns the piece. Possible values: `white` or `black`.
- `moves` - the number of times the piece has been moved.

### Board

The board object is a 2 dimensional array with "file" as the first dimension and "rank" as the second dimension. The file indices are: 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'. The rank indices are: '1', '2', '3', '4', '5', '6', '7', '8'. The values are either `null` for an empty space, or a game piece.

Example Board State:

```
{
  "board": {
    "a": {
      "1": {
        "type": "Rook",
        "player": "white",
        "moves": 0
      },
      "2": {
        "type": "Pawn",
        "player": "white",
        "moves": 0
      },
      "3": null,
      "4": null,
      "5": null,
      "6": null,
      "7": {
        "type": "Pawn",
        "player": "black",
        "moves": 0
      },
      "8": {
        "type": "Rook",
        "player": "black",
        "moves": 0
      }
    },
    "b": {
      "1": {
        "type": "Knight",
        "player": "white",
        "moves": 0
      },
      "2": {
        "type": "Pawn",
        "player": "white",
        "moves": 0
      },
      "3": null,
      "4": null,
      "5": null,
      "6": null,
      "7": {
        "type": "Pawn",
        "player": "black",
        "moves": 0
      },
      "8": {
        "type": "Knight",
        "player": "black",
        "moves": 0
      }
    },
    "c": {
      "1": {
        "type": "Bishop",
        "player": "white",
        "moves": 0
      },
      "2": {
        "type": "Pawn",
        "player": "white",
        "moves": 0
      },
      "3": null,
      "4": null,
      "5": null,
      "6": null,
      "7": {
        "type": "Pawn",
        "player": "black",
        "moves": 0
      },
      "8": {
        "type": "Bishop",
        "player": "black",
        "moves": 0
      }
    },
    "d": {
      "1": {
        "type": "Queen",
        "player": "white",
        "moves": 0
      },
      "2": {
        "type": "Pawn",
        "player": "white",
        "moves": 0
      },
      "3": null,
      "4": null,
      "5": null,
      "6": null,
      "7": {
        "type": "Pawn",
        "player": "black",
        "moves": 0
      },
      "8": {
        "type": "Queen",
        "player": "black",
        "moves": 0
      }
    },
    "e": {
      "1": {
        "type": "King",
        "player": "white",
        "moves": 0
      },
      "2": {
        "type": "Pawn",
        "player": "white",
        "moves": 0
      },
      "3": null,
      "4": null,
      "5": null,
      "6": null,
      "7": {
        "type": "Pawn",
        "player": "black",
        "moves": 0
      },
      "8": {
        "type": "King",
        "player": "black",
        "moves": 0
      }
    },
    "f": {
      "1": {
        "type": "Bishop",
        "player": "white",
        "moves": 0
      },
      "2": {
        "type": "Pawn",
        "player": "white",
        "moves": 0
      },
      "3": null,
      "4": null,
      "5": null,
      "6": null,
      "7": {
        "type": "Pawn",
        "player": "black",
        "moves": 0
      },
      "8": {
        "type": "Bishop",
        "player": "black",
        "moves": 0
      }
    },
    "g": {
      "1": {
        "type": "Knight",
        "player": "white",
        "moves": 0
      },
      "2": {
        "type": "Pawn",
        "player": "white",
        "moves": 0
      },
      "3": null,
      "4": null,
      "5": null,
      "6": null,
      "7": {
        "type": "Pawn",
        "player": "black",
        "moves": 0
      },
      "8": {
        "type": "Knight",
        "player": "black",
        "moves": 0
      }
    },
    "h": {
      "1": {
        "type": "Rook",
        "player": "white",
        "moves": 0
      },
      "2": {
        "type": "Pawn",
        "player": "white",
        "moves": 0
      },
      "3": null,
      "4": null,
      "5": null,
      "6": null,
      "7": {
        "type": "Pawn",
        "player": "black",
        "moves": 0
      },
      "8": {
        "type": "Rook",
        "player": "black",
        "moves": 0
      }
    }
  }
}
```