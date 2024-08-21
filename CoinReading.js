const coinFlip = () => Math.random() <  0.5 ? 0 : 1

const HEADS = 1
const TAILS = 0

const YIN = 'YIN'
const YANG = 'YANG'
const MOVING_YIN = 'MOVING_YIN'
const MOVING_YANG = 'MOVING_YANG'

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

const coinReading =
    castCoins()
        .map((row, i) => ({
            coinCast: row,
            line: getLine(row),
            coins: row.map(coinString),
            position: 6 - i
        }))

console.log(coinReading)
