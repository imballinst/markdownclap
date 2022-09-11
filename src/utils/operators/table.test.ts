import { describe, expect, test } from 'vitest';
import {
  alterColumn,
  getTableRawContent,
  ParsedStringResult,
  ParsedTableResult,
  parseTableString
} from './table';

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
          separators: [
            {
              content: '----',
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
        separators: [
          {
            content: '-',
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
          separators: [
            {
              content: '----',
              post: ' ',
              pre: ' '
            },
            {
              content: '--------',
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
        separators: [
          {
            content: '-',
            post: '',
            pre: ''
          },
          {
            content: '-',
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
          separators: [
            {
              content: '----',
              post: ' ',
              pre: ' '
            },
            {
              content: '--------',
              post: ' ',
              pre: ' '
            },
            {
              content: '----------',
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
        separators: [
          {
            content: '-',
            post: '',
            pre: ''
          },
          {
            content: '----',
            post: '',
            pre: ''
          },
          {
            content: '---',
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
          separators: [
            {
              content: '----',
              post: ' ',
              pre: ' '
            },
            {
              content: '--------',
              post: ' ',
              pre: ' '
            },
            {
              content: '----------',
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
        separators: [
          {
            content: '-',
            post: '',
            pre: ''
          },
          {
            content: '----',
            post: '',
            pre: ''
          },
          {
            content: '---',
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

describe('getTableRawContent', () => {
  test('with spacings', () => {
    const result = `
| Name | Username | Created At |
| ---- | -------- | ---------- |
| hehe | hehehehe | heh \\| hee |
      `.trim();
    const content: NonNullable<ParsedStringResult>['content'] = {
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
      separators: [
        {
          content: '----',
          post: ' ',
          pre: ' '
        },
        {
          content: '--------',
          post: ' ',
          pre: ' '
        },
        {
          content: '----------',
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
    };
    expect(getTableRawContent(content)).toEqual(result);
  });

  test('without spacings', () => {
    const result = `
|Name|Username|Created At|
|-|----|---|
|hehe|hehehehe|heh \\| hee|
    `.trim();
    const content: NonNullable<ParsedStringResult>['content'] = {
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
      separators: [
        {
          content: '-',
          post: '',
          pre: ''
        },
        {
          content: '----',
          post: '',
          pre: ''
        },
        {
          content: '---',
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
    expect(getTableRawContent(content)).toEqual(result);
  });
});

describe('alterColumn', () => {
  test('add', () => {
    const initialContent: ParsedTableResult['content'] = {
      headers: [
        {
          content: 'Name',
          post: '',
          pre: ''
        }
      ],
      separators: [
        {
          content: '-',
          post: '',
          pre: ''
        }
      ],
      rows: Array.from(new Array(5), (_, idx) => [
        {
          content: `User ${idx + 1}`,
          post: '',
          pre: ''
        }
      ])
    };
    let alteredContent = {
      header: {
        content: 'No.',
        post: '',
        pre: ''
      },
      separator: {
        content: '-',
        post: '',
        pre: ''
      },
      columns: Array.from(new Array(5), (_, idx) => ({
        content: `${idx + 1}`,
        post: '',
        pre: ''
      }))
    };
    let expected: ParsedTableResult['content'] = {
      headers: [alteredContent.header, ...initialContent.headers],
      separators: [alteredContent.separator, ...initialContent.separators],
      rows: initialContent.rows.map((columns, rowIdx) => [
        alteredContent.columns[rowIdx],
        ...columns
      ])
    };
    let result = alterColumn({
      content: initialContent,
      action: {
        columnIdx: 0,
        content: alteredContent,
        type: 'add'
      }
    });
    expect(expected).toEqual(result);

    // Try adding one more.
    alteredContent = {
      header: {
        content: 'Score',
        post: '',
        pre: ''
      },
      separator: {
        content: '-',
        post: '',
        pre: ''
      },
      columns: Array.from(new Array(5), (_) => ({
        content: `${Math.random() * 100}`,
        post: '',
        pre: ''
      }))
    };
    expected = {
      headers: [...result.headers, alteredContent.header],
      separators: [...result.separators, alteredContent.separator],
      rows: result.rows.map((columns, rowIdx) => [...columns, alteredContent.columns[rowIdx]])
    };
    result = alterColumn({
      content: result,
      action: {
        columnIdx: 2,
        content: alteredContent,
        type: 'add'
      }
    });
    expect(expected).toEqual(result);
  });

  test('delete', () => {
    const content: ParsedTableResult['content'] = {
      headers: [
        {
          content: 'No',
          post: '',
          pre: ''
        },
        {
          content: 'Name',
          post: '',
          pre: ''
        }
      ],
      separators: [
        {
          content: '-',
          post: '',
          pre: ''
        },
        {
          content: '-',
          post: '',
          pre: ''
        }
      ],
      rows: Array.from(new Array(5), (_, idx) => [
        {
          content: `${idx + 1}`,
          post: '',
          pre: ''
        },
        {
          content: `User ${idx + 1}`,
          post: '',
          pre: ''
        }
      ])
    };
    const result = alterColumn({
      content,
      action: {
        columnIdx: 0,
        type: 'delete'
      }
    });

    const expected: ParsedTableResult['content'] = {
      headers: content.headers.slice(1),
      separators: content.separators.slice(1),
      rows: content.rows.map((columns) => columns.slice(1))
    };
    expect(expected).toEqual(result);
  });

  test('replace', () => {
    const content: ParsedTableResult['content'] = {
      headers: [
        {
          content: 'No',
          post: '',
          pre: ''
        },
        {
          content: 'Name',
          post: '',
          pre: ''
        },
        {
          content: 'Description',
          post: '',
          pre: ''
        }
      ],
      separators: [
        {
          content: '-',
          post: '',
          pre: ''
        },
        {
          content: '-',
          post: '',
          pre: ''
        },
        {
          content: '-',
          post: '',
          pre: ''
        }
      ],
      rows: Array.from(new Array(5), (_, idx) => [
        {
          content: `${idx + 1}`,
          post: '',
          pre: ''
        },
        {
          content: `User ${idx + 1}`,
          post: '',
          pre: ''
        },
        {
          content: `Sample description for user ${idx + 1}`,
          post: '',
          pre: ''
        }
      ])
    };

    const alteredContent = {
      columns: Array.from(new Array(5), (_, idx) => ({
        content: `Sample random description for user ${idx + 1}`,
        post: '',
        pre: ''
      })),
      header: {
        content: `Not a description`,
        post: '',
        pre: ''
      },
      separator: {
        content: `-`,
        post: '  ',
        pre: '  '
      }
    };
    const result = alterColumn({
      content,
      action: {
        columnIdx: 2,
        type: 'replace',
        content: alteredContent
      }
    });

    const expected: ParsedTableResult['content'] = {
      headers: content.headers.slice(0, 2).concat(alteredContent.header),
      separators: content.separators.slice(0, 2).concat(alteredContent.separator),
      rows: content.rows.map((columns, rowIdx) =>
        columns.slice(0, 2).concat(alteredContent.columns[rowIdx])
      )
    };
    expect(expected).toEqual(result);
  });

  test('swap', () => {
    const content: ParsedTableResult['content'] = {
      headers: [
        {
          content: 'No',
          post: '',
          pre: ''
        },
        {
          content: 'Name',
          post: '',
          pre: ''
        },
        {
          content: 'Description',
          post: '',
          pre: ''
        }
      ],
      separators: [
        {
          content: '-',
          post: '',
          pre: ''
        },
        {
          content: '-',
          post: '',
          pre: ''
        },
        {
          content: '-',
          post: '',
          pre: ''
        }
      ],
      rows: Array.from(new Array(5), (_, idx) => [
        {
          content: `${idx + 1}`,
          post: '',
          pre: ''
        },
        {
          content: `User ${idx + 1}`,
          post: '',
          pre: ''
        },
        {
          content: `Sample description for user ${idx + 1}`,
          post: '',
          pre: ''
        }
      ])
    };
    const result = alterColumn({
      content,
      action: {
        columnIdx: 0,
        type: 'swap',
        targetColumnIndex: 2
      }
    });

    const expected: ParsedTableResult['content'] = {
      headers: [content.headers[2], content.headers[1], content.headers[0]],
      separators: [content.separators[2], content.separators[1], content.separators[0]],
      rows: content.rows.map((columns) => [columns[2], columns[1], columns[0]])
    };
    expect(expected).toEqual(result);
  });
});
