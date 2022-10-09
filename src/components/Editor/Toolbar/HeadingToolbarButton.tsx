import { createSignal } from 'solid-js';
import { JSX } from 'solid-js/jsx-runtime';
import { ToolbarAction } from '../../../utils/operators/toolbar';
import { Popover, PopoverStyleState } from '../../Popover';
import { getToolbarHoverText } from './common';

import './HeadingToolbarButton.css';

interface HeadingToolbarButtonProps {
  onClick: JSX.DOMAttributes<HTMLButtonElement>['onClick'];
}

export function HeadingToolbarButton({ onClick }: HeadingToolbarButtonProps) {
  const [popoverStyle, setPopoverStyle] = createSignal<PopoverStyleState>({
    left: '0px',
    top: '0px'
  });
  const [isPopoverShown, setIsPopoverShown] = createSignal(false);

  return (
    <>
      <button
        class="button-sm w-8"
        title="Headings"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setPopoverStyle({ left: `${rect.left}px`, top: `${rect.top + rect.height}px` });
          setIsPopoverShown(true);
        }}
      >
        H
      </button>

      <Popover
        isVisible={isPopoverShown}
        onClose={() => {
          setIsPopoverShown(false);
        }}
        popoverStyle={popoverStyle}
        className="heading-toolbar-popover"
      >
        <button class="button-sm" onClick={onClick} data-action={ToolbarAction.TOOLBAR_HEADING_1}>
          Heading 1 ({getToolbarHoverText(`Heading 1`, [`1`])})
        </button>
      </Popover>
    </>
  );
}
