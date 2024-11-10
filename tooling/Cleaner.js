
// console.log(__filename, 'started') // debug

///////////////////////////////////////////////////////////////////////////////
const fs = require('fs')

///////////////////////////////////////////////////////////////////////////////

const [inputFilePath, outputFilePath] = process.argv.slice(2)

const input = fs.readFileSync(inputFilePath)

///////////////////////////////////////////////////////////////////////////////

const hexgramsTextLines = JSON.parse(input)

///////////////////////////////////////////////////////////////////////////////

const parseTitle = /(\d+)\. (.+) \/ (.+)/

///////////////////////////////////////////////////////////////////////////////

const getRegexStringTester = (pattern) =>
{
    const tester = (text) => pattern.test(text)

    tester.pattern = pattern.toString()
    return tester
}

///////////////////////////////////////////////////////////////////////////////

const textTests = [
    {
        name: 'Title',
        test: getRegexStringTester(parseTitle)
    },
    {
        name: 'Judgment',
        test: getRegexStringTester(/THE JUDGMENT/)
    },
    {
        name: 'Image',
        test: getRegexStringTester(/THE IMAGE/)
    },
    {
        name: 'Lines',
        test: getRegexStringTester(/THE LINES/)
    },
    {
        name: '1. moving line',
        test: getRegexStringTester(/^(Nine|Six?) at the beginning means:$/)
    },
    {
        name: '2. moving line',
        test: getRegexStringTester(/^(Nine|Six?) in the second place means:$/)
    },
    {
        name: '3. moving line',
        test: getRegexStringTester(/^(Nine|Six?) in the third place means:$/)
    },
    {
        name: '4. moving line',
        test: getRegexStringTester(/^(Nine|Six?) in the fourth place means:$/)
    },
    {
        name: '5. moving line',
        test: getRegexStringTester(/^(Nine|Six?) in the fifth place means:$/)
    },
    {
        name: '6. moving line',
        test: getRegexStringTester(/^(Nine|Six?) at the top means:$/)
    },
]

///////////////////////////////////////////////////////////////////////////////

const showTestsHitsTable = (hexgrams) =>
    console.table(
        textTests.map(({name, test}) => ({
            Count: hexgrams.flat().filter(test).length,
            Name: name,
            Pattern: test.pattern
        }))
    )

///////////////////////////////////////////////////////////////////////////////

const showHexgramsTestFailures = (hexgrams) =>
    console.table(
        hexgrams.map((textLines) =>
        {
            const [
                _,
                Number,
                __,
                Title
            ] = textLines[0].match(parseTitle)

            return {
                Number,
                Title,
                Failures: textTests
                    .filter(test => ! textLines.some(test.test))
                    .map(test => test.name)
                    .join(', ')
            }
        })
        .filter(({Failures}) => Failures !== '')
    )

///////////////////////////////////////////////////////////////////////////////

const stuffToClean = [
    {
        "Number": "18",
        "Title": "Work on what has been spoiled [ Decay ]",
        "Failures": "1. moving line",
        "Problem": "'in' instead of 'at'",
        "Fix": (textArrays) => {
            const hexgram = textArrays[17]
            const problemLine = "Six in the beginning means:"
            const fixedLine = "Six at the beginning means:"
            const problemIndex = hexgram.indexOf(problemLine)
            hexgram[problemIndex] = fixedLine
        }
    },
    {
        "Number": "20",
        "Title": "Contemplation (View)",
        "Failures": "5. moving line",
        "Problem": "It's missing, just not there; no content",
        "Fix": (textArrays) => {
            const hexgram = textArrays[19]
            const insertBeforeIndex = hexgram.indexOf("Nine at the top means:")
            hexgram.splice(insertBeforeIndex, 0, ...patches['20_Contemplation'])
        }
    },
    {
        "Number": "23",
        "Title": "Splitting Apart",
        "Failures": "Trigrams",
        "Problem": "Is fire, sould be earth",
        "Fix": (textArrays) => {
            const hexgram = textArrays[22]
            const problemIndex = hexgram.indexOf("below LI THE CLINGING, FIRE")
            hexgram[problemIndex] = "below K'UN THE RECEPTIVE, EARTH"            
        }
    },
    {
        "Number": "26",
        "Title": "The Taming Power of the Great",
        "Failures": "3. moving line",
        "Problem": "'.' instead of ':' at the end of the line",
        "Fix": (textArrays) => {
            const hexgram = textArrays[25]
            const problemLine = "Nine in the third place means."
            const fixedLine = "Nine in the third place means:"
            const problemIndex = hexgram.indexOf(problemLine)
            // console.log(problemIndex) // debug
            hexgram[problemIndex] = fixedLine
        }
    },
    {
        "Number": "44",
        "Title": "Coming to Meet",
        "Failures": "3. moving line",
        "Problem": "the test string is not in its own paragraph and contains more content text",
        "Fix": (textArrays) => {
            const hexgram = textArrays[43]
            const problemLine = "Nine in the third place means: There is no skin on his thighs,"
            const fixedLines = [
                "Nine in the third place means:",
                "There is no skin on his thighs,"
            ]
            const problemIndex = hexgram.indexOf(problemLine)
            hexgram.splice(problemIndex, 1, ...fixedLines)
        }
    },
    {
        "Number": "52",
        "Title": "Keeping Still, Mountain",
        "Failures": "2. moving line",
        "Problem": "typo: 'e' instead of 'the'",
        "Fix": (textArrays) => {
            const hexgram = textArrays[51];
            const problemLine = "Six in e second place means:"
            const fixedLine = "Six in the second place means:"
            const problemIndex = hexgram.indexOf(problemLine)
            // console.log(problemIndex) // debug
            hexgram[problemIndex] = fixedLine
        }
    },
    {
        "Number": "56",
        "Title": "The Wanderer",
        "Failures": "Judgment",
        "Problem": "It's missing, just not there; no content",
        "Fix": (textArrays) => {
            const hexgram = textArrays[55];
            const insertBeforeIndex = hexgram.indexOf("THE IMAGE")
            hexgram.splice(insertBeforeIndex, 0, ...patches['56_The_Wanderer'])
        }
    }
]

///////////////////////////////////////////////////////////////////////////////

const patches = {
    "20_Contemplation": [
        "Nine in the fifth place means:",
        "Contemplation of my life.",
        "The superior man is without blame.",
        "A man in an authoritative position to whom others look up must always be ready for self-examination. The right sort of self-examination, however, consists not in idle brooding over oneself but in examining the effects one produces. Only when these effects are good, and when one's influence on others is good, will the contemplation of one's own life bring the satisfaction of knowing oneself to be free of mistakes."
    ],
    "56_The_Wanderer": [
        "THE JUDGMENT",
        "THE WANDERER. Success through smallness.",
        "Perseverance brings good fortune",
        "To the wanderer.",
        "When a man is a wanderer and stranger, he should not be gruff nor overbearing. He has no large circle of acquaintances, therefore he should not give himself airs. He must be cautious and reserved; in this way he protects himself from evil. If he is obliging toward others, he wins success.",
        "A wanderer has no fixed abode; his home is the road.",
        "Therefore he must take care to remain upright and steadfast, so that he sojourns only in the proper places, associating only with good people. Then he has good fortune and can go his way unmolested."
    ]
}

///////////////////////////////////////////////////////////////////////////////

const hexgramsTextLinesCleaned = JSON.parse(JSON.stringify(hexgramsTextLines))
stuffToClean.forEach((problem) =>
{
    problem.Fix(hexgramsTextLinesCleaned)
})

/*
 * remove empty lines
 */
hexgramsTextLinesCleaned.forEach(hexgram =>
{
    while(hexgram.some(line => line === ''))
    {
        trimIndex = hexgram.indexOf('')
        hexgram.splice(trimIndex, 1)
    }
})

/*
 * remove "index" from the ends
 */
hexgramsTextLinesCleaned.forEach(hexgram =>
{
    trimIndex = hexgram.indexOf('index')
    hexgram.splice(trimIndex, hexgram.length - trimIndex)
})

/*
 * Make trigram above|below names consistent
 */
const inconsistentTrigramNames = [
    [ 'KêN KEEPING STILL, MOUNTAIN', 'KÊN KEEPING STILL, MOUNTAIN' ],
    [ 'CHêN THE AROUSING, THUNDER', 'CHÊN THE AROUSING, THUNDER' ],
    [ 'Kên KEEPING STILL, MOUNTAIN', 'KÊN KEEPING STILL, MOUNTAIN' ],
    [ 'CHEN THE AROUSING, THUNDER', 'CHÊN THE AROUSING, THUNDER' ],
    [ 'KEN KEEPING STILL, MOUNTAIN', 'KÊN KEEPING STILL, MOUNTAIN' ],
    [ 'Sun THE GENTLE, WIND', 'SUN THE GENTLE, WIND' ]
]
hexgramsTextLinesCleaned.forEach(hexgram =>
    {
        hexgram.forEach((line, i) =>
        {
            inconsistentTrigramNames.forEach(([problem, fixed]) =>
            {
                if(line.includes(problem))
                {
                    hexgram[i] = line.replace(problem, fixed)
                }
            })
        })
    })

///////////////////////////////////////////////////////////////////////////////

const output = JSON.stringify(hexgramsTextLinesCleaned, null, 4)

///////////////////////////////////////////////////////////////////////////////

fs.writeFileSync(outputFilePath, output)

///////////////////////////////////////////////////////////////////////////////

// console.log('Parser text hits')
// showTestsHitsTable(hexgramsTextLines)
// console.log()

// console.log('Test before cleaning')
// showHexgramsTestFailures(hexgramsTextLines)
// console.log()

// console.log('Test after cleaning')
// showHexgramsTestFailures(hexgramsTextLinesCleaned)
// console.log()

// console.log('Parser text hits')
// showTestsHitsTable(hexgramsTextLinesCleaned)
// console.log()

///////////////////////////////////////////////////////////////////////////////

// console.log(__filename, 'done') // debug
