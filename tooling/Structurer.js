
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

console.log('Trigram name inconsitencies')
console.log([...new Set(
    hexgramsStructured.map(h => h.Title.textLines[1]),
    hexgramsStructured.map(h => h.Title.textLines[2])
)])

///////////////////////////////////////////////////////////////////////////////

// console.log(__filename, 'done') // debug
