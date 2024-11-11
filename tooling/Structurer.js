
// console.log(__filename, 'started') // debug

///////////////////////////////////////////////////////////////////////////////

const fs = require('fs')

///////////////////////////////////////////////////////////////////////////////

const [inputFilePath, outputFilePath] = process.argv.slice(2)

const input = fs.readFileSync(inputFilePath)

///////////////////////////////////////////////////////////////////////////////

const hexgramsTextLines = JSON.parse(input)

///////////////////////////////////////////////////////////////////////////////

const titleRegex = /(\d+)\. (.+) \/ (.+)/
const trigramRegex = /(above|below) ([^\s]+) (.+), (.+)/

///////////////////////////////////////////////////////////////////////////////

const textTests = [
    {
        name: 'Title',
        test: titleRegex
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

const trigramNamesBinary =
{
  "CH'IEN": "111",
  "TUI": "110",
  "LI": "101",
  "KÊN": "100",
  "SUN": "011",
  "K'AN": "010",
  "CHÊN": "001",
  "K'UN": "000",
}

///////////////////////////////////////////////////////////////////////////////

/*
 * Group into sections
 */
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

/*
 * Split up title section
 */
hexgramsStructured.forEach((hexgram, i) =>
{
    const titleParts = hexgram.Title.textLines[0].match(titleRegex)
    const trigramAbove = hexgram.Title.textLines[1].match(trigramRegex)
    const trigramBelow = hexgram.Title.textLines[2].match(trigramRegex)
    
    hexgram.Title.number = titleParts[1]
    hexgram.Title.name = titleParts[2]
    hexgram.Title.title = titleParts[3]

    hexgram.Title.trigramAbove = {
        name: trigramAbove[2],
        aspect: trigramAbove[3],
        element: trigramAbove[4],
        binary: trigramNamesBinary[trigramAbove[2]]
    }

    hexgram.Title.trigramBelow = {
        name: trigramBelow[2],
        aspect: trigramBelow[3],
        element: trigramBelow[4],
        binary: trigramNamesBinary[trigramBelow[2]]
    }

    hexgram.Title.binary =
        hexgram.Title.trigramBelow.binary +
        hexgram.Title.trigramAbove.binary
})

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

// console.log('Trigram name counts')
// const nameCounts = {}; // semicolon needed between object literal and array literal
// [
//     ...hexgramsStructured.map(h => h.Title.textLines[1].slice(6)),
//     ...hexgramsStructured.map(h => h.Title.textLines[2].slice(6))
// ]
// .sort()
// .forEach(name =>
//     nameCounts[name] = nameCounts[name] ? nameCounts[name] + 1 : 1
// )
// console.table(Object.entries(nameCounts).sort((a,b)=>a[0]>b[0]))
// console.log(`Total: ${
//     Object.entries(nameCounts)
//         .map(e=>+e[1])
//         .reduce((a,b)=>a+b)}`)

///////////////////////////////////////////////////////////////////////////////

// console.log(__filename, 'done') // debug
