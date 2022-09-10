import { JSX } from 'solid-js';

interface LinkProps extends JSX.AnchorHTMLAttributes<HTMLAnchorElement> {}

export function Link(props: LinkProps) {
  const { class: className = '', ...rest } = props;

  return <a class={`inline-block underline text-blue-400 ${className}`} {...rest} />;
}
