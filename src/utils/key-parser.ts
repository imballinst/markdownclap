export function extractNumberFromCode(code: string) {
  // For example: Digit3.
  return Number(code.slice('Digit'.length));
}
