import { describe, expect, test } from 'vitest';
import {
  parseMarkdownLink,
  ParseMarkdownLinkError,
  ParseMarkdownLinkErrorCode,
  ParseMarkdownLinkResult
} from './link';

describe('parseMarkdownLink', () => {
  const getError = (selection: string) => {
    try {
      parseMarkdownLink(selection);
      return null;
    } catch (err) {
      return err as ParseMarkdownLinkError;
    }
  };

  test('invalid: too many elements', () => {
    const error = getError('[hehe](https://hello.world) test');

    expect(error).not.toBeNull();
    expect(error!.code).toBe(ParseMarkdownLinkErrorCode.INVALID_ELEMENTS);
  });

  test('invalid: nothing', () => {
    const expected: ParseMarkdownLinkResult = {
      text: '',
      url: ''
    };

    expect(parseMarkdownLink('')).toEqual(expected);
  });

  test('text only', () => {
    const expected: ParseMarkdownLinkResult = {
      text: 'test',
      url: ''
    };

    expect(parseMarkdownLink('test')).toEqual(expected);
  });

  test('url only', () => {
    const expected: ParseMarkdownLinkResult = {
      text: '',
      url: 'https://hello.world'
    };

    expect(parseMarkdownLink('https://hello.world')).toEqual(expected);
  });

  test('text and url', () => {
    const expected: ParseMarkdownLinkResult = {
      text: 'test',
      url: 'https://hello.world'
    };

    expect(parseMarkdownLink('[test](https://hello.world)')).toEqual(expected);
  });
});
