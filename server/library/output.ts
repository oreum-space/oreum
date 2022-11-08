import { writeSync } from 'fs'

const types = ['●', '▶', '▲', '■'] as const
const backgrounds = ['\u001b[104;30m', '\u001b[107;30m', '\u001b[103;30m', '\u001b[101;30m'] as const
const colors = ['\u001b[94;40m', '\u001b[97;40m', '\u001b[93;40m', '\u001b[91;40m'] as const

function out (name: string, messages: string | Array<string>, type: number) {
  writeSync(1, `${
    backgrounds[type]
  } ${
    types[type]
  } ${
    name
  } ${
    colors[type]
  }\u001b[0m ${
    typeof messages === 'string' ? messages : '\n  ' + messages.join('\n  ')
  }\n`)
}

export function info (name: string, messages: string | Array<string>) {
  out(name, messages, 0)
}

export function log (name: string, messages: string | Array<string>) {
  out(name, messages, 1)
}

export function warning (name: string, messages: string | Array<string>) {
  out(name, messages, 2)
}

export function error (name: string, messages: string | Array<string>) {
  out(name, messages, 3)
}

export default {
  info,
  log,
  warning,
  error
}
