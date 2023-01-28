import classNames from 'classnames';
import { Accessor, JSX, splitProps } from 'solid-js';
import './Button.css';

interface Props extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> {
  variant: 'primary' | 'secondary' | 'ghost';
  size?: 'sm';
  isDisabled?: Accessor<boolean>;
}

export function Button(props: Props) {
  const [local, rest] = splitProps(props, [
    'children',
    'class',
    'variant',
    'size',
    'isDisabled',
  ]);

  return (
    <button
      class={classNames('button', local.class)}
      data-variant={local.variant}
      data-size={local.size}
      disabled={local.isDisabled ? local.isDisabled() : false}
      {...rest}
      aria-label={props.title}
    >
      {local.children}
    </button>
  );
}
