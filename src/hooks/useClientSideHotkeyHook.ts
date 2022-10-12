import { Accessor, createSignal, onMount } from "solid-js";
import { getToolbarHoverText } from "../components/Editor/Toolbar/common";

export interface HotkeyContainerObject {
  defaultText: string
  keys: string[]
  action: string
}

export function useClientSideHotkeyHook<T extends HotkeyContainerObject>(defaultValue: T): Accessor<string>;
export function useClientSideHotkeyHook<T extends HotkeyContainerObject>(defaultValue: T[]): Accessor<string[]>;

export function useClientSideHotkeyHook<T extends HotkeyContainerObject>(defaultValue: T | T[]) {
  const [value, setValue] = createSignal(Array.isArray(defaultValue) ? [] as string[] : '')

  onMount(() => {
    if (Array.isArray(defaultValue)) {
      setValue(defaultValue.map(item => getToolbarHoverText(item.defaultText, item.keys)))
    } else {
      setValue(getToolbarHoverText(defaultValue.defaultText, defaultValue.keys))
    }
  })

  return value 
}