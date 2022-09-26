import { useStore } from '@nanostores/solid';
import { Accessor, Setter } from 'solid-js';
import { markdownStore, setMarkdown } from '../../../store/markdown';
import { getTextFromAction, ToolbarAction } from '../../../utils/operators/toolbar';

interface ToolbarProps {
  selected: Accessor<[number, number] | undefined>;
  setSelected: Setter<[number, number] | undefined>;
  textareaElement: HTMLTextAreaElement | undefined;
}

export function Toolbar({ selected, setSelected, textareaElement }: ToolbarProps) {
  const markdown = useStore(markdownStore);

  return (
    <div class="space-x-1">
      <button
        class="button-sm w-8"
        title="Add bold Markdown syntax to the selected texts"
        onClick={() => {
          const result = modifyTextSelection({
            action: ToolbarAction.TOGGLE_BOLD,
            selected,
            textAreaValue: markdown()
          });
          setSelected(result.selected);
          setMarkdown(result.markdown);
          textareaElement?.setSelectionRange(result.selected[0], result.selected[1]);
        }}
      >
        B
      </button>
      <button class="button-sm w-8" title="Add italic Markdown syntax to the selected texts">
        I
      </button>
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
  selected: selectedParam
}: FirstGetTextFromActionParams & Pick<ToolbarProps, 'selected'>): {
  selected: [number, number];
  markdown: string;
} {
  const selected = selectedParam();
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
