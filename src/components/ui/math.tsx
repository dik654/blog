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
    // Operation annotations intentionally use Korean inside \text{...}.
    // KaTeX renders it with the surrounding text font; strict warnings would
    // otherwise turn every useful annotation into a browser-console warning.
    strict: "ignore",
  });
  if (display) {
    return (
      <div
        data-math-display="true"
        className={`not-prose my-3 max-w-full overflow-x-auto overflow-y-hidden px-1 py-4 text-center ${className ?? ""}`}
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
