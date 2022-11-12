import { JSXElement } from 'solid-js';
import './SegmentHeading.css';

interface SegmentHeadingProps {
  title: string;
  children: JSXElement;
}

export function SegmentHeading(props: SegmentHeadingProps) {
  return (
    <>
      <h2 class="segment-heading">{props.title}</h2>
      <p class="segment-subtext">{props.children}</p>
    </>
  );
}
