/** Use in the `default` branch of a switch over a union to force exhaustive handling at compile time. */
export function assertNever(value: never): never {
  throw new Error(`Unhandled case: ${JSON.stringify(value)}`)
}
