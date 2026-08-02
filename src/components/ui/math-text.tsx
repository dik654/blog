import { Children, Fragment, cloneElement, isValidElement, type ComponentProps, type ReactElement, type ReactNode } from 'react';
import Math from './math';

const INLINE_MATH = /\$([^$\n]+)\$/g;

function renderString(value: string, keyPrefix: string): ReactNode {
  const parts: ReactNode[] = [];
  let cursor = 0;
  let match = INLINE_MATH.exec(value);

  while (match) {
    if (match.index > cursor) parts.push(value.slice(cursor, match.index));
    parts.push(<Math key={`${keyPrefix}-${match.index}`}>{match[1]}</Math>);
    cursor = match.index + match[0].length;
    match = INLINE_MATH.exec(value);
  }

  INLINE_MATH.lastIndex = 0;
  if (cursor === 0) return value;
  if (cursor < value.length) parts.push(value.slice(cursor));
  return parts;
}

function renderNode(node: ReactNode, keyPrefix: string): ReactNode {
  if (typeof node === 'string') return renderString(node, keyPrefix);
  if (!isValidElement(node) || typeof node.type !== 'string') return node;

  const element = node as ReactElement<{ children?: ReactNode }>;
  if (element.props.children == null) return element;

  return cloneElement(element, {
    children: Children.map(element.props.children, (child, index) => (
      <Fragment key={`${keyPrefix}-${index}`}>{renderNode(child, `${keyPrefix}-${index}`)}</Fragment>
    )),
  });
}

export default function MathText({ children, ...props }: ComponentProps<'section'>) {
  return (
    <section {...props}>
      {Children.map(children, (child, index) => renderNode(child, `math-${index}`))}
    </section>
  );
}
