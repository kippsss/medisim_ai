'use client';

interface Props {
  type: 'default' | 'info' | 'warning' | 'error';
  message: string;
}

const mapping = {
  default: '',
  info: 'alert-info',
  warning: 'alert-warning',
  error: 'alert-error',
};

export const Alert = ({ type, message }: Props) => {
  return (
    <div role="alert" className={`alert ${mapping[type]}`}>
      {message}
    </div>
  );
};
