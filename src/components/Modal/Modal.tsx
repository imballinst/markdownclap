import classNames from 'classnames';
import { Accessor, JSX, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

import './Modal.css';

export type ModalStyleState = Pick<JSX.CSSProperties, 'left' | 'top'>;

interface ModalProps {
  className?: string;
  isVisible: Accessor<boolean>;
  onClose: () => void;
  modalStyle?: Accessor<JSX.CSSProperties>;
  children: JSX.Element;
}

export function Modal({ isVisible, onClose, modalStyle, children, className }: ModalProps) {
  return (
    <Show when={isVisible()}>
      <Portal>
        <div role="presentation" class="modal-root">
          <div aria-hidden="true" class="modal-backdrop" onClick={onClose} />
          <div
            tabIndex={-1}
            class={classNames(className, 'modal-dropdown')}
            style={modalStyle ? modalStyle() : undefined}
          >
            {children}
          </div>
        </div>
      </Portal>
    </Show>
  );
}
