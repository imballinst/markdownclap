import classNames from 'classnames';
import { JSXElement } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import './SegmentHeading.css';

interface SegmentHeadingProps {
  title: string;
  children?: JSXElement;
  class?: string;
  as?: 'h2' | 'h3';
}

export function SegmentHeading({
  children,
  title,
  as: Component = 'h2',
  class: className
}: SegmentHeadingProps) {
  return (
    <>
      <Dynamic component={Component} class={classNames('segment-heading', className)}>
        {title}
      </Dynamic>
      {children && <p class="segment-subtext">{children}</p>}
    </>
  );
}
