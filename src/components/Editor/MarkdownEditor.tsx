import { createEffect, createSignal, JSX } from 'solid-js';

import {
  inspectContentStore,
  InspectStatus,
  setInspectContent,
  setInspectStatus,
  inspectStatusStore
} from '../../store/inspect';
import './MarkdownEditor.css';
import { useStore } from '@nanostores/solid';
import {
  extractNumberFromKey,
  isCtrlOrCmdKey,
  isNumberHeadings
} from '../../utils/parsers/keycode';
import { ParsedStringResult, parseTableString } from '../../utils/operators/table';
import { markdownStore, setMarkdown } from '../../store/markdown';
import { setAlert } from '../../store/alert';
import { modifyTextSelection, Toolbar } from './Toolbar';
import { ToolbarAction } from '../../utils/operators/toolbar';
import { Button } from '../Button';
import { getToolbarHoverText } from './Toolbar/common';
import {
  parseTableFromCommaSeparatedText,
  parseTableFromTabbedText
} from '../../utils/parsers/table';
import { HOTKEYS } from '../../constants/hotkeys';
import { parseSelectionAndOpenModal } from './Toolbar/LinkToolbarButton';

export const MarkdownEditor = () => {
  const markdown = useStore(markdownStore);
  const editor = useStore(inspectContentStore);
  const inspectStatus = useStore(inspectStatusStore);

  const [selected, setSelected] = createSignal<[number, number] | undefined>(undefined);
  const [prevSelected, setPrevSelected] = createSignal<[number, number] | undefined>(undefined);
  const [textAreaElement, setTextAreaElement] = createSignal<HTMLTextAreaElement | undefined>(
    undefined
  );

  const [isRawPaste, setIsRawPaste] = createSignal(false);

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

  const onInspectElement = () => {
    const textArea = textAreaElement();
    let effectiveValue = markdown();
    let parseResult: ParsedStringResult = undefined;
    let selectionStart = 0;
    let selectionEnd = 0;

    if (textArea) {
      selectionStart = textArea.selectionStart;
      selectionEnd = textArea.selectionEnd;

      effectiveValue = effectiveValue.slice(selectionStart, selectionEnd);
      parseResult = parseTableString(effectiveValue);

      // Remove the currently selected element.
      textArea.setSelectionRange(0, 0);
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
  };

  const onKeyDown: JSX.TextareaHTMLAttributes<HTMLTextAreaElement>['onKeyDown'] = (e) => {
    if (e.key.toLowerCase() === 'v' && e.shiftKey && isCtrlOrCmdKey(e)) {
      setIsRawPaste(true);
      return;
    }

    const { selectionStart, selectionEnd } = e.currentTarget;

    if (e.key === 'Tab' && selectionStart === selectionEnd) {
      e.preventDefault();
      setMarkdown((prev) => prev.slice(0, selectionStart) + '  ' + prev.slice(selectionStart + 1));
      e.currentTarget.setSelectionRange(selectionStart + 2, selectionEnd + 2);
      return;
    }

    const codeToNumber = extractNumberFromKey(e.key);

    if (isNumberHeadings(codeToNumber) && e.altKey && isCtrlOrCmdKey(e)) {
      // The combination is Ctrl/Cmd + Alt + 1-6.
      const action: ToolbarAction = ToolbarAction[`TOOLBAR_HEADING_${codeToNumber}`];

      if (action) {
        const result = modifyTextSelection({
          action,
          selected: [selectionStart, selectionEnd],
          textAreaValue: markdown()
        });
        setSelected(result.selected);
        setMarkdown(result.markdown);
        textAreaElement()?.setSelectionRange(result.selected[0], result.selected[1]);
      }
    } else if (isCtrlOrCmdKey(e)) {
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
        case '`': {
          e.preventDefault();
          onInspectElement();
          break;
        }
        case 'k': {
          e.preventDefault();
          const textAreaEl = textAreaElement()
          if (!textAreaEl) return

          parseSelectionAndOpenModal({ selection: [textAreaEl.selectionStart, textAreaEl.selectionEnd], markdown: markdown() })
          break;
        }
        default: {
          break;
        }
      }

      if (action) {
        const result = modifyTextSelection({
          action,
          selected: selected(),
          textAreaValue: markdown()
        });
        setSelected(result.selected);
        setMarkdown(result.markdown);
        textAreaElement()?.setSelectionRange(result.selected[0], result.selected[1]);
      }
    }
  };

  function isInspectSelectionButtonDisabled() {
    const selectedValue = selected();
    if (!selectedValue) return true;

    return selectedValue[0] === selectedValue[1];
  }

  return (
    <fieldset
      class="flex flex-col mt-4"
      disabled={inspectStatus() === InspectStatus.InspectingSnippet}
    >
      <div class="flex justify-between">
        <Toolbar setSelected={setSelected} textAreaElement={textAreaElement} />

        <Button
          variant="primary"
          size="sm"
          isDisabled={isInspectSelectionButtonDisabled}
          title={getToolbarHoverText(HOTKEYS.Inspect)}
          onClick={onInspectElement}
        >
          Inspect Element
        </Button>
      </div>
      <textarea
        ref={setTextAreaElement}
        class="markdown-editor"
        value={markdown()}
        onKeyDown={onKeyDown}
        onKeyUp={(e) => {
          // Using keyboard.
          const { selectionStart, selectionEnd } = e.currentTarget;
          if (selectionStart === selectionEnd) {
            setSelected(undefined);
          } else {
            setSelected([selectionStart, selectionEnd]);
          }
        }}
        onClick={(e) => {
          // Using mouse.
          const { selectionStart, selectionEnd } = e.currentTarget;
          if (selectionStart === selectionEnd) {
            setSelected(undefined);
          } else {
            setSelected([selectionStart, selectionEnd]);
          }
        }}
        onInput={(e) => {
          const nextValue = e.currentTarget.value ?? '';
          setMarkdown(nextValue);
        }}
        onPaste={(e) => {
          if (isRawPaste()) {
            // Reset the thing that we set on `onKeyDown`.
            // Since we don't do prevent default here, it'll passthrough to `onInput`.
            setIsRawPaste(false);
            return;
          }

          const pasted = e.clipboardData?.getData('text/plain');
          // First, try parse from tabbed text.
          let parseResult = parseTableFromTabbedText(pasted);
          if (!parseResult) {
            // If the parse fails, check with comma-separated.
            parseResult = parseTableFromCommaSeparatedText(pasted);
            console.debug(parseResult);
          }

          if (parseResult) {
            e.preventDefault();
            const selectionStart = e.currentTarget.selectionStart;
            setMarkdown((prev) =>
              prev.slice(0, selectionStart).concat(parseResult!).concat(prev.slice(selectionStart))
            );

            const nextSelectionRange = selectionStart + parseResult.length;
            e.currentTarget.setSelectionRange(nextSelectionRange, nextSelectionRange);
          }
        }}
      />
    </fieldset>
  );
};
