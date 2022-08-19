import { createEffect, createSignal, JSX } from 'solid-js';
import { marked } from 'marked';

import { closeEditorSidebar, editorStore, openEditorSidebar } from '../../store/editor';
import './MarkdownEditor.css';
import { useStore } from '@nanostores/solid';
import { isKeycodeNumber } from '../../utils/key-parser';
import { addHeading } from '../../utils/headings';
import { ParsedStringResult, parseTableString } from '../../utils/operators/table';

const DEFAULT_STRING = `
Sample paragraph

|No|Name|
|-|-|
|1|hehe|
|2|hehe|
|3|hehe|
|4|hehe|
|5|hehe|
|6|hehe|
|7|hehe|
|8|hehe|
|9|hehe|
|10|hehe|
|11|hehe|

Sample paragraph
`.trim();

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = createSignal(DEFAULT_STRING);
  const [selected, setSelected] = createSignal([0, 0]);
  const editor = useStore(editorStore);
  let textareaElement: HTMLTextAreaElement | undefined;

  createEffect<string | undefined>((previous) => {
    const rawContent = editor().sidebarContent?.rawContent;

    if (previous !== undefined && rawContent !== undefined && previous !== rawContent) {
      const [start, end] = selected();
      const selectedLength = end - start;
      const rawContentLength = rawContent.length;
      const diff = rawContentLength - selectedLength;

      setSelected([start, end + diff]);
      setMarkdown(markdown().slice(0, start).concat(rawContent).concat(markdown().slice(end)));
    }

    return rawContent;
  }, editor().sidebarContent?.rawContent);

  const onKeyDown: JSX.TextareaHTMLAttributes<HTMLTextAreaElement>['onKeyDown'] = (e) => {
    if (e.code === 'Tab') {
      e.preventDefault();
      return setMarkdown((prev) => prev + '  ');
    }

    if (isKeycodeNumber(e.key) && e.altKey && e.ctrlKey) {
      const number = Number(e.key);
      const { selectionStart, selectionEnd } = e.currentTarget;

      return queueMicrotask(() => {
        const headingStr = addHeading(number);

        setMarkdown((currentValue) => {
          let lastNewlineIndex = selectionStart === 0 ? 0 : selectionStart - 1;
          let found = false;

          while (!found && lastNewlineIndex > 0) {
            if (currentValue.charAt(lastNewlineIndex) === '\n') {
              found = true;
              break;
            }
            lastNewlineIndex--;
          }

          if (lastNewlineIndex === 0) {
            return `${headingStr}${currentValue}`;
          }

          return currentValue
            .slice(0, lastNewlineIndex + 1)
            .concat(headingStr)
            .concat(currentValue.slice(lastNewlineIndex + 1));
        });
        textareaElement?.setSelectionRange(
          selectionStart + headingStr.length,
          selectionEnd + headingStr.length
        );
      });
    }
  };

  return (
    <>
      <button
        onClick={() => {
          const { sidebarContent } = editor();
          let effectiveValue = markdown();
          let parseResult: ParsedStringResult = undefined;

          if (textareaElement) {
            const { selectionStart, selectionEnd } = textareaElement;

            effectiveValue = effectiveValue.slice(selectionStart, selectionEnd);
            parseResult = parseTableString(effectiveValue);

            // Save the last selected text.
            if (parseResult !== undefined) {
              setSelected([selectionStart, selectionEnd]);
            }

            // Remove the currently selected element.
            textareaElement.setSelectionRange(0, 0);
          }

          if (sidebarContent !== undefined) {
            closeEditorSidebar();
          } else if (parseResult?.type === 'table') {
            openEditorSidebar(parseResult);
          }
        }}
      >
        Open in sidebar
      </button>
      <textarea
        ref={textareaElement}
        class="markdown-editor"
        value={markdown()}
        onKeyDown={onKeyDown}
        onInput={(e) => {
          setMarkdown(e.currentTarget.value ?? '');
        }}
      />
      <pre innerHTML={marked(markdown())} />
    </>
  );
};

export default MarkdownEditor;

// Helper functions.
