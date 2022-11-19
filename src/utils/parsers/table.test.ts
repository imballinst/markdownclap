import { describe, expect, test } from "vitest";
import { parseTableFromCommaSeparatedText, parseTableFromTabbedText } from "./table";

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
    `

    expect(parseTableFromTabbedText(str)).toBe(undefined)
  })

  test('valid case', () => {
    const str = `
hello\tworld
this is a valid table\they!
    `

    expect(parseTableFromTabbedText(str)).toBe(`
|hello|world|
|this is a valid table|hey!|
    `.trim())
  })

  test('valid case: with trailing newline', () => {
    const str = `
hello\tworld
this is a valid table\they!
    `

    expect(parseTableFromTabbedText(str)).toBe(`
|hello|world|
|this is a valid table|hey!|
    `.trim())
  })

  test('valid case, with pipe characters', () => {
    const str = `
hello\tworld
this is a | valid table\they!
    `

    expect(parseTableFromTabbedText(str)).toBe(`
|hello|world|
|this is a \\| valid table|hey!|
    `.trim())
  })
})

describe('parseTableFromCommaSeparatedText', () => {
  test('invalid case: undefined', () => {
    expect(parseTableFromCommaSeparatedText(undefined)).toBe(undefined)
  })

  test('invalid case: empty string', () => {
    expect(parseTableFromCommaSeparatedText('')).toBe(undefined)
  })

  test('invalid case: no columns', () => {
    expect(parseTableFromCommaSeparatedText('test')).toBe(undefined)
  })

  test('invalid case: different number of columns', () => {
    const str = `
hello,world
this is an invalid table
    `

    expect(parseTableFromCommaSeparatedText(str)).toBe(undefined)
  })

  test('valid case', () => {
    const str = `
hello,world
this is a valid table,hey!
    `

    expect(parseTableFromCommaSeparatedText(str)).toBe(`
|hello|world|
|this is a valid table|hey!|
    `.trim())
  })

  test('valid case: with trailing newline', () => {
    const str = `
hello,world
this is a valid table,hey!
    `

    expect(parseTableFromCommaSeparatedText(str)).toBe(`
|hello|world|
|this is a valid table|hey!|
    `.trim())
  })

  test('valid case, with pipe characters', () => {
    const str = `
hello,world
this is a | valid table,hey!
    `

    expect(parseTableFromCommaSeparatedText(str)).toBe(`
|hello|world|
|this is a \\| valid table|hey!|
    `.trim())
  })

  test('valid case, with quotes', () => {
    const str = `
hello,world
"this is a valid, table",hey!
    `

    expect(parseTableFromCommaSeparatedText(str)).toBe(`
|hello|world|
|this is a valid, table|hey!|
    `.trim())
  })

  test('valid case, with uneven quotes', () => {
    const str = `
hello,world
“this is a valid, table”,hey!    
    `

    expect(parseTableFromCommaSeparatedText(str)).toBe(`
|hello|world|
|this is a valid, table|hey!|
    `.trim())
  })
})