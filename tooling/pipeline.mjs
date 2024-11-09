import { readFileSync } from 'fs'
import { fork } from 'child_process'
import path from 'node:path'

const configPath = './pipeline.json'

const config = JSON.parse(readFileSync(configPath))

for(const step of config.steps)
{
    await thenableFork(step.processor, [step.input, step.output])
}

///////////////////////////////////////////////////////////////////////////////

// src: https://stackoverflow.com/a/74548293/1393179

async function thenableFork(scriptPath, args = [])
{
    return new Promise((resolve, reject) =>
    {
        const process = fork(
            scriptPath,
            args,
            { cwd: path.dirname(scriptPath) }
        )

        process.on('exit', code => resolve(code))
        process.on('error', err => reject(err))
    })
}