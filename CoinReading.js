
///////////////////////////////////////////////////////////////////////////////

const fs = require('fs')

///////////////////////////////////////////////////////////////////////////////

const hexgrams = JSON.parse(fs.readFileSync('./hexgrams.json'))

///////////////////////////////////////////////////////////////////////////////

const HEADS = 1
const TAILS = 0

const YIN = 'YIN'
const YANG = 'YANG'
const MOVING_YIN = 'MOVING_YIN'
const MOVING_YANG = 'MOVING_YANG'

const YIN_STRING = '- -'
const YANG_STRING = '---'
const MOVING_YIN_STRING = '- - .'
const MOVING_YANG_STRING = '--- .'

const linesStrings = {}
linesStrings[YIN] = YIN_STRING
linesStrings[YANG] = YANG_STRING
linesStrings[MOVING_YIN] = MOVING_YIN_STRING
linesStrings[MOVING_YANG] = MOVING_YANG_STRING

const YIN_BINARY = 0
const YANG_BINARY = 1

const linesBinary = {}
linesBinary[YIN] = YIN_BINARY
linesBinary[YANG] = YANG_BINARY
linesBinary[MOVING_YIN] = YIN_BINARY
linesBinary[MOVING_YANG] = YANG_BINARY

///////////////////////////////////////////////////////////////////////////////

const coinFlip = () => Math.random() <  0.5 ? 0 : 1

/*
 * ChatGPT:
 *   prompt: Could you write me a sum function in JavaScript accepting any number of parameters
 *   prompt: Would you write all functions as arrow functions and without semicolons
 */
const sum = (...args) => 
    args.reduce((accumulator, currentValue) => accumulator + currentValue, 0)

const coinString = (c) => {
    switch(c) {
        case(HEADS): return 'heads'
        case(TAILS): return 'tails'
    }
}

const coinToss = (n) => () =>
    Array(n)
        .fill(null)
        .map(coinFlip)

const castCoins = () =>
    Array(6)
        .fill(null)
        .map(coinToss(3))
        .reverse()

const getLine = (toss) =>
{
    switch(sum(...toss)) {
        case 0: return MOVING_YIN;
        case 1: return YANG;
        case 2: return YIN;
        case 3: return MOVING_YANG;
    }
}

/**
 * ChatGPT
 * prompt: Would you write me a JavaScript function that takes and integer and returns and ordinal string?
 * prompt: Could you change it to an arrow function without semicolons?
*/
const getOrdinalSuffix = n => {
    const suffixes = ["th", "st", "nd", "rd"]
    const value = n % 100
    return n + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0])
}

const getTextLines = reading =>
    reading
        .map(line => linesStrings[line.line])
        .join('\n')

const getBinary = reading =>
    reading
        .map(line => linesBinary[line.line])
        .reverse()
        .join('')

const getCoinsBinary = reading =>
    reading
        .map(line => line.coinCast)
        .reverse()
        .flat()
        .join('')

///////////////////////////////////////////////////////////////////////////////

const coinReading =
    castCoins()
        .map((row, i) => ({
            coinCast: row,
            line: getLine(row),
            coins: row.map(coinString),
            position: 6 - i
        }))

///////////////////////////////////////////////////////////////////////////////

const hexgram = hexgrams.find(h => h.Title.binary === getBinary(coinReading))

///////////////////////////////////////////////////////////////////////////////

const movingLinesText = coinReading
    .filter(line => line.line.includes('MOVING'))
    .map(line => hexgram[line.position + '. moving line'])
    .reverse()

///////////////////////////////////////////////////////////////////////////////

console.log(hexgram.Title.textLines.join('\n\n'))
console.log()
console.log(hexgram.Judgment.textLines.join('\n\n'))
console.log()
console.log(hexgram.Image.textLines.join('\n\n'))
console.log()
console.log(hexgram.Lines.textLines[0])
console.log()
console.log(
    movingLinesText
        .map(line => line.textLines.join('\n\n'))
        .join('\n\n')
)
