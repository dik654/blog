import { useState } from 'react';

type LayerId = 'rust' | 'python' | 'manifest' | 'e2e';

const layers = [
  { id: 'rust', label: 'Rust 실행' },
  { id: 'python', label: 'Python port' },
  { id: 'manifest', label: '표면 추출' },
  { id: 'e2e', label: 'Mock E2E' },
] as const;

const contracts: Record<LayerId, {
  input: string;
  core: string;
  output: string;
  evidence: string;
  limit: string;
}> = {
  rust: {
    input: 'CLI args · user prompt · config',
    core: 'claw binary → api/runtime/commands/tools',
    output: 'provider stream · tool result · session',
    evidence: 'production code path',
    limit: '보조 Python workspace를 호출하지 않는다.',
  },
  python: {
    input: 'prompt · ported command/tool metadata',
    core: 'PortRuntime → QueryEnginePort',
    output: '결정적 summary event · stored session',
    evidence: '작은 porting simulation',
    limit: '실제 provider나 Rust dispatch 동작의 증명은 아니다.',
  },
  manifest: {
    input: 'upstream commands.ts · tools.ts · cli.tsx',
    core: '문자열 pattern extraction',
    output: 'command/tool registry · BootstrapPlan',
    evidence: 'surface presence check',
    limit: '추출한 command의 실행 정확성은 검사하지 않는다.',
  },
  e2e: {
    input: 'PARITY_SCENARIO marker · filesystem fixture',
    core: 'mock /v1/messages ↔ actual claw binary',
    output: 'stdout/JSON · file state · captured request',
    evidence: '12개 재현 가능한 end-to-end contract',
    limit: '목록 밖 행동 전체의 parity를 보증하지 않는다.',
  },
};

export default function ArchitectureBoundaryViz() {
  const [layer, setLayer] = useState<LayerId>('rust');
  const contract = contracts[layer];
  const flow = [
    ['INPUT', contract.input],
    ['CORE', contract.core],
    ['OUTPUT', contract.output],
  ] as const;

  return (
    <div data-overview-boundary-lab className="not-prose my-7 overflow-hidden rounded-md border border-border bg-background">
      <div className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-xs font-semibold text-muted-foreground">EVIDENCE BOUNDARY</p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="아키텍처 증거 층">
          {layers.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={layer === item.id}
              onClick={() => setLayer(item.id)}
              className={`min-h-11 min-w-0 rounded border px-3 py-2 text-xs font-semibold transition-colors ${
                layer === item.id
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-background text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(17rem,0.85fr)]">
        <div className="border-b border-border px-4 py-4 lg:border-b-0 lg:border-r sm:px-5">
          <div className="grid gap-3 sm:grid-cols-3">
            {flow.map(([label, value], index) => (
              <div key={label} className="min-w-0 border-l-2 border-border py-1 pl-3 sm:border-l-0 sm:border-t-2 sm:pl-0 sm:pt-3">
                <p className="font-mono text-[11px] font-bold text-muted-foreground">{String(index + 1).padStart(2, '0')} · {label}</p>
                <p className="mt-1 break-words text-xs font-bold leading-relaxed">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div data-boundary-result={layer} className="min-w-0 px-4 py-4 sm:px-5">
          <p className="text-[10px] font-semibold text-muted-foreground">WHAT THIS LAYER PROVES</p>
          <p className="mt-2 text-sm font-bold">{contract.evidence}</p>
          <p className="mt-3 border-t border-border pt-3 text-xs leading-relaxed text-muted-foreground">
            <strong className="text-foreground">경계:</strong> {contract.limit}
          </p>
        </div>
      </div>
    </div>
  );
}
