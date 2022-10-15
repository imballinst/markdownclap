import { Accessor, createSignal, onMount } from 'solid-js';
import { getToolbarHoverText } from '../components/Editor/Toolbar/common';

export interface HotkeyContainerObject {
  defaultText: string;
  keys: string[];
  action?: string;
}

interface UseClientSideHotkeyHookResult {
  buttonText: string;
  buttonTitle: string;
}

export function useClientSideHotkeyHook<T extends HotkeyContainerObject>(
  defaultValue: T
): Accessor<UseClientSideHotkeyHookResult>;
export function useClientSideHotkeyHook<T extends HotkeyContainerObject>(
  defaultValue: T[]
): Accessor<UseClientSideHotkeyHookResult[]>;

export function useClientSideHotkeyHook<T extends HotkeyContainerObject>(defaultValue: T | T[]) {
  const [value, setValue] = createSignal<UseClientSideHotkeyHookResult | UseClientSideHotkeyHookResult[]>(Array.isArray(defaultValue) ? (defaultValue.map(item => ({
    buttonText: item.defaultText,
    buttonTitle: ''
  }))) : {
    buttonText: defaultValue.defaultText,
    buttonTitle: ''
  });

  onMount(() => {
    if (Array.isArray(defaultValue)) {
      setValue(defaultValue.map((item) => ({
        buttonText: item.defaultText,
        buttonTitle: getToolbarHoverText({ keys: item.keys})
      })));
    } else {
      setValue({
        buttonText: defaultValue.defaultText,
        buttonTitle: getToolbarHoverText({ keys: defaultValue.keys})
      });
    }
  });

  return value;
}
