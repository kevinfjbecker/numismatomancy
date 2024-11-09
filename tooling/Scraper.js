
// data source: http://www2.unipr.it/~deyoung/I_Ching_Wilhelm_Translation.html

///////////////////////////////////////////////////////////////////////////////

const getParagraphs = () => [...document.querySelectorAll('blockquote > p')]

const getQuerySelectorTester = (pattern) =>
{
    const tester = (node) => !! node.querySelector(pattern)

    tester.pattern = pattern
    return tester
}

///////////////////////////////////////////////////////////////////////////////

const isStart = getQuerySelectorTester('a[name]')

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

///////////////////////////////////////////////////////////////////////////////

const hexgramsTextLines = hexgramsParagraphs
    .map(h => h.map(p => p.innerText))
    .map(h => h.map((s) => s.trim()))
    .map(h => h.map((s) => s.split('\n').flat()).flat())

///////////////////////////////////////////////////////////////////////////////

console.log('Copy the hexgramsTextLines object in to a file name HexgramsTextLines.json')

hexgramsTextLines