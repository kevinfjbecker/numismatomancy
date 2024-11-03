
// data source: http://www2.unipr.it/~deyoung/I_Ching_Wilhelm_Translation.html

///////////////////////////////////////////////////////////////////////////////

const getParagraphs = () => [...document.querySelectorAll('blockquote > p')]

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
    {name: 'Start', test: getQuerySelectorTester('a[name]')},
    {name: 'Title', test: getRegexTester(/(\d+)\. (.+) \/ (.+)/)},
    {name: 'Judgment', test: getRegexTester(/THE JUDGMENT/)},
    {name: 'Image', test: getRegexTester(/THE IMAGE/)},
    {name: 'Lines', test: getRegexTester(/THE LINES/)},
    {name: '1. moving line', test: getRegexTester(/at the beginning means:$/)},
    {name: '2. moving line', test: getRegexTester(/in the second place means:$/)},
    {name: '3. moving line', test: getRegexTester(/in the third place means:$/)},
    {name: '4. moving line', test: getRegexTester(/in the fourth place means:$/)},
    {name: '5. moving line', test: getRegexTester(/in the fifth place means:$/)},
    {name: '6. moving line', test: getRegexTester(/at the top means:$/)},
    {name: 'End', test: getQuerySelectorTester('a[href="#index"]')},
]

///////////////////////////////////////////////////////////////////////////////

const isStart = textTests.find(t => t.name === 'Start').test
const isEnd = textTests.find(t => t.name === 'End').test

const hexgramsTextLines = []
let currentHexgramTextLines

getParagraphs().forEach(p =>
{
    if(isStart(p))
    {
        currentHexgramTextLines = [p.innerText]
    }
    else if(isEnd(p))
    {
        hexgramsTextLines.push(currentHexgramTextLines)
    }
    else
    {
        currentHexgramTextLines.push(p.innerText)
    }
})

///////////////////////////////////////////////////////////////////////////////

console.table(
    textTests.map(({name, test}) => ({
        Count: getParagraphs().filter(test).length,
        Name: name,
        Pattern: test.pattern
    }))
)
