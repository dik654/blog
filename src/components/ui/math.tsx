import katex from 'katex';

interface Props {
  /** LaTeX string */
  children: string;
  /** display mode (block) vs inline */
  display?: boolean;
  className?: string;
}

export default function Math({ children, display = false, className }: Props) {
  const html = katex.renderToString(children, {
    displayMode: display,
    throwOnError: false,
  });
  if (display) {
    return (
      <div
        className={`not-prose my-3 text-center ${className ?? ''}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
  return (
    <span
      className={`not-prose inline-block align-middle ${className ?? ''}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
