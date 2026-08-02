import katex from 'katex';
import { useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { foundationFormulaAnnotation } from '@/content/ai/foundationFormulaAnnotations';
import { useMathAnnotations } from './math-annotation-context';

interface Props {
  /** LaTeX 문자열 — `<M>a_{'{i+1}'}</M>` 같은 JSX 혼합도 허용. */
  children: ReactNode;
  /** display mode (block) vs inline */
  display?: boolean;
  className?: string;
  /** 이 display 수식이 축소될 수 있는 최소 배율. */
  minScale?: number;
}

// JSX children 은 여러 노드면 배열로 들어와 string 이 아니게 됨.
// katex.renderToString 은 배열 받으면 TypeError 를 던지므로 flatten 후 전달.
function flatten(node: ReactNode): string {
  if (node == null || node === false || node === true) return '';
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(flatten).join('');
  const inner = (node as { props?: { children?: ReactNode } }).props?.children;
  return inner != null ? flatten(inner) : '';
}

function promoteAnnotationTextSize(source: string): string {
  return source
    .replaceAll(String.raw`}_{\text{`, String.raw`}_{\normalsize\text{`)
    .replaceAll(String.raw`}^{\text{`, String.raw`}^{\normalsize\text{`);
}

const annotationMarkers = [
  '①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩',
  '⑪', '⑫', '⑬', '⑭', '⑮', '⑯', '⑰', '⑱', '⑲', '⑳',
];

function findClosingBrace(source: string, openingBrace: number): number {
  let depth = 0;
  for (let index = openingBrace; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1;
    if (source[index] === '}') {
      depth -= 1;
      if (depth === 0) return index;
    }
  }
  return -1;
}

function annotationLabelText(labelSource: string): string {
  const textParts = [...labelSource.matchAll(/\\text\{([^{}]*)\}/g)]
    .map((match) => match[1].trim())
    .filter(Boolean);
  if (textParts.length > 0) return textParts.join(' · ');
  return labelSource
    .replace(/\\[A-Za-z]+/g, ' ')
    .replace(/[{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

interface CompactAnnotation {
  marker: string;
  label: string;
}

function compactFormulaAnnotations(source: string): { source: string; annotations: CompactAnnotation[] } {
  const commands = [
    { token: String.raw`\underbrace{`, script: '_' },
    { token: String.raw`\overbrace{`, script: '^' },
  ];
  const annotations: CompactAnnotation[] = [];
  let result = '';
  let cursor = 0;

  while (cursor < source.length) {
    const candidates = commands
      .map((command) => ({ ...command, index: source.indexOf(command.token, cursor) }))
      .filter((candidate) => candidate.index >= 0)
      .sort((a, b) => a.index - b.index);
    const command = candidates[0];
    if (!command) {
      result += source.slice(cursor);
      break;
    }

    const bodyOpening = command.index + command.token.length - 1;
    const bodyClosing = findClosingBrace(source, bodyOpening);
    const suffixStart = bodyClosing + 1;
    const labelOpening = suffixStart + 1;
    if (
      bodyClosing < 0
      || source[suffixStart] !== command.script
      || source[labelOpening] !== '{'
    ) {
      result += source.slice(cursor, bodyClosing >= 0 ? bodyClosing + 1 : source.length);
      cursor = bodyClosing >= 0 ? bodyClosing + 1 : source.length;
      continue;
    }
    const labelClosing = findClosingBrace(source, labelOpening);
    if (labelClosing < 0) {
      result += source.slice(cursor);
      break;
    }

    const labelSource = source.slice(labelOpening + 1, labelClosing);
    const label = annotationLabelText(labelSource);
    if (!label) {
      result += source.slice(cursor, labelClosing + 1);
      cursor = labelClosing + 1;
      continue;
    }
    const marker = annotationMarkers[annotations.length] ?? `[${annotations.length + 1}]`;
    annotations.push({ marker, label });
    result += source.slice(cursor, bodyClosing + 1);
    result += `${command.script}{\\normalsize\\text{${marker}}}`;
    cursor = labelClosing + 1;
  }

  return { source: result, annotations };
}

const relationBreaks = ['\\Longrightarrow', '\\Rightarrow', '\\rightarrow', '\\coloneqq', '\\approx', '\\propto', '\\equiv', '\\sim', '\\to', ':=', '='];
const continuationBreaks = ['\\qquad', '\\quad', '\\land', '\\lor', '+', '-'];
const topLevelBreaks = [...relationBreaks, ...continuationBreaks].sort((a, b) => b.length - a.length);

interface MathBreak {
  index: number;
  token: string;
  relation: boolean;
}

function findTopLevelBreaks(source: string): MathBreak[] {
  const breaks: MathBreak[] = [];
  let depth = 0;
  let delimiterDepth = 0;
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (char === '{') {
      depth += 1;
      continue;
    }
    if (char === '}') {
      depth = globalThis.Math.max(0, depth - 1);
      continue;
    }
    if (depth > 0) continue;
    if (char === '(' || char === '[') {
      delimiterDepth += 1;
      continue;
    }
    if (char === ')' || char === ']') {
      delimiterDepth = globalThis.Math.max(0, delimiterDepth - 1);
      continue;
    }
    if (delimiterDepth > 0) continue;
    const token = topLevelBreaks.find((candidate) => {
      if (!source.startsWith(candidate, index)) return false;
      if (!candidate.startsWith('\\')) return true;
      const next = source[index + candidate.length];
      return !next || !/[A-Za-z]/.test(next);
    });
    if (!token) continue;
    const previous = source.slice(0, index).trimEnd().at(-1);
    if (token === '-' && (!previous || '=+-^_{([,'.includes(previous))) continue;
    breaks.push({ index, token, relation: relationBreaks.includes(token) });
    index += token.length - 1;
  }
  return breaks;
}

function splitExpressionRows(source: string): string[] | undefined {
  const breaks = findTopLevelBreaks(source);
  if (breaks.length === 0) return undefined;
  const rows = [source.slice(0, breaks[0].index)];
  breaks.forEach((entry, index) => {
    const next = breaks[index + 1]?.index ?? source.length;
    rows.push(`{}${entry.token}${source.slice(entry.index + entry.token.length, next)}`);
  });

  const meaningfulRows = rows.map((row) => row.trim()).filter(Boolean);
  if (meaningfulRows.length < 2) return undefined;
  return meaningfulRows;
}

function splitAlignedRows(source: string): string[] {
  const rows: string[] = [];
  let start = 0;
  let braceDepth = 0;
  let environmentDepth = 0;

  for (let index = 0; index < source.length; index += 1) {
    if (source.startsWith('\\begin{', index)) {
      environmentDepth += 1;
    } else if (source.startsWith('\\end{', index)) {
      environmentDepth = globalThis.Math.max(0, environmentDepth - 1);
    }
    const char = source[index];
    if (char === '{') braceDepth += 1;
    if (char === '}') braceDepth = globalThis.Math.max(0, braceDepth - 1);
    if (!source.startsWith('\\\\', index) || braceDepth > 0 || environmentDepth > 0) continue;

    rows.push(source.slice(start, index));
    index += 1;
    const spacing = source.slice(index + 1).match(/^\[[^\]]+\]/)?.[0];
    if (spacing) index += spacing.length;
    start = index + 1;
  }
  rows.push(source.slice(start));
  return rows.map((row) => row.trim()).filter(Boolean);
}

function stripTopLevelAlignment(source: string): string {
  let result = '';
  let braceDepth = 0;
  let environmentDepth = 0;
  for (let index = 0; index < source.length; index += 1) {
    if (source.startsWith('\\begin{', index)) environmentDepth += 1;
    if (source.startsWith('\\end{', index)) environmentDepth = globalThis.Math.max(0, environmentDepth - 1);
    const char = source[index];
    if (char === '{') braceDepth += 1;
    if (char === '}') braceDepth = globalThis.Math.max(0, braceDepth - 1);
    if (char === '&' && braceDepth === 0 && environmentDepth === 0) continue;
    result += char;
  }
  return result.trim();
}

function wrapLongDisplayMath(source: string): string | undefined {
  const alignedMatch = source.match(/^\s*\\begin\{aligned\}([\s\S]*)\\end\{aligned\}\s*$/);
  if (alignedMatch) {
    const originalRows = splitAlignedRows(alignedMatch[1]);
    const wrappedRows = originalRows.flatMap((row) => {
      const expression = stripTopLevelAlignment(row);
      return splitExpressionRows(expression) ?? [expression];
    });
    if (wrappedRows.length <= originalRows.length) return undefined;
    return `\\begin{gathered}${wrappedRows.join('\\\\[0.35em]')}\\end{gathered}`;
  }
  if (/\\begin\{(?:gathered|array|matrix|cases|split)\}/.test(source) || source.includes('\\\\')) {
    return undefined;
  }
  const rows = splitExpressionRows(source);
  if (!rows) return undefined;
  return `\\begin{gathered}${rows.join('\\\\[0.35em]')}\\end{gathered}`;
}

export default function Math({ children, display = false, className, minScale = 0.75 }: Props) {
  const source = flatten(children);
  const annotationsEnabled = useMathAnnotations();
  const annotatedSource = display && annotationsEnabled
    ? foundationFormulaAnnotation(source)
    : undefined;
  // KaTeX renders under/over-brace labels in script size by default. These
  // labels are prose, so keep them readable and let the fit/wrap pass below
  // remeasure the wider expression.
  const baseRenderedSource = promoteAnnotationTextSize(annotatedSource ?? source);
  const wrappedSource = display ? wrapLongDisplayMath(baseRenderedSource) : undefined;
  const compactFormula = display ? compactFormulaAnnotations(annotatedSource ?? source) : undefined;
  const compactRenderedSource = compactFormula && compactFormula.annotations.length > 0
    ? (wrapLongDisplayMath(compactFormula.source) ?? compactFormula.source)
    : undefined;
  const [wrapForNarrow, setWrapForNarrow] = useState(false);
  const [compactForNarrow, setCompactForNarrow] = useState(false);
  const renderedSource = compactForNarrow && compactRenderedSource
    ? compactRenderedSource
    : wrapForNarrow && wrappedSource
      ? wrappedSource
      : baseRenderedSource;
  const containerRef = useRef<HTMLSpanElement>(null);
  const scaleRef = useRef(1);
  const html = katex.renderToString(renderedSource, {
    displayMode: display,
    throwOnError: false,
    strict: false,
  });

  useLayoutEffect(() => {
    if (!display || !containerRef.current) return undefined;
    const container = containerRef.current;
    let frame = 0;
    const measure = () => {
      const renderedMath = container.firstElementChild as HTMLElement | null;
      if (!renderedMath || container.clientWidth <= 0) return;
      const mathContent = renderedMath.querySelector<HTMLElement>('.katex') ?? renderedMath;
      // Always measure from the unscaled formula. Accumulating from the previous
      // scale can stop one frame early when the KaTeX font finishes loading.
      renderedMath.style.fontSize = '';
      const inheritedFontSize = Number.parseFloat(getComputedStyle(renderedMath).fontSize);
      const baseFontSize = Number.isFinite(inheritedFontSize) && inheritedFontSize > 0
        ? globalThis.Math.max(12, inheritedFontSize)
        : 16;
      renderedMath.style.fontSize = `${baseFontSize}px`;
      const renderedWidth = mathContent.getBoundingClientRect().width;
      const readableScale = globalThis.Math.min(1, 12 / baseFontSize);
      const fitScale = (container.clientWidth - 16) / globalThis.Math.max(1, renderedWidth);
      if (!wrapForNarrow && wrappedSource && fitScale < readableScale) {
        setWrapForNarrow(true);
        return;
      }
      if (!compactForNarrow && compactRenderedSource && fitScale < readableScale) {
        setCompactForNarrow(true);
        return;
      }
      const effectiveMinScale = globalThis.Math.max(minScale, readableScale);
      const nextScale = globalThis.Math.min(
        1,
        globalThis.Math.max(
          effectiveMinScale,
          fitScale,
        ),
      );
      scaleRef.current = nextScale;
      renderedMath.style.fontSize = `${baseFontSize * nextScale}px`;
      container.dataset.mathScale = nextScale.toFixed(2);
      const finalWidth = mathContent.getBoundingClientRect().width;
      if (
        !compactForNarrow
        && compactRenderedSource
        && finalWidth > container.clientWidth - 8
      ) {
        setCompactForNarrow(true);
      }
    };
    const scheduleMeasure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    scheduleMeasure();
    let observedWidth = container.clientWidth;
    const observer = new ResizeObserver(([entry]) => {
      const width = entry?.contentRect.width ?? container.clientWidth;
      if (globalThis.Math.abs(width - observedWidth) <= 0.5) return;
      observedWidth = width;
      scheduleMeasure();
    });
    observer.observe(container);
    let disposed = false;
    const handleFontsLoaded = () => {
      if (!disposed) scheduleMeasure();
    };
    void document.fonts.ready.then(handleFontsLoaded);
    document.fonts.addEventListener('loadingdone', handleFontsLoaded);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.fonts.removeEventListener('loadingdone', handleFontsLoaded);
    };
  }, [compactForNarrow, compactRenderedSource, display, minScale, renderedSource, wrapForNarrow, wrappedSource]);

  if (display) {
    return (
      <span
        ref={containerRef}
        role="math"
        data-math-fit
        data-math-annotated={annotatedSource ? 'true' : undefined}
        data-math-annotation-missing={annotationsEnabled && !annotatedSource ? 'true' : undefined}
        data-math-source={source}
        data-math-scale="1.00"
        data-math-wrapped={wrapForNarrow ? 'true' : undefined}
        data-math-compact={compactForNarrow ? 'true' : undefined}
        className={`not-prose my-3 block max-w-full overflow-hidden px-1 text-center ${className ?? ''}`}
      >
        <span className="inline-block align-middle" dangerouslySetInnerHTML={{ __html: html }} />
        {compactForNarrow && compactFormula && compactFormula.annotations.length > 0 && (
          <span className="mx-auto mt-3 grid max-w-xl gap-1.5 border-t border-border/70 pt-3 text-left text-sm leading-5 text-muted-foreground" data-math-annotation-legend>
            {compactFormula.annotations.map(({ marker, label }, index) => (
              <span key={`${marker}-${label}-${index}`} className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-1.5">
                <span className="font-semibold text-foreground" aria-hidden="true">{marker}</span>
                <span>{label}</span>
              </span>
            ))}
          </span>
        )}
      </span>
    );
  }
  return (
    <span
      role="math"
      className={`not-prose inline-block max-w-full overflow-hidden align-middle ${className ?? ''}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
