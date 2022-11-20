import { Accessor, createSignal, onMount } from 'solid-js';
import { getToolbarHoverText } from '../components/Editor/Toolbar/common';
import { HotkeyContainerObject } from '../types/HotkeyContainerObject';

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
        buttonTitle: getToolbarHoverText(item)
      })));
    } else {
      setValue({
        buttonText: defaultValue.defaultText,
        buttonTitle: getToolbarHoverText(defaultValue)
      });
    }
  });

  return value;
}
