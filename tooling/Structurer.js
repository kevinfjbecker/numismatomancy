
// console.log(__filename, 'started') // debug

///////////////////////////////////////////////////////////////////////////////

const fs = require('fs')

///////////////////////////////////////////////////////////////////////////////

const [inputFilePath, outputFilePath] = process.argv.slice(2)

const input = fs.readFileSync(inputFilePath)

///////////////////////////////////////////////////////////////////////////////

const hexgramsTextLines = JSON.parse(input)

///////////////////////////////////////////////////////////////////////////////

const textTests = [
    {
        name: 'Title',
        test: /(\d+)\. (.+) \/ (.+)/
    },
    {
        name: 'Judgment',
        test: /THE JUDGMENT/
    },
    {
        name: 'Image',
        test: /THE IMAGE/
    },
    {
        name: 'Lines',
        test: /THE LINES/
    },
    {
        name: '1. moving line',
        test: /^(Nine|Six?) at the beginning means:$/
    },
    {
        name: '2. moving line',
        test: /^(Nine|Six?) in the second place means:$/
    },
    {
        name: '3. moving line',
        test: /^(Nine|Six?) in the third place means:$/
    },
    {
        name: '4. moving line',
        test: /^(Nine|Six?) in the fourth place means:$/
    },
    {
        name: '5. moving line',
        test: /^(Nine|Six?) in the fifth place means:$/
    },
    {
        name: '6. moving line',
        test: /^(Nine|Six?) at the top means:$/
    },
]

///////////////////////////////////////////////////////////////////////////////

hexgramsStructured = hexgramsTextLines.map(textLines =>
{
    const hexgram = {}

    let testIndex = 0
    let currentSection
    for(let lineIndex = 0; lineIndex < textLines.length; lineIndex ++)
    {
        if(textTests[testIndex]?.test.test(textLines[lineIndex]))
        {
            currentSection = { textLines: [ textLines[lineIndex] ] }
            hexgram[textTests[testIndex].name] = currentSection
            testIndex ++
        }
        else
        {
            currentSection.textLines.push(textLines[lineIndex])
        }
    }

    return hexgram
})

///////////////////////////////////////////////////////////////////////////////

// todo: use this to wire up the Coinreading with the I Ching text
const trigramsNames =
[
  { "binary": "111", "name": "CH'IEN" },
  { "binary": "110", "name": "TUI" },
  { "binary": "101", "name": "LI" },
  { "binary": "100", "name": "KÊN" },
  { "binary": "011", "name": "SUN" },
  { "binary": "010", "name": "K'AN" },
  { "binary": "001", "name": "CHÊN" },
  { "binary": "000", "name": "K'UN" }
]

///////////////////////////////////////////////////////////////////////////////

const output = JSON.stringify(hexgramsStructured, null, 4)

///////////////////////////////////////////////////////////////////////////////

fs.writeFileSync(outputFilePath, output)

///////////////////////////////////////////////////////////////////////////////

// console.log(`There are ${hexgramsTextLines.length} hexgrams.`)

// console.log(hexgramsTextLines[0].join('\n'))

// console.log(hexgramsStructured.map(h => h.Title.textLines.length))

// console.log(hexgramsStructured
//     .filter(h => h.Title.textLines.length > 4)
//     .map(h => h.Title.textLines[0]))

console.log('Trigram name counts')
const nameCounts = {}; // semicolon needed between object literal and array literal
[
    ...hexgramsStructured.map(h => h.Title.textLines[1].slice(6)),
    ...hexgramsStructured.map(h => h.Title.textLines[2].slice(6))
]
.sort()
.forEach(name =>
    nameCounts[name] = nameCounts[name] ? nameCounts[name] + 1 : 1
)
console.table(Object.entries(nameCounts).sort((a,b)=>a[0]>b[0]))
console.log(`Total: ${
    Object.entries(nameCounts)
        .map(e=>+e[1])
        .reduce((a,b)=>a+b)}`)


///////////////////////////////////////////////////////////////////////////////

// console.log(__filename, 'done') // debug
