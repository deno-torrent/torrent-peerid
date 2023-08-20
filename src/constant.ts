const UPPER_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const LOWER_LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('')
const DIGITALS = '0123456789'.split('')
const OTHER_CHARS = '!"#$%&\'()*+,-./:;<=>?@[]^_`{|}~'.split('')
const LETTERS = [...UPPER_LETTERS, ...LOWER_LETTERS]

// https://wiki.theory.org/BitTorrentSpecification
// Each character in the version string represents a number from 0 to 63. '0'=0, ..., '9'=9, 'A'=10, ..., 'Z'=35, 'a'=36, ..., 'z'=61, '.'=62, '-'=63
const SHADOW_STYLE_VERSION_CHARS = [...DIGITALS, ...UPPER_LETTERS, ...LOWER_LETTERS, '.', '-']

const VISIBLE_CHARS = [...LETTERS, ...DIGITALS, ...OTHER_CHARS]

export { DIGITALS, LETTERS, LOWER_LETTERS, OTHER_CHARS, SHADOW_STYLE_VERSION_CHARS, UPPER_LETTERS, VISIBLE_CHARS }
