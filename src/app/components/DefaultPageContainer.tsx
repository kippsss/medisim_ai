'use client';

interface Props {
  children?: React.ReactNode;
  classes?: string;
}

export const DefaultPageContainer = ({ children, classes = '' }: Props) => {
  return (
    <div
      className={`flex flex-col px-7 sm:px-32 md:px-40 lg:px-52 py-10 md:pt-32 min-h-screen max-w-7xl w-full ${classes}`}
    >
      {children}
    </div>
  );
};
