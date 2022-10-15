import { Accessor, JSX, Setter } from 'solid-js';
import { setMarkdown } from '../../../store/markdown';
import { getTextFromAction, ToolbarAction } from '../../../utils/operators/toolbar';
import { Button } from '../../Button';
import { getToolbarHoverText } from './common';
import { HeadingToolbarButton } from './HeadingToolbarButton';

interface ToolbarProps {
  setSelected: Setter<[number, number] | undefined>;
  textAreaElement: Accessor<HTMLTextAreaElement | undefined>;
}

export function Toolbar({ setSelected, textAreaElement }: ToolbarProps) {
  const onButtonClick: JSX.DOMAttributes<HTMLButtonElement>['onClick'] = (event) => {
    const action = event.currentTarget.dataset['action'] as ToolbarAction;
    const textArea = textAreaElement();

    if (textArea) {
      const result = modifyTextSelection({
        action,
        selected: [textArea.selectionStart, textArea.selectionEnd],
        textAreaValue: textArea.value
      });

      setSelected(result.selected);
      setMarkdown(result.markdown);
      textArea.setSelectionRange(result.selected[0], result.selected[1]);
      textArea.focus();
    }
  };

  return (
    <div class="space-x-1">
      <Button
        variant="primary"
        size="sm"
        class="w-8"
        title={getToolbarHoverText({ text: 'Bold', keys: ['b'] })}
        onClick={onButtonClick}
        data-action={ToolbarAction.TOGGLE_BOLD}
      >
        B
      </Button>
      <Button
        variant="primary"
        size="sm"
        class="w-8"
        title={getToolbarHoverText({ text: 'Italic', keys: ['i'] })}
        onClick={onButtonClick}
        data-action={ToolbarAction.TOGGLE_ITALIC}
      >
        I
      </Button>
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
