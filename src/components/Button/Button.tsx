import classNames from 'classnames';
import { Accessor, JSX } from 'solid-js';
import './Button.css';

interface Props extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> {
  variant: 'primary' | 'secondary' | 'ghost';
  size?: 'sm';
  isDisabled?: Accessor<boolean>;
}

export function Button({ children, class: className, variant, size, isDisabled, ...props }: Props) {
  return (
    <button
      class={classNames('button', className)}
      data-variant={variant}
      data-size={size}
      disabled={isDisabled ? isDisabled() : false}
      {...props}
    >
      {children}
    </button>
  );
}
