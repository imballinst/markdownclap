import { useStore } from '@nanostores/solid';
import { Accessor, JSX, onCleanup, onMount } from 'solid-js';
import { HOTKEYS } from '../../../constants/hotkeys';
import { linkModalStore, setLinkModal } from '../../../store/link-modal';
import { setMarkdown } from '../../../store/markdown';
import { parseMarkdownLink } from '../../../utils/operators/link';
import { Button } from '../../Button';
import { LinkIcon } from '../../Icons/Link';
import { Modal } from '../../Modal/Modal';
import { getToolbarHoverText } from './common';

interface LinkToolbarButtonProps {
  textAreaElement: Accessor<HTMLTextAreaElement | undefined>;
}

const LINK_MODAL_TEXT_INPUT_ID = 'link-modal--text';

export function LinkToolbarButton({ textAreaElement }: LinkToolbarButtonProps) {
  const linkModalContent = useStore(linkModalStore);

  const onSubmit: JSX.DOMAttributes<HTMLFormElement>['onSubmit'] = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const textAreaEl = textAreaElement();
    if (!textAreaEl) return;

    const { selectionStart, selectionEnd } = textAreaEl;
    const prevMarkdown = textAreaEl.value;

    const text = formData.get('text')?.toString() || '';
    const url = formData.get('url')?.toString() || '';
    const concatenated = getConcatenatedMarkdown({ text, url });

    const newMarkdown = prevMarkdown
      .slice(0, selectionStart)
      .concat(concatenated)
      .concat(prevMarkdown.slice(selectionEnd));

    setMarkdown(newMarkdown);
    setLinkModal(undefined);

    textAreaEl.focus();
    textAreaEl.setSelectionRange(selectionStart, selectionStart + concatenated.length);
  };

  function onClickButton() {
    const textAreaEl = textAreaElement();
    if (!textAreaEl) return;
    const { selectionStart, selectionEnd } = textAreaEl;

    parseSelectionAndOpenModal({
      markdown: textAreaEl.value,
      selection: [selectionStart, selectionEnd]
    });
  }

  return (
    <>
      <Button
        variant="primary"
        class="w-8 h-full"
        size="sm"
        title={getToolbarHoverText(HOTKEYS.AddOrRemoveLink)}
        onClick={onClickButton}
      >
        <LinkIcon class="w-4 h-4" />
      </Button>

      <Modal isVisible={linkModalContent() !== undefined} onClose={() => setLinkModal(undefined)}>
        <LinkModalContent>
          <form class="flex flex-col gap-2 p-4 pb-6" onSubmit={onSubmit}>
            <h3 class="font-medium">Insert link</h3>

            <div class="flex flex-col justify-center items-start text-sm gap-1">
              <label for={LINK_MODAL_TEXT_INPUT_ID}>Text</label>

              <input
                class="block w-full"
                name="text"
                id={LINK_MODAL_TEXT_INPUT_ID}
                value={linkModalContent()?.text || ''}
              />
            </div>

            <div class="flex flex-col justify-center items-start text-sm gap-1">
              <label for="link-modal--url">URL</label>

              <input
                class="block w-full"
                name="url"
                id="link-modal--url"
                value={linkModalContent()?.url || ''}
              />
            </div>

            <Button class="mt-4" variant="primary" type="submit">
              Update Link
            </Button>
          </form>
        </LinkModalContent>
      </Modal>
    </>
  );
}

// Child component.
function LinkModalContent({ children }: { children: JSX.Element }) {
  function onEscapeKey(e: KeyboardEvent) {
    if (e.code === 'Escape') setLinkModal(undefined);
  }

  onMount(() => {
    // Add escape listener.
    window.addEventListener('keydown', onEscapeKey);

    const inputElement = document.getElementById(LINK_MODAL_TEXT_INPUT_ID);
    if (!inputElement) return;

    inputElement.focus();
  });

  onCleanup(() => window.removeEventListener('keydown', onEscapeKey));

  return <>{children}</>;
}

// Exported helper functions.
export function parseSelectionAndOpenModal({
  selection,
  markdown
}: {
  selection: [number, number] | undefined;
  markdown: string;
}) {
  if (!selection) return;

  const result = parseMarkdownLink(markdown.slice(selection[0], selection[1]));
  setLinkModal(result);
}

// Helper function.
function getConcatenatedMarkdown({ text, url }: { text: string; url: string }) {
  if (text && url) return `[${text}](${url})`;
  return text || url;
}
