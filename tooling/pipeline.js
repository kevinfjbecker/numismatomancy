const fs = require('fs')
const childProcess = require('child_process')

const configPath = './pipeline.json'

const config = JSON.parse(fs.readFileSync(configPath))

for(const step of config.steps)
{
    childProcess.fork(step.processor, [step.input, step.output])
}