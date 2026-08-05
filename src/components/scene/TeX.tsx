/**
 * `$...$` 로 감싼 부분을 inline KaTeX 로 렌더, 나머지는 텍스트.
 * 또한 텍스트 부분의 `.`, `?`, `!` 뒤 공백을 자동으로 줄바꿈으로 바꿈 (문장 끝 → 새 줄).
 *   - 소수점 (`0.5`) 은 `.` 뒤가 공백 아니므로 안 깨짐
 *   - 약어 (`i.e.` 등) 도 중간 `.` 뒤가 공백 아니면 안 깨짐
 * 텍스트 노드의 \n 은 부모 또는 자기 자신의 `white-space: pre-line` 로 렌더.
 */

import katex from 'katex';
import { useMemo } from 'react';
import { formatPlainMath } from '@/lib/plainMath';

interface Props {
  text: string;
  className?: string;
}

export default function TeX({ text, className }: Props) {
  const html = useMemo(() => {
    const parts = text.split(/(\$[^$]+\$)/g);
    return parts
      .map((p) => {
        if (p.startsWith('$') && p.endsWith('$') && p.length >= 2) {
          const tex = p.slice(1, -1);
          try {
            return katex.renderToString(tex, {
              throwOnError: false,
              displayMode: false,
              strict: false,
            });
          } catch {
            return p;
          }
        }
        // text part: HTML escape + 문장 끝 (`.`/`?`/`!`) 뒤 공백 → 줄바꿈
        const escaped = formatPlainMath(p).replace(/&/g, '&amp;').replace(/</g, '&lt;');
        return escaped.replace(/([.?!])\s+/g, '$1\n');
      })
      .join('');
  }, [text]);

  return (
    <span
      className={className}
      style={{ whiteSpace: 'pre-line' }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
