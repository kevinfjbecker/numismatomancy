
// data source: http://www2.unipr.it/~deyoung/I_Ching_Wilhelm_Translation.html

///////////////////////////////////////////////////////////////////////////////

const parseTitle = /(\d+)\. (.+) \/ (.+)/

///////////////////////////////////////////////////////////////////////////////

const getParagraphs = () => [...document.querySelectorAll('blockquote > p')]

///////////////////////////////////////////////////////////////////////////////

/*
 *  todo
 *    where to do the cleaning: thinking in paragraphs
 *    after selection and before any other processing.
 */

const stuffToClean = [
    {
        "Number": "16",
        "Title": "Enthusiasm",
        "Failures": "6. moving line",
        "Problem": "the test string is not in its own paragraph",
        "Fix": "..."
    },
    {
        "Number": "18",
        "Title": "Work on what has been spoiled [ Decay ]",
        "Failures": "1. moving line",
        "Problem": "'in' instead of 'at'",
        "Fix": "..."
    },
    {
        "Number": "20",
        "Title": "Contemplation (View)",
        "Failures": "5. moving line",
        "Problem": "It's missing, just not there; no content",
        "Fix": "Make a patch; type in the text with my little fingers"
    },
    {
        "Number": "26",
        "Title": "The Taming Power of the Great",
        "Failures": "3. moving line",
        "Problem": "the test string is not in its own paragraph",
        "Fix": "..."
    },
    {
        "Number": "44",
        "Title": "Coming to Meet",
        "Failures": "3. moving line",
        "Problem": "the test string is not in its own paragraph and contains more content text",
        "Fix": "..."
    },
    {
        "Number": "52",
        "Title": "Keeping Still, Mountain",
        "Failures": "2. moving line",
        "Problem": "typo: 'e' instead of 'the'",
        "Fix": "..."
    },
    {
        "Number": "56",
        "Title": "The Wanderer",
        "Failures": "Judgment",
        "Problem": "It's missing, just not there; no content",
        "Fix": "Make a patch; type in the text with my little fingers"
    }
]

///////////////////////////////////////////////////////////////////////////////

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
        test: getRegexTester(/at the beginning means:$/)
    },
    {
        name: '2. moving line',
        test: getRegexTester(/in the second place means:$/)
    },
    {
        name: '3. moving line',
        test: getRegexTester(/in the third place means:$/)
    },
    {
        name: '4. moving line',
        test: getRegexTester(/in the fourth place means:$/)
    },
    {
        name: '5. moving line',
        test: getRegexTester(/in the fifth place means:$/)
    },
    {
        name: '6. moving line',
        test: getRegexTester(/at the top means:$/)
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
                    .join()
            }
        })
        .filter(({Failures}) => Failures !== '')
    )

///////////////////////////////////////////////////////////////////////////////

// showTestsHitsTable()

showHexgramsTestFailures()