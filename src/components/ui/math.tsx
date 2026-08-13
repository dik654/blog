import katex from "katex";

interface Props {
  /** LaTeX string */
  children: string | readonly string[];
  /** display mode (block) vs inline */
  display?: boolean;
  className?: string;
}

export default function Math({ children, display = false, className }: Props) {
  const source = typeof children === "string" ? children : children.join("");
  const html = katex.renderToString(source, {
    displayMode: display,
    throwOnError: false,
  });
  if (display) {
    return (
      <div
        data-math-display="true"
        className={`not-prose my-3 max-w-full overflow-x-auto overflow-y-hidden px-1 py-1 text-center ${className ?? ""}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
  return (
    <span
      className={`not-prose inline-block max-w-full overflow-x-auto overflow-y-hidden align-middle ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
