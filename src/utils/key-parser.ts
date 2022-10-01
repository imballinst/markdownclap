export function extractNumberFromCode(code: string) {
  // For example: Digit3.
  return Number(code.slice('Digit'.length));
}

export function isNumberHeadings(value: number): value is 1 | 2 | 3 | 4 | 5 | 6 {
  return !isNaN(value) && value > 0 && value < 7;
}
