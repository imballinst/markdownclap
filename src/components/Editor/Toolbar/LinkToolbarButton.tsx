import { Accessor, createSignal } from 'solid-js';
import { HOTKEYS } from '../../../constants/hotkeys';
import { Button } from '../../Button';
import { LinkIcon } from '../../Icons/Link';
import { Modal } from '../../Modal/Modal';
import { getToolbarHoverText } from './common';

interface LinkToolbarButtonProps {
  textAreaElement: Accessor<HTMLTextAreaElement | undefined>;
}

// TODO: continue here
export function LinkToolbarButton({ textAreaElement }: LinkToolbarButtonProps) {
  const [isModalOpen, setIsModalOpen] = createSignal(false);

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
        <div>Hello world</div>
      </Modal>
    </>
  );
}
