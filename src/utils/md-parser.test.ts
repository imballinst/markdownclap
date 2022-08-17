import { describe, expect, test } from 'vitest';
import { isTableString } from './md-parser';

describe('isTableString', () => {
  describe('valid table', () => {
    test('1 column', () => {
      let table = `
        | Name |
        | ---- |
        | hehe |
      `;
      expect(isTableString(table)).toBe(true);

      table = `
        |Name|
        |-|
        |hehe|
      `;
      expect(isTableString(table)).toBe(true);
    });

    test('2 columns', () => {
      let table = `
        | Name | Username |
        | ---- | -------- |
        | hehe | hehehehe |
      `;
      expect(isTableString(table)).toBe(true);

      table = `
        |Name|Username|
        |-|-|
        |hehe|hehehehe|
      `;
      expect(isTableString(table)).toBe(true);
    });

    test('3 columns', () => {
      let table = `
        | Name | Username | Created At |
        | ---- | -------- | ---------- |
        | hehe | hehehehe | hehehehehe |
      `;
      expect(isTableString(table)).toBe(true);

      table = `
        |Name|Username|Created At|
        |-|----|---|
        |he|heh|he|
      `;
      expect(isTableString(table)).toBe(true);
    });

    test('3 columns, escaped |', () => {
      let table = `
        | Name | Username | Created At |
        | ---- | -------- | ---------- |
        | hehe | hehehehe | heh \\|| hee |
      `;
      expect(isTableString(table)).toBe(true);

      table = `
        |Name|Username|Created At|
        |-|----|---|
        |he|heh|heh\\||hee|
      `;
      expect(isTableString(table)).toBe(true);
    });
  });

  describe('invalid table', () => {
    test('0 rows', () => {
      let table = `
        | Name |
        | ---- |
      `;
      expect(isTableString(table)).toBe(false);

      table = `
        |Name|
        |-|
      `;
      expect(isTableString(table)).toBe(false);
    });

    test('invalid header/body separator', () => {
      let table = `
        | Name | Username |
        |||
        | hehe | hehehehe |
      `;
      expect(isTableString(table)).toBe(false);

      table = `
        |Name|Username|
        |||
        |hehe|hehehehe|
      `;
      expect(isTableString(table)).toBe(false);
    });

    test('inequal columns in header', () => {
      let table = `
        | Name |
        | ---- |
        | hehe | hehehehe |
      `;
      expect(isTableString(table)).toBe(false);

      table = `
        |Name|
        ||
        |hehe|hehehehe|
      `;
      expect(isTableString(table)).toBe(false);
    });

    test('inequal columns in body', () => {
      let table = `
        | Name | Username |
        |||
        | hehe |
      `;
      expect(isTableString(table)).toBe(false);

      table = `
        |Name|Username|
        |||
        |hehe|
      `;
      expect(isTableString(table)).toBe(false);
    });
  });
});
