import { useState } from 'react';
import { ArrowRight, Check, ShieldQuestion } from 'lucide-react';

type CaseKey = 'alias' | 'empty' | 'custom';

const cases = [
  {
    key: 'alias',
    label: '별칭 입력',
    input: 'explorer',
    normalized: 'Explore',
    branch: '고정 Explore allowlist',
    tools: ['read_file', 'glob_search', 'grep_search', 'WebFetch', 'WebSearch'],
  },
  {
    key: 'empty',
    label: '타입 생략',
    input: '(empty)',
    normalized: 'general-purpose',
    branch: '기본 allowlist',
    tools: ['bash', 'read_file', 'write_file', 'edit_file', 'WebFetch'],
  },
  {
    key: 'custom',
    label: '알 수 없는 타입',
    input: 'security-review',
    normalized: 'security-review',
    branch: '기본 allowlist',
    tools: ['bash', 'read_file', 'write_file', 'edit_file', 'WebFetch'],
  },
] as const;

export default function AgentSelectionViz() {
  const [caseKey, setCaseKey] = useState<CaseKey>('alias');
  const selected = cases.find((item) => item.key === caseKey) ?? cases[0];

  return (
    <figure className="not-prose my-8 overflow-hidden rounded-md border border-border bg-background" data-agent-selection-lab data-viz-canvas>
      <figcaption className="border-b border-border px-4 py-4">
        <span className="text-[11px] font-bold uppercase text-muted-foreground">Source reconstruction</span>
        <strong className="mt-1 block text-base">현재 구현은 후보를 채점하지 않고 요청된 type을 정규화한다</strong>
      </figcaption>
      <div role="group" aria-label="subagent type 입력 사례" className="grid grid-cols-3 gap-px border-b border-border bg-border">
        {cases.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setCaseKey(item.key)}
            aria-pressed={caseKey === item.key}
            className={`min-w-0 bg-background px-2 py-3 text-xs font-bold ${caseKey === item.key ? 'bg-foreground text-background' : 'hover:bg-muted'}`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="grid gap-px bg-border lg:grid-cols-[minmax(0,0.8fr)_auto_minmax(0,0.8fr)_auto_minmax(0,1.2fr)]">
        <div className="min-w-0 bg-background p-4">
          <span className="text-[10px] font-bold text-muted-foreground">INPUT</span>
          <code className="mt-2 block break-words text-sm font-bold [overflow-wrap:anywhere]">{selected.input}</code>
        </div>
        <div className="hidden items-center bg-background px-2 lg:flex"><ArrowRight className="h-4 w-4" aria-hidden="true" /></div>
        <div className="min-w-0 bg-background p-4">
          <span className="text-[10px] font-bold text-muted-foreground">NORMALIZED</span>
          <code className="mt-2 block break-words text-sm font-bold [overflow-wrap:anywhere]">{selected.normalized}</code>
        </div>
        <div className="hidden items-center bg-background px-2 lg:flex"><ArrowRight className="h-4 w-4" aria-hidden="true" /></div>
        <div className="min-w-0 bg-background p-4">
          <span className="text-[10px] font-bold text-muted-foreground">TOOL BRANCH</span>
          <strong className="mt-2 block text-sm">{selected.branch}</strong>
          <div className="mt-3 flex flex-wrap gap-1">
            {selected.tools.map((tool) => <code key={tool} className="rounded-full border border-border px-2 py-1 text-[10px]">{tool}</code>)}
          </div>
        </div>
      </div>
      <div data-selection-outcome aria-live="polite" className="flex gap-3 border-t border-border bg-muted/15 px-4 py-4 text-xs leading-5">
        {caseKey === 'custom' ? <ShieldQuestion className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> : <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />}
        <p>
          {caseKey === 'custom'
            ? '미등록 문자열도 오류가 아니라 기본 권한이 넓은 branch로 간다. strict registry가 필요하다면 별도 검증을 추가해야 한다.'
            : `${selected.input} → ${selected.normalized}: source의 결정론적 alias 규칙이다.`}
        </p>
      </div>
    </figure>
  );
}
