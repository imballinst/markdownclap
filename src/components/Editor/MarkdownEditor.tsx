import { createEffect, createSignal, JSX } from 'solid-js';

import {
  inspectContentStore,
  InspectStatus,
  setInspectContent,
  setInspectStatus
} from '../../store/inspect';
import './MarkdownEditor.css';
import { useStore } from '@nanostores/solid';
import { isKeycodeNumber } from '../../utils/key-parser';
import { addHeading } from '../../utils/headings';
import { ParsedStringResult, parseTableString } from '../../utils/operators/table';
import { markdownStore, setMarkdown } from '../../store/markdown';

export const MarkdownEditor = () => {
  const markdown = useStore(markdownStore);

  const [selected, setSelected] = createSignal<[number, number] | undefined>(undefined);
  const [prevSelected, setPrevSelected] = createSignal<[number, number] | undefined>(undefined);
  const editor = useStore(inspectContentStore);

  let textareaElement: HTMLTextAreaElement | undefined;

  createEffect<string | undefined>((previous) => {
    const rawContent = editor()?.rawContent;

    if (previous !== undefined && rawContent !== undefined && previous !== rawContent) {
      const value = prevSelected();
      if (!value) return;

      const [start, end] = value;
      setPrevSelected(undefined);
      setMarkdown(markdown().slice(0, start).concat(rawContent).concat(markdown().slice(end)));
    }

    return rawContent;
  }, editor()?.rawContent);

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
    <div class="flex flex-col mt-4">
      <div class="flex justify-end">
        <button
          type="button"
          class="button-sm"
          disabled={selected() === undefined}
          onClick={() => {
            let effectiveValue = markdown();
            let parseResult: ParsedStringResult = undefined;

            if (textareaElement) {
              const { selectionStart, selectionEnd } = textareaElement;

              effectiveValue = effectiveValue.slice(selectionStart, selectionEnd);
              parseResult = parseTableString(effectiveValue);

              // Remove the currently selected element.
              textareaElement.setSelectionRange(0, 0);
            }

            if (parseResult?.type === 'table') {
              setInspectContent(parseResult);
            }

            setInspectStatus(InspectStatus.InspectingSnippet);
            setPrevSelected(selected());
            setSelected(undefined);
          }}
        >
          Inspect selection
        </button>
      </div>
      <textarea
        ref={textareaElement}
        class="markdown-editor"
        value={markdown()}
        onKeyDown={onKeyDown}
        onSelect={(e) => {
          const { selectionStart, selectionEnd } = e.currentTarget;
          if (selectionStart + selectionEnd === 0) {
            setSelected(undefined);
          } else {
            setSelected([selectionStart, selectionEnd]);
          }
        }}
        onInput={(e) => {
          setMarkdown(e.currentTarget.value ?? '');
        }}
      />
    </div>
  );
};
