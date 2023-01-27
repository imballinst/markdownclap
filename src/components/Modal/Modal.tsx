import classNames from 'classnames';
import { Accessor, JSX, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

import './Modal.css';

export type ModalStyleState = Pick<JSX.CSSProperties, 'left' | 'top'>;

interface ModalProps {
  className?: string;
  isVisible: boolean;
  onClose: () => void;
  modalStyle?: JSX.CSSProperties;
  children: JSX.Element;
}

export function Modal(props: ModalProps) {
  return (
    <Show when={props.isVisible}>
      <Portal>
        <div role="presentation" class="modal-root flex flex-col justify-center items-center">
          <div aria-hidden="true" class="modal-backdrop" onClick={props.onClose} />
          <div
            tabIndex={-1}
            class={classNames(props.className, 'bg-slate-100 z-20 rounded')}
            style={props.modalStyle}
          >
            {props.children}
          </div>
        </div>
      </Portal>
    </Show>
  );
}
