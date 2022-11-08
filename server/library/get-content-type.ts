const contentTypesMap: Record<string, string> = {
  html: 'text/html',
  js: 'application/javascript',
  txt: 'text/plain'
}

export default function (path: string): string {
  return `${contentTypesMap[path.split('.').at(-1) || 'txt'] || contentTypesMap.txt};charset=utf-8`
}