import { createSignal, For } from 'solid-js';
import { JSX } from 'solid-js/jsx-runtime';
import { HOTKEYS } from '../../../constants/hotkeys';
import { useClientSideHotkeyHook } from '../../../hooks/useClientSideHotkeyHook';
import { HotkeyContainerObject } from '../../../types/HotkeyContainerObject';
import { ToolbarAction } from '../../../utils/operators/toolbar';
import { Button } from '../../Button';
import { Popover, PopoverStyleState } from '../../Popover';

import './HeadingToolbarButton.css';

const HEADING_HOTKEYS: HotkeyContainerObject[] = [
  { ...HOTKEYS.Heading1, action: ToolbarAction.TOOLBAR_HEADING_1 },
  { ...HOTKEYS.Heading2, action: ToolbarAction.TOOLBAR_HEADING_2 },
  { ...HOTKEYS.Heading3, action: ToolbarAction.TOOLBAR_HEADING_3 },
  { ...HOTKEYS.Heading4, action: ToolbarAction.TOOLBAR_HEADING_4 },
  { ...HOTKEYS.Heading5, action: ToolbarAction.TOOLBAR_HEADING_5 },
  { ...HOTKEYS.Heading6, action: ToolbarAction.TOOLBAR_HEADING_6 }
];

interface HeadingToolbarButtonProps {
  onClick: JSX.DOMAttributes<HTMLButtonElement>['onClick'];
}

export function HeadingToolbarButton({ onClick }: HeadingToolbarButtonProps) {
  const [popoverStyle, setPopoverStyle] = createSignal<PopoverStyleState>({
    left: '0px',
    top: '0px'
  });
  const [isPopoverShown, setIsPopoverShown] = createSignal(false);

  const hotkeys = useClientSideHotkeyHook(HEADING_HOTKEYS);

  return (
    <>
      <Button
        variant="primary"
        size="sm"
        class="w-8"
        title="Headings"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setPopoverStyle({ left: `${rect.left}px`, top: `${rect.top + rect.height}px` });
          setIsPopoverShown(true);
        }}
      >
        H
      </Button>

      <Popover
        isVisible={isPopoverShown}
        onClose={() => {
          setIsPopoverShown(false);
        }}
        popoverStyle={popoverStyle}
        className="heading-toolbar-popover"
      >
        <ul class="headings-list">
          <For each={hotkeys()}>
            {(hotkey, index) => (
              <li>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClick}
                  data-action={HEADING_HOTKEYS[index()].action}
                >
                  {hotkey.buttonText} ({hotkey.buttonTitle})
                </Button>
              </li>
            )}
          </For>
        </ul>
      </Popover>
    </>
  );
}
