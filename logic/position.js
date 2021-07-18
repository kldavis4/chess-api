const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8']

const MIN_FILE = FILES[0].charCodeAt()
const MAX_FILE = FILES[FILES.length - 1].charCodeAt()
const MIN_RANK = RANKS[0].charCodeAt()
const MAX_RANK = RANKS[RANKS.length - 1].charCodeAt()

const isValid = (value) => {
  if (!value) {
    return false
  }

  const parts = value.toLowerCase().split('')
  return (
    parts.length === 2 && FILES.includes(parts[0]) && RANKS.includes(parts[1])
  )
}

const parse = (value) => {
  const parts = value.toLowerCase().split('')
  return {
    file: parts[0],
    rank: parts[1],
  }
}

const stringify = (props) => `${props.file}${props.rank}`

const relativeTo = (position, fileOffset, rankOffset) => {
  const relativeFile = position.file.charCodeAt() + fileOffset
  const relativeRank = position.rank.charCodeAt() + rankOffset

  if (
    relativeFile < MIN_FILE ||
    relativeFile > MAX_FILE ||
    relativeRank < MIN_RANK ||
    relativeRank > MAX_RANK
  ) {
    return null
  }

  return {
    file: String.fromCharCode(relativeFile),
    rank: String.fromCharCode(relativeRank),
  }
}

module.exports = {
  isValid,
  parse,
  relativeTo,
  stringify,
  FILES,
  RANKS,
}
