import { useStore } from '@nanostores/solid';
import { Portal, Show } from 'solid-js/web';
import { createEffect, createSignal } from 'solid-js';
import classnames from 'classnames';

import { alertStore } from '../../store/alert';
import './Alert.css';

export function Alert() {
  const alertContent = useStore(alertStore);
  const [alertClass, setAlertClass] = createSignal('');

  createEffect(() => {
    if (alertContent()) {
      setAlertClass('alert-shown');

      setTimeout(() => {
        setAlertClass('');
      }, 5000);
    }
  });

  return (
    <Portal>
      <div
        role="presentation"
        class={classnames(`alert-root ${alertClass()}`, {
          'alert-info': alertContent()?.type === 'info',
          'alert-error': alertContent()?.type === 'error'
        })}
      >
        {alertContent()?.message}
      </div>
    </Portal>
  );
}
