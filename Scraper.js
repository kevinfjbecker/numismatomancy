
// data source: http://www2.unipr.it/~deyoung/I_Ching_Wilhelm_Translation.html

///////////////////////////////////////////////////////////////////////////////

const parseTitle = /(\d+)\. (.+) \/ (.+)/

///////////////////////////////////////////////////////////////////////////////

const getParagraphs = () => [...document.querySelectorAll('blockquote > p')]

const getQuerySelectorTester = (pattern) =>
{
    const tester = (node) => !! node.querySelector(pattern)

    tester.pattern = pattern
    return tester
}

const getRegexTester = (pattern) =>
{
    const tester = (node) => pattern.test(node.innerText)

    tester.pattern = pattern.toString()
    return tester
}

///////////////////////////////////////////////////////////////////////////////

const textTests = [
    {
        name: 'Start',
        test: getQuerySelectorTester('a[name]')
    },
    {
        name: 'Title',
        test: getRegexTester(parseTitle)
    },
    {
        name: 'Judgment',
        test: getRegexTester(/THE JUDGMENT/)
    },
    {
        name: 'Image',
        test: getRegexTester(/THE IMAGE/)
    },
    {
        name: 'Lines',
        test: getRegexTester(/THE LINES/)
    },
    {
        name: '1. moving line',
        test: getRegexTester(/^(Nine|Six?) at the beginning means:$/)
    },
    {
        name: '2. moving line',
        test: getRegexTester(/^(Nine|Six?) in the second place means:$/)
    },
    {
        name: '3. moving line',
        test: getRegexTester(/^(Nine|Six?) in the third place means:$/)
    },
    {
        name: '4. moving line',
        test: getRegexTester(/^(Nine|Six?) in the fourth place means:$/)
    },
    {
        name: '5. moving line',
        test: getRegexTester(/^(Nine|Six?) in the fifth place means:$/)
    },
    {
        name: '6. moving line',
        test: getRegexTester(/^(Nine|Six?) at the top means:$/)
    },
    {
        name: 'End',
        test: getQuerySelectorTester('a[href="#index"]')
    },
]

///////////////////////////////////////////////////////////////////////////////

const showTestsHitsTable = () =>
    console.table(
        textTests.map(({name, test}) => ({
            Count: getParagraphs().filter(test).length,
            Name: name,
            Pattern: test.pattern
        }))
    )

///////////////////////////////////////////////////////////////////////////////

const isStart = textTests.find(t => t.name === 'Start').test
const isEnd = textTests.find(t => t.name === 'End').test

const hexgramsParagraphs = []
let currentHexgramTextLines

getParagraphs().forEach(p =>
{
    if(isStart(p))
    {
        currentHexgramTextLines = []
        hexgramsParagraphs.push(currentHexgramTextLines)
    }

    currentHexgramTextLines.push(p)
})

const hexgramsTextLines = hexgramsParagraphs.map(h => h.map(p => p.innerText))

///////////////////////////////////////////////////////////////////////////////

const showHexgramsTestFailures = () =>
    console.table(
        hexgramsParagraphs.map((paragraphs) =>
        {
            const [
                _,
                Number,
                __,
                Title
            ] = paragraphs[0].innerText.match(parseTitle)

            return {
                Number,
                Title,
                Failures: textTests
                    .filter(test => ! paragraphs.some(test.test))
                    .map(test => test.name)
                    .join(', ')
            }
        })
        .filter(({Failures}) => Failures !== '')
    )

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

// todo: try a general problem pattern
const movingLineStarterStuckAtTheEnd = /[^\s]\\n(six|nine?) in the (second|third|fourth|fifth) place means:/
const movingLineStarterWithMoreTextAfter = /(six|nine?) in the (second|third|fourth|fifth) place means:.*\w+/

///////////////////////////////////////////////////////////////////////////////

const stuffToClean = [
    {
        "Number": "16",
        "Title": "Enthusiasm",
        "Failures": "6. moving line",
        "Problem": "the test string is not in its own paragraph",
        "Fix": (textArrays) =>
        {
            const problemLine = "Six at the top means:\nDeluded enthusiasm.\nBut if after completion one changes,\nThere is no blame."
            const fixedLines = [
                "Six at the top means:",
                "Deluded enthusiasm.\nBut if after completion one changes,\nThere is no blame."
            ]
            const hexgram = textArrays.find((textLines) => {
                return textLines.some(s => s === problemLine)
            })
            const problemIndex = hexgram.indexOf(problemLine)
            hexgram.splice(problemIndex, 1, ...fixedLines)
        }
    },
    {
        "Number": "18",
        "Title": "Work on what has been spoiled [ Decay ]",
        "Failures": "1. moving line",
        "Problem": "'in' instead of 'at'",
        "Fix": (textArrays) => {
            const problemLine = "Six in the beginning means:"
            const hexgram = textArrays.find((textLines) => {
                return textLines.some(s => s === problemLine)
            })
            const problemIndex = hexgram.indexOf(problemLine)
            hexgram[problemIndex] = "Six at the beginning means:"
        }
    },
    {
        "Number": "20",
        "Title": "Contemplation (View)",
        "Failures": "5. moving line",
        "Problem": "It's missing, just not there; no content",
        "Fix": (textArrays) => {
            // const hexgram = textArrays[19];
            // insertBeforeIndex = hexgram.indexOf(s => /^at the top means:$/.test(s))
            // hexgram.splice(insertBeforeIndex, 0, ...patches['20_Contemplation'])
        }
    },
    {
        "Number": "26",
        "Title": "The Taming Power of the Great",
        "Failures": "3. moving line",
        "Problem": "the test string is not in its own paragraph",
        "Fix": (textArrays) => {}
    },
    {
        "Number": "44",
        "Title": "Coming to Meet",
        "Failures": "3. moving line",
        "Problem": "the test string is not in its own paragraph and contains more content text",
        "Fix": (textArrays) => {}
    },
    {
        "Number": "52",
        "Title": "Keeping Still, Mountain",
        "Failures": "2. moving line",
        "Problem": "typo: 'e' instead of 'the'",
        "Fix": (textArrays) => {}
    },
    {
        "Number": "56",
        "Title": "The Wanderer",
        "Failures": "Judgment",
        "Problem": "It's missing, just not there; no content",
        "Fix": (textArrays) => {}
    }
]

///////////////////////////////////////////////////////////////////////////////

const hexgramsTextLinesCleaned = JSON.parse(JSON.stringify(hexgramsTextLines))
stuffToClean.forEach((problem) =>
{
    problem.Fix(hexgramsTextLinesCleaned)
})

///////////////////////////////////////////////////////////////////////////////

showTestsHitsTable()

showHexgramsTestFailures()