import { appendFile } from 'fs'

function log(message) {
    const date = (new Date()).toISOString()
    appendFile('./app.log', `${date}|${message}\n`, () => {})
}

export default log