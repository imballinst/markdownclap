import { useStore } from '@nanostores/solid';
import { Accessor, createSignal, JSX } from 'solid-js';
import { HOTKEYS } from '../../../constants/hotkeys';
import { setMarkdown } from '../../../store/markdown';
import { Button } from '../../Button';
import { LinkIcon } from '../../Icons/Link';
import { Modal } from '../../Modal/Modal';
import { getToolbarHoverText } from './common';
import { markdownStore } from '../../../store/markdown'

interface LinkToolbarButtonProps {
  textAreaElement: Accessor<HTMLTextAreaElement | undefined>;
}

export function LinkToolbarButton({ textAreaElement }: LinkToolbarButtonProps) {
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const markdown = useStore(markdownStore)

  const onSubmit: JSX.DOMAttributes<HTMLFormElement>['onSubmit'] = (e) => {
    e.preventDefault();
    
    const prevMarkdown = markdown()
    const formData = new FormData(e.currentTarget)

    const textAreaEl = textAreaElement();
    if (!textAreaEl) return;

    const { selectionStart, selectionEnd } = textAreaEl;
    

    setMarkdown((prev) => {


      
      return ''
      // return prev
      //   .slice(0, selectionStart)
      //   .concat(`${headersMd}\n${separatorsMd}\n${bodyMd}`)
      //   .concat(prev.slice(selectionStart));
    });
  };

  return (
    <>
      <Button
        variant="primary"
        class="w-8 h-full"
        size="sm"
        title={getToolbarHoverText(HOTKEYS.AddOrRemoveLink)}
        onClick={() => setIsModalOpen(true)}
      >
        <LinkIcon class="w-4 h-4" />
      </Button>

      <Modal isVisible={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form class="flex flex-col gap-2 p-4 pb-6" onSubmit={onSubmit}>
          <h3 class="font-medium">Insert link</h3>

          <div class="flex flex-col justify-center items-start text-sm gap-1">
            <label for="link-modal--text">Text</label>

            <input class="block w-full" name="text" id="link-modal--text" />
          </div>

          <div class="flex flex-col justify-center items-start text-sm gap-1">
            <label for="link-modal--url">URL</label>

            <input class="block w-full" name="url" id="link-modal--url" />
          </div>

          <Button class="mt-4" variant="primary" type="submit">
            Update Link
          </Button>
        </form>
      </Modal>
    </>
  );
}
