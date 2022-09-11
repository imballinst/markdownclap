import { atom } from 'nanostores';

export interface AlertType {
  type: 'info' | 'error';
  message: string;
}

type AlertStateType = AlertType | undefined;
export const alertStore = atom<AlertStateType>(undefined);

export function setAlert(newAlert: AlertStateType | ((prev: AlertStateType) => AlertStateType)) {
  const prev = alertStore.get();
  alertStore.set(typeof newAlert === 'function' ? newAlert(prev) : newAlert);
}
