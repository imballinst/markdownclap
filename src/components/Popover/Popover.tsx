import classNames from 'classnames';
import { Accessor, JSX, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

import './Popover.css';

export type PopoverStyleState = Pick<JSX.CSSProperties, 'left' | 'top'>;

interface PopoverProps {
  className?: string;
  isVisible: Accessor<boolean>;
  onClose: () => void;
  popoverStyle: Accessor<JSX.CSSProperties>;
  children: JSX.Element;
}

export function Popover({ isVisible, onClose, popoverStyle, children, className }: PopoverProps) {
  return (
    <Show when={isVisible()}>
      <Portal>
        <div role="presentation" class="popover-root">
          <div aria-hidden="true" class="popover-backdrop" onClick={onClose} />
          <div
            tabIndex={-1}
            class={classNames(className, 'popover-dropdown')}
            style={popoverStyle()}
          >
            {children}
          </div>
        </div>
      </Portal>
    </Show>
  );
}
