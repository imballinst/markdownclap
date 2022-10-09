import { useStore } from '@nanostores/solid';
import { Accessor, JSX, Setter } from 'solid-js';
import { markdownStore, setMarkdown } from '../../../store/markdown';
import { getTextFromAction, ToolbarAction } from '../../../utils/operators/toolbar';
import { getToolbarHoverText } from './common';
import { HeadingToolbarButton } from './HeadingToolbarButton';

interface ToolbarProps {
  selected: Accessor<[number, number] | undefined>;
  setSelected: Setter<[number, number] | undefined>;
  textAreaElement: Accessor<HTMLTextAreaElement | undefined>;
}

export function Toolbar({ selected, setSelected, textAreaElement }: ToolbarProps) {
  const markdown = useStore(markdownStore);

  const onButtonClick: JSX.DOMAttributes<HTMLButtonElement>['onClick'] = (event) => {
    const action = event.currentTarget.dataset['action'] as ToolbarAction;
    const result = modifyTextSelection({
      action,
      selected: selected(),
      textAreaValue: markdown()
    });
    const textArea = textAreaElement();

    if (textArea) {
      setSelected(result.selected);
      setMarkdown(result.markdown);
      textArea.setSelectionRange(result.selected[0], result.selected[1]);
      textArea.focus();
    }
  };

  return (
    <div class="space-x-1">
      <button
        class="button-sm w-8"
        title={getToolbarHoverText('Bold', ['b'])}
        onClick={onButtonClick}
        data-action={ToolbarAction.TOGGLE_BOLD}
      >
        B
      </button>
      <button
        class="button-sm w-8"
        title={getToolbarHoverText('Italic', ['i'])}
        onClick={onButtonClick}
        data-action={ToolbarAction.TOGGLE_ITALIC}
      >
        I
      </button>
      <HeadingToolbarButton onClick={onButtonClick} />
    </div>
  );
}

// Helper functions.
type FirstGetTextFromActionParams = Pick<
  Parameters<typeof getTextFromAction>['0'],
  'action' | 'textAreaValue'
>;

// Used to prevent duplication in MarkdownEditor component.
export function modifyTextSelection({
  action,
  textAreaValue,
  selected
}: FirstGetTextFromActionParams & { selected: [number, number] | undefined }): {
  selected: [number, number];
  markdown: string;
} {
  if (!selected) {
    return {
      selected: [0, 0],
      markdown: textAreaValue
    };
  }

  const [selectionStart, selectionEnd] = selected;
  const result = getTextFromAction({
    action,
    textAreaValue,
    selectionEnd,
    selectionStart
  });
  let increment = action.length;

  if (result.length < textAreaValue.length) {
    // Removal.
    increment *= -1;
  } else {
    // Otherwise, do nothing. This is adding the syntax process.
  }

  return {
    // Increment the selection, because we are adding new characters before the text.
    // Or, decrement the selection indices, because of the same reason.
    selected: [selectionStart + increment, selectionEnd + increment],
    markdown: result
  };
}
