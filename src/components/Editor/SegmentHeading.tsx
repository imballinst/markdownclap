import { JSXElement } from 'solid-js';
import './SegmentHeading.css';

interface SegmentHeadingProps {
  title: string;
  children: JSXElement;
}

export function SegmentHeading(props: SegmentHeadingProps) {
  return (
    <div>
      <div class="segment-heading">{props.title}</div>
      <div class="segment-subtext">{props.children}</div>
    </div>
  );
}
