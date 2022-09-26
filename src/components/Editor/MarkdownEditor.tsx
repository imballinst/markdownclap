import { createEffect, createSignal, JSX } from 'solid-js';

import {
  inspectContentStore,
  InspectStatus,
  setInspectContent,
  setInspectStatus
} from '../../store/inspect';
import './MarkdownEditor.css';
import { useStore } from '@nanostores/solid';
import { extractNumberFromCode } from '../../utils/key-parser';
import { addHeading } from '../../utils/headings';
import { ParsedStringResult, parseTableString } from '../../utils/operators/table';
import { markdownStore, setMarkdown } from '../../store/markdown';
import { setAlert } from '../../store/alert';
import { modifyTextSelection, Toolbar } from './Toolbar';
import { ToolbarAction } from '../../utils/operators/toolbar';

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

    const codeToNumber = extractNumberFromCode(e.code);

    if (!isNaN(codeToNumber) && e.altKey && (e.ctrlKey || e.metaKey)) {
      const { selectionStart, selectionEnd } = e.currentTarget;

      return queueMicrotask(() => {
        const headingStr = addHeading(codeToNumber);

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
    } else if (e.ctrlKey || e.metaKey) {
      // Ctrl is for non-Mac, whereas metaKey is for Mac.
      let action: ToolbarAction | undefined = undefined;

      switch (e.key) {
        case 'b': {
          e.preventDefault();
          action = ToolbarAction.TOGGLE_BOLD;
          break;
        }
        case 'i': {
          e.preventDefault();
          action = ToolbarAction.TOGGLE_ITALIC;
          break;
        }
        default: {
          break;
        }
      }

      if (action) {
        const result = modifyTextSelection({
          action,
          selected,
          textAreaValue: markdown()
        });
        setSelected(result.selected);
        setMarkdown(result.markdown);
        textareaElement?.setSelectionRange(result.selected[0], result.selected[1]);
      }
    }
  };

  return (
    <div class="flex flex-col mt-4">
      <div class="flex justify-between">
        <Toolbar selected={selected} setSelected={setSelected} textareaElement={textareaElement} />

        <button
          type="button"
          class="button-sm"
          disabled={selected() === undefined}
          onClick={() => {
            let effectiveValue = markdown();
            let parseResult: ParsedStringResult = undefined;
            let selectionStart = 0;
            let selectionEnd = 0;

            if (textareaElement) {
              selectionStart = textareaElement.selectionStart;
              selectionEnd = textareaElement.selectionEnd;

              effectiveValue = effectiveValue.slice(selectionStart, selectionEnd);
              parseResult = parseTableString(effectiveValue);

              // Remove the currently selected element.
              textareaElement.setSelectionRange(0, 0);
            }

            if (parseResult === undefined) {
              setAlert({
                message:
                  'Cannot inspect element: element is not supported yet for inspection or selections are invalid.',
                type: 'error'
              });
              return;
            }

            setInspectContent(parseResult);
            setInspectStatus(InspectStatus.InspectingSnippet);
            setPrevSelected([selectionStart, selectionEnd]);
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
        onKeyUp={(e) => {
          const { selectionStart, selectionEnd } = e.currentTarget;
          if (selectionStart === selectionEnd) {
            setSelected(undefined);
          } else {
            setSelected([selectionStart, selectionEnd]);
          }
        }}
        onSelect={(e) => {
          const { selectionStart, selectionEnd } = e.currentTarget;
          if (selectionStart === selectionEnd) {
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
