export function extractNumberFromKey(key: string) {
  // For example: Digit3.
  return Number(key);
}

export function isNumberHeadings(value: number): value is 1 | 2 | 3 | 4 | 5 | 6 {
  return !isNaN(value) && value > 0 && value < 7;
}
