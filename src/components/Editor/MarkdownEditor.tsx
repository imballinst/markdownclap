import { createSignal, JSX } from 'solid-js';
import { marked } from 'marked';

import {
  closeEditorSidebar,
  editorStore,
  openEditorSidebar
} from '../../store/editor';
import './MarkdownEditor.scss';
import { useStore } from '@nanostores/solid';
import { isKeycodeNumber } from '../../utils/key-parser';
import { addHeading } from '../../utils/headings';
import { isTableString } from '../../utils/md-parser';

const DEFAULT_STRING = `
qweqwe

|Name|
|-|
|hehe|

zzz

qweqwe
`.trim();

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = createSignal(DEFAULT_STRING);
  const editor = useStore(editorStore);
  let textareaElement: HTMLTextAreaElement | undefined;

  const onKeyDown: JSX.TextareaHTMLAttributes<HTMLTextAreaElement>['onKeyDown'] =
    (e) => {
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
            let lastNewlineIndex =
              selectionStart === 0 ? 0 : selectionStart - 1;
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
          const value = markdown();
          let isTable = false;

          if (textareaElement) {
            const effectiveValue = value.slice(
              textareaElement.selectionStart,
              textareaElement.selectionEnd
            );
            isTable = isTableString(effectiveValue);

            // Remove the currently selected element.
            textareaElement.setSelectionRange(0, 0);
          }

          if (sidebarContent !== undefined) {
            closeEditorSidebar();
          } else if (isTable) {
            openEditorSidebar({ content: value, type: 'table' });
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
