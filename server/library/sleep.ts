export default function (ms: number): Promise<void> {
  return new Promise<void>(_ => setTimeout(_, ms))
}