import { useStore } from '@nanostores/solid';
import { marked } from 'marked';
import { Show } from 'solid-js';
import { InspectStatus, inspectStatusStore } from '../../store/inspect';

import { markdownStore } from '../../store/markdown';
import { MarkdownInspector } from './MarkdownInspector';
import { SegmentHeading } from './SegmentHeading';

const SEGMENT_HEADING_CONTENT = {
  [InspectStatus.PreviewingMarkdown]: {
    title: 'Markdown preview',
    content: (
      <>
        To inspect and edit, select text on the inputs on the left, then choose "Inspect Element".
      </>
    )
  },
  [InspectStatus.InspectingSnippet]: {
    title: 'Snippet inspection',
    content: <>To save changes and return to markdown preview, click the "Save Changes" button.</>
  }
};

export default function RightContent() {
  const markdown = useStore(markdownStore);
  const inspectStatus = useStore(inspectStatusStore);

  return (
    <>
      <SegmentHeading title={SEGMENT_HEADING_CONTENT[inspectStatus()].title}>
        {SEGMENT_HEADING_CONTENT[inspectStatus()].content}
      </SegmentHeading>

      <Show when={inspectStatus() === InspectStatus.PreviewingMarkdown}>
        <pre class="markdown-result" innerHTML={marked(markdown())} />
      </Show>

      <Show when={inspectStatus() === InspectStatus.InspectingSnippet}>
        <MarkdownInspector />
      </Show>
    </>
  );
}
