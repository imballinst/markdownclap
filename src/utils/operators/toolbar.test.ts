import { describe, expect, test } from 'vitest';
import { getTextFromAction, ToolbarAction } from './toolbar';

describe('getTextFromAction', () => {
  test('headings', () => {
    let initial = `
test123

helloworld. This is a sample text
    `.trim();
    let result = getTextFromAction({
      action: ToolbarAction.TOOLBAR_HEADING_1,
      selectionStart: initial.indexOf('test123'),
      selectionEnd: initial.indexOf('test123'),
      textAreaValue: initial
    });

    expect(result.text).toBe(
      `
# test123

helloworld. This is a sample text
    `.trim()
    );

    // Try revert.
    result = getTextFromAction({
      action: ToolbarAction.TOOLBAR_HEADING_1,
      selectionStart: result.selected[0],
      selectionEnd: result.selected[1],
      textAreaValue: result.text
    });

    expect(result.text).toBe(initial);

    // Try adding the heading again, this time heading 2.
    result = getTextFromAction({
      action: ToolbarAction.TOOLBAR_HEADING_2,
      selectionStart: result.selected[0],
      selectionEnd: result.selected[1],
      textAreaValue: result.text
    });

    expect(result.text).toBe(
      `
## test123

helloworld. This is a sample text
    `.trim()
    );

    // Try adding heading 3, the previous heading should be replaced.
    result = getTextFromAction({
      action: ToolbarAction.TOOLBAR_HEADING_3,
      selectionStart: result.selected[0],
      selectionEnd: result.selected[0],
      textAreaValue: result.text
    });

    expect(result.text).toBe(
      `
### test123

helloworld. This is a sample text
    `.trim()
    );
  });

  describe('formattings', () => {
    describe('singles', () => {
      test('bold', () => {
        const initial = 'test helloworld test';
        let result = getTextFromAction({
          action: ToolbarAction.TOGGLE_BOLD,
          selectionStart: initial.indexOf('helloworld'),

          selectionEnd: initial.indexOf('helloworld') + 'helloworld'.length,
          textAreaValue: initial
        });

        expect(result.text).toBe('test **helloworld** test');

        // Revert back.
        result = getTextFromAction({
          action: ToolbarAction.TOGGLE_BOLD,
          selectionStart: result.selected[0],
          selectionEnd: result.selected[1],
          textAreaValue: result.text
        });

        expect(result.text).toBe('test helloworld test');
      });

      test('italic', () => {
        const initial = 'test helloworld test';
        let result = getTextFromAction({
          action: ToolbarAction.TOGGLE_ITALIC,
          selectionStart: initial.indexOf('helloworld'),

          selectionEnd: initial.indexOf('helloworld') + 'helloworld'.length,
          textAreaValue: initial
        });

        expect(result.text).toBe('test _helloworld_ test');

        // Revert back.
        result = getTextFromAction({
          action: ToolbarAction.TOGGLE_ITALIC,
          selectionStart: result.selected[0],
          selectionEnd: result.selected[1],
          textAreaValue: result.text
        });

        expect(result.text).toBe('test helloworld test');
      });
    });

    describe('couples', () => {
      test('bold and italic', () => {
        // Bold first.
        const initial = 'test helloworld test';
        let result = getTextFromAction({
          action: ToolbarAction.TOGGLE_BOLD,
          selectionStart: initial.indexOf('helloworld'),

          selectionEnd: initial.indexOf('helloworld') + 'helloworld'.length,
          textAreaValue: initial
        });

        expect(result.text).toBe('test **helloworld** test');

        // Then, italic.
        result = getTextFromAction({
          action: ToolbarAction.TOGGLE_ITALIC,
          selectionStart: result.selected[0],
          selectionEnd: result.selected[1],
          textAreaValue: result.text
        });

        expect(result.text).toBe('test **_helloworld_** test');

        // Revert back.
        result = getTextFromAction({
          action: ToolbarAction.TOGGLE_ITALIC,
          selectionStart: result.selected[0],
          selectionEnd: result.selected[1],
          textAreaValue: result.text
        });

        expect(result.text).toBe('test **helloworld** test');

        result = getTextFromAction({
          action: ToolbarAction.TOGGLE_BOLD,
          selectionStart: result.selected[0],
          selectionEnd: result.selected[1],
          textAreaValue: result.text
        });

        expect(result.text).toBe(initial);
      });
    });
  });
});
