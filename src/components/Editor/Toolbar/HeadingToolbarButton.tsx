import { createSignal, For } from 'solid-js';
import { JSX } from 'solid-js/jsx-runtime';
import {
  HotkeyContainerObject,
  useClientSideHotkeyHook
} from '../../../hooks/useClientSideHotkeyHook';
import { ToolbarAction } from '../../../utils/operators/toolbar';
import { Button } from '../../Button';
import { Popover, PopoverStyleState } from '../../Popover';

import './HeadingToolbarButton.css';

const HOTKEYS: HotkeyContainerObject[] = [
  { defaultText: `Heading 1`, keys: ['Alt', '1'], action: ToolbarAction.TOOLBAR_HEADING_1 },
  { defaultText: `Heading 2`, keys: ['Alt', '2'], action: ToolbarAction.TOOLBAR_HEADING_2 },
  { defaultText: `Heading 3`, keys: ['Alt', '3'], action: ToolbarAction.TOOLBAR_HEADING_3 },
  { defaultText: `Heading 4`, keys: ['Alt', '4'], action: ToolbarAction.TOOLBAR_HEADING_4 },
  { defaultText: `Heading 5`, keys: ['Alt', '5'], action: ToolbarAction.TOOLBAR_HEADING_5 },
  { defaultText: `Heading 6`, keys: ['Alt', '6'], action: ToolbarAction.TOOLBAR_HEADING_6 }
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

  const hotkeys = useClientSideHotkeyHook(HOTKEYS);

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
                  data-action={HOTKEYS[index()].action}
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
