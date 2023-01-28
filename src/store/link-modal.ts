import { atom } from 'nanostores';
import { ParseMarkdownLinkResult } from '../utils/parsers/link';

type ModalContent = ParseMarkdownLinkResult | undefined;

export const linkModalStore = atom<ModalContent>(undefined);

export function setLinkModal(newContent: ModalContent | ((prev: ModalContent) => ModalContent)) {
  const prev = linkModalStore.get();
  linkModalStore.set(typeof newContent === 'function' ? newContent(prev) : newContent);
}
