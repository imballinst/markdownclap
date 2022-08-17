import { describe, expect, test } from 'vitest';
import { ParsedStringResult, parseTableString } from './md-parser';

describe('parseTableString', () => {
  describe('valid table', () => {
    test('1 column', () => {
      let table = `
        | Name |
        | ---- |
        | hehe |
      `;
      const result: ParsedStringResult = {
        type: 'table',
        rawContent: table,
        content: {
          headers: [
            {
              content: 'Name',
              post: ' ',
              pre: ' '
            }
          ],
          rows: [
            [
              {
                content: 'hehe',
                post: ' ',
                pre: ' '
              }
            ]
          ]
        }
      };
      expect(parseTableString(table)).toEqual(result);

      table = `
        |Name|
        |-|
        |hehe|
      `;
      result.rawContent = table;
      result.content = {
        headers: [
          {
            content: 'Name',
            post: '',
            pre: ''
          }
        ],
        rows: [
          [
            {
              content: 'hehe',
              post: '',
              pre: ''
            }
          ]
        ]
      };
      expect(parseTableString(table)).toEqual(result);
    });

    test('2 columns', () => {
      let table = `
        | Name | Username |
        | ---- | -------- |
        | hehe | hehehehe |
      `;
      const result: ParsedStringResult = {
        type: 'table',
        rawContent: table,
        content: {
          headers: [
            {
              content: 'Name',
              post: ' ',
              pre: ' '
            },
            {
              content: 'Username',
              post: ' ',
              pre: ' '
            }
          ],
          rows: [
            [
              {
                content: 'hehe',
                post: ' ',
                pre: ' '
              },
              {
                content: 'hehehehe',
                post: ' ',
                pre: ' '
              }
            ]
          ]
        }
      };
      expect(parseTableString(table)).toEqual(result);

      table = `
        |Name|Username|
        |-|-|
        |hehe|hehehehe|
      `;
      result.rawContent = table;
      result.content = {
        headers: [
          {
            content: 'Name',
            post: '',
            pre: ''
          },
          {
            content: 'Username',
            post: '',
            pre: ''
          }
        ],
        rows: [
          [
            {
              content: 'hehe',
              post: '',
              pre: ''
            },
            {
              content: 'hehehehe',
              post: '',
              pre: ''
            }
          ]
        ]
      };
      expect(parseTableString(table)).toEqual(result);
    });

    test('3 columns', () => {
      let table = `
        | Name | Username | Created At |
        | ---- | -------- | ---------- |
        | hehe | hehehehe | hehehehehe |
      `;
      const result: ParsedStringResult = {
        type: 'table',
        rawContent: table,
        content: {
          headers: [
            {
              content: 'Name',
              post: ' ',
              pre: ' '
            },
            {
              content: 'Username',
              post: ' ',
              pre: ' '
            },
            {
              content: 'Created At',
              post: ' ',
              pre: ' '
            }
          ],
          rows: [
            [
              {
                content: 'hehe',
                post: ' ',
                pre: ' '
              },
              {
                content: 'hehehehe',
                post: ' ',
                pre: ' '
              },
              {
                content: 'hehehehehe',
                post: ' ',
                pre: ' '
              }
            ]
          ]
        }
      };
      expect(parseTableString(table)).toEqual(result);

      table = `
        |Name|Username|Created At|
        |-|----|---|
        |hehe|hehehehe|hehehehehe|
      `;
      result.rawContent = table;
      result.content = {
        headers: [
          {
            content: 'Name',
            post: '',
            pre: ''
          },
          {
            content: 'Username',
            post: '',
            pre: ''
          },
          {
            content: 'Created At',
            post: '',
            pre: ''
          }
        ],
        rows: [
          [
            {
              content: 'hehe',
              post: '',
              pre: ''
            },
            {
              content: 'hehehehe',
              post: '',
              pre: ''
            },
            {
              content: 'hehehehehe',
              post: '',
              pre: ''
            }
          ]
        ]
      };
      expect(parseTableString(table)).toEqual(result);
    });

    test('3 columns, escaped |', () => {
      let table = `
        | Name | Username | Created At |
        | ---- | -------- | ---------- |
        | hehe | hehehehe | heh \\| hee |
      `;
      const result: ParsedStringResult = {
        type: 'table',
        rawContent: table,
        content: {
          headers: [
            {
              content: 'Name',
              post: ' ',
              pre: ' '
            },
            {
              content: 'Username',
              post: ' ',
              pre: ' '
            },
            {
              content: 'Created At',
              post: ' ',
              pre: ' '
            }
          ],
          rows: [
            [
              {
                content: 'hehe',
                post: ' ',
                pre: ' '
              },
              {
                content: 'hehehehe',
                post: ' ',
                pre: ' '
              },
              {
                content: 'heh \\| hee',
                post: ' ',
                pre: ' '
              }
            ]
          ]
        }
      };
      expect(parseTableString(table)).toEqual(result);

      table = `
        |Name|Username|Created At|
        |-|----|---|
        |hehe|hehehehe|heh \\| hee|
      `;
      result.rawContent = table;
      result.content = {
        headers: [
          {
            content: 'Name',
            post: '',
            pre: ''
          },
          {
            content: 'Username',
            post: '',
            pre: ''
          },
          {
            content: 'Created At',
            post: '',
            pre: ''
          }
        ],
        rows: [
          [
            {
              content: 'hehe',
              post: '',
              pre: ''
            },
            {
              content: 'hehehehe',
              post: '',
              pre: ''
            },
            {
              content: 'heh \\| hee',
              post: '',
              pre: ''
            }
          ]
        ]
      };
      expect(parseTableString(table)).toEqual(result);
    });
  });

  describe('invalid table', () => {
    test('0 rows', () => {
      let table = `
        | Name |
        | ---- |
      `;
      expect(parseTableString(table)).toEqual(undefined);

      table = `
        |Name|
        |-|
      `;
      expect(parseTableString(table)).toEqual(undefined);
    });

    test('invalid header/body separator', () => {
      let table = `
        | Name | Username |
        |||
        | hehe | hehehehe |
      `;
      expect(parseTableString(table)).toEqual(undefined);

      table = `
        |Name|Username|
        |||
        |hehe|hehehehe|
      `;
      expect(parseTableString(table)).toEqual(undefined);
    });

    test('inequal columns in header', () => {
      let table = `
        | Name |
        | ---- |
        | hehe | hehehehe |
      `;
      expect(parseTableString(table)).toEqual(undefined);

      table = `
        |Name|
        ||
        |hehe|hehehehe|
      `;
      expect(parseTableString(table)).toEqual(undefined);
    });

    test('inequal columns in body', () => {
      let table = `
        | Name | Username |
        |||
        | hehe |
      `;
      expect(parseTableString(table)).toEqual(undefined);

      table = `
        |Name|Username|
        |||
        |hehe|
      `;
      expect(parseTableString(table)).toEqual(undefined);
    });
  });
});
