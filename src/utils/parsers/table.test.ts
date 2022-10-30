import { describe, expect, test } from "vitest";
import { parseTableFromTabbedText } from "./table";

describe('parseTableFromTabbedText', () => {
  test('invalid case: undefined', () => {
    expect(parseTableFromTabbedText(undefined)).toBe(undefined)
  })

  test('invalid case: empty string', () => {
    expect(parseTableFromTabbedText('')).toBe(undefined)
  })

  test('invalid case: no columns', () => {
    expect(parseTableFromTabbedText('test')).toBe(undefined)
  })

  test('invalid case: different number of columns', () => {
    const str = `
hello\tworld
this is an invalid table
    `.trim()

    expect(parseTableFromTabbedText(str)).toBe(undefined)
  })

  test('valid case', () => {
    const str = `
hello\tworld
this is a valid table\they!
    `.trim()

    expect(parseTableFromTabbedText(str)).toBe(`
|hello|world|
|this is a valid table|hey!|
    `.trim())
  })

  test('valid case, with pipe characters', () => {
    const str = `
hello\tworld
this is a | valid table\they!
    `.trim()

    expect(parseTableFromTabbedText(str)).toBe(`
|hello|world|
|this is a \\| valid table|hey!|
    `.trim())
  })
})