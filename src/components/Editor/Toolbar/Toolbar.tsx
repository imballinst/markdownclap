import { Accessor, JSX, Setter } from 'solid-js';
import { setMarkdown } from '../../../store/markdown';
import { getTextFromAction, ToolbarAction } from '../../../utils/operators/toolbar';
import { Button } from '../../Button';
import { getToolbarHoverText } from './common';
import { HeadingToolbarButton } from './HeadingToolbarButton';
import { CSVToolbarButton } from './CSVToolbarButton';
import { HOTKEYS } from '../../../constants/hotkeys';
import { LinkToolbarButton } from './LinkToolbarButton';
import { ToolbarProcessResultType } from './types';

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
    <div class="flex space-x-1">
      <Button
        variant="primary"
        size="sm"
        class="w-8"
        title={getToolbarHoverText(HOTKEYS.Bold)}
        onClick={onButtonClick}
        data-action={ToolbarAction.TOGGLE_BOLD}
      >
        B
      </Button>
      <Button
        variant="primary"
        size="sm"
        class="w-8"
        title={getToolbarHoverText(HOTKEYS.Italic)}
        onClick={onButtonClick}
        data-action={ToolbarAction.TOGGLE_ITALIC}
      >
        I
      </Button>
      <HeadingToolbarButton onClick={onButtonClick} />

      <CSVToolbarButton textAreaElement={textAreaElement} />
      <LinkToolbarButton textAreaElement={textAreaElement} />
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
}: FirstGetTextFromActionParams & {
  selected: [number, number] | undefined;
}): ToolbarProcessResultType {
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

  return {
    // Increment the selection, because we are adding new characters before the text.
    // Or, decrement the selection indices, because of the same reason.
    selected: result.selected,
    markdown: result.text
  };
}
