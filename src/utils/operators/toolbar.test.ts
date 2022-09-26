import { describe, expect, test } from 'vitest';
import { getTextFromAction, ToolbarAction } from './toolbar';

describe('getTextFromAction', () => {
  describe('singles', () => {
    test('bold', () => {
      const initial = 'test helloworld test';
      let result = getTextFromAction({
        action: ToolbarAction.TOGGLE_BOLD,
        selectionStart: initial.indexOf('helloworld'),

        selectionEnd: initial.indexOf('helloworld') + 'helloworld'.length,
        textAreaValue: initial
      });

      expect(result).toBe('test **helloworld** test');

      // Revert back.
      result = getTextFromAction({
        action: ToolbarAction.TOGGLE_BOLD,
        selectionStart: result.indexOf('helloworld'),
        selectionEnd: result.indexOf('helloworld') + 'helloworld'.length,
        textAreaValue: result
      });

      expect(result).toBe('test helloworld test');
    });

    test('italic', () => {
      const initial = 'test helloworld test';
      let result = getTextFromAction({
        action: ToolbarAction.TOGGLE_ITALIC,
        selectionStart: initial.indexOf('helloworld'),

        selectionEnd: initial.indexOf('helloworld') + 'helloworld'.length,
        textAreaValue: initial
      });

      expect(result).toBe('test _helloworld_ test');

      // Revert back.
      result = getTextFromAction({
        action: ToolbarAction.TOGGLE_ITALIC,
        selectionStart: result.indexOf('helloworld'),
        selectionEnd: result.indexOf('helloworld') + 'helloworld'.length,
        textAreaValue: result
      });

      expect(result).toBe('test helloworld test');
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

      expect(result).toBe('test **helloworld** test');

      // Then, italic.
      result = getTextFromAction({
        action: ToolbarAction.TOGGLE_ITALIC,
        selectionStart: result.indexOf('helloworld'),
        selectionEnd: result.indexOf('helloworld') + 'helloworld'.length,
        textAreaValue: result
      });

      expect(result).toBe('test **_helloworld_** test');

      // Revert back.
      result = getTextFromAction({
        action: ToolbarAction.TOGGLE_ITALIC,
        selectionStart: result.indexOf('helloworld'),
        selectionEnd: result.indexOf('helloworld') + 'helloworld'.length,
        textAreaValue: result
      });

      expect(result).toBe('test **helloworld** test');

      result = getTextFromAction({
        action: ToolbarAction.TOGGLE_BOLD,
        selectionStart: result.indexOf('helloworld'),
        selectionEnd: result.indexOf('helloworld') + 'helloworld'.length,
        textAreaValue: result
      });

      expect(result).toBe(initial);
    });
  });
});
