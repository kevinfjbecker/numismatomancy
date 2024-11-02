
// data source: http://www2.unipr.it/~deyoung/I_Ching_Wilhelm_Translation.html

///////////////////////////////////////////////////////////////////////////////

const getParagraphs = () => [...document.querySelectorAll('blockquote > p')]

///////////////////////////////////////////////////////////////////////////////

const isEnd = (node) => !! node.querySelector('a[href="#index"]')
const isStart = (node) => !! node.querySelector('a[name]')

///////////////////////////////////////////////////////////////////////////////

const textPatterns = [
    {name: 'Title', pattern: /(\d+)\. (.+) \/ (.+)/},
    {name: 'Judgment', pattern: /THE JUDGMENT/},
    {name: 'Image', pattern: /THE IMAGE/},
    {name: 'Lines', pattern: /THE LINES/},
    {name: '1. moving line', pattern: /at the beginning means:$/},
    {name: '2. moving line', pattern: /in the second place means:$/},
    {name: '3. moving line', pattern: /in the third place means:$/},
    {name: '4. moving line', pattern: /in the fourth place means:$/},
    {name: '5. moving line', pattern: /in the fifth place means:$/},
    {name: '6. moving line', pattern: /at the top means:$/},
]

const textTester = (pattern) => (node) => pattern.test(node.innerText)

///////////////////////////////////////////////////////////////////////////////

let hexgramsTextLines = []
let currentHexgramTextLines
getParagraphs().forEach(p =>
{
    if(isStart(p))
    {
        currentHexgramTextLines = [p]
        console.log(currentHexgramTextLines[0].innerText)
    }
    else if(isEnd(p))
    {
        hexgramsTextLines.push(currentHexgramTextLines)
        console.log('hexgramsTextLines', hexgramsTextLines.length)
    }
    else
    {
        currentHexgramTextLines.push(p)
        console.log('currentHexgramTextLines', currentHexgramTextLines.length)
    }
})

///////////////////////////////////////////////////////////////////////////////

console.table(
    textPatterns.map(({name, pattern}) => ({
        Count: getParagraphs()
            .filter(textTester(pattern))
            .length,
        Name: name,
        Pattern: pattern
    })
    )
)
