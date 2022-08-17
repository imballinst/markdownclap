import { useStore } from '@nanostores/solid';
import { marked } from 'marked';
import { createEffect, JSXElement } from 'solid-js';
import { editorStore } from '../../store/editor';

export default function SidebarEditor() {
  const editor = useStore(editorStore);
  let content: JSXElement;

  createEffect(() => {
    console.info('123', marked(editor().sidebarContent?.content || ''));
  });

  if (editor().sidebarContent) {
    content = <div innerHTML={marked(editor().sidebarContent!.content)} />;
  } else {
    content = <div />;
  }

  return (
    <>
      <div>Result</div>
      <div>{content}</div>
    </>
  );
}
