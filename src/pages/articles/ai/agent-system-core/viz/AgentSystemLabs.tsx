import { useMemo, useState } from 'react';
import { AlertTriangle, Check, CircleStop, ShieldCheck } from 'lucide-react';
import { FlowRow, MetricGrid, SegmentedControl } from '../../nlp-shared';

type AgentScenario = 'lookup' | 'refund' | 'coding';

const agentScenarios: Record<AgentScenario, {
  label: string;
  question: string;
  decision: string;
  kind: string;
  turns: string;
  tools: string;
  steps: Array<{ label: string; value: string; note: string }>;
}> = {
  lookup: {
    label: '정책 조회',
    question: '휴가 규정 한 문단을 찾아 인용한다.',
    decision: '검색 절차가 고정되어 있으므로 workflow가 충분하다.',
    kind: 'Workflow',
    turns: '1–2',
    tools: '검색 1회',
    steps: [
      { label: '입력', value: '질문', note: '찾을 정책이 명확하다.' },
      { label: '검색', value: 'query', note: '정해진 검색기를 호출한다.' },
      { label: '검증', value: 'citation', note: '원문 span과 날짜를 확인한다.' },
      { label: '종료', value: 'answer', note: '인용과 함께 답한다.' },
    ],
  },
  refund: {
    label: '환불 판단',
    question: '주문 상태와 정책을 읽고 환불 또는 이관을 결정한다.',
    decision: '관찰 결과에 따라 다음 행동이 달라지므로 agent loop가 필요하다.',
    kind: 'Agent loop',
    turns: '2–5',
    tools: '조회·정책·변경',
    steps: [
      { label: '관찰', value: 'order', note: '주문 금액과 상태를 읽는다.' },
      { label: '판단', value: 'policy', note: '현재 정책 근거를 찾는다.' },
      { label: '행동', value: 'propose', note: '환불 또는 사람 이관을 제안한다.' },
      { label: '검증', value: 'gate', note: '권한과 금액 상한을 코드가 검사한다.' },
      { label: '종료', value: 'commit', note: '허용된 side effect만 반영한다.' },
    ],
  },
  coding: {
    label: '코드 수정',
    question: '여러 파일을 고치고 테스트 실패를 진단해 완료한다.',
    decision: '긴 작업은 loop에 계획·checkpoint·검증 하네스가 추가되어야 한다.',
    kind: 'Harnessed agent',
    turns: '가변',
    tools: '탐색·편집·테스트',
    steps: [
      { label: '상태 복원', value: 'checkpoint', note: '이전 진행과 제약을 읽는다.' },
      { label: '다음 작업', value: 'plan', note: '완료 가능한 작은 단위를 고른다.' },
      { label: '실행', value: 'patch', note: '격리된 workspace에서 변경한다.' },
      { label: '증거', value: 'tests', note: '테스트와 diff로 결과를 확인한다.' },
      { label: '인계', value: 'trace', note: '남은 일과 실패를 다음 turn에 남긴다.' },
    ],
  },
};

export function AgentLoopLab() {
  const [scenario, setScenario] = useState<AgentScenario>('refund');
  const item = agentScenarios[scenario];

  return (
    <div data-agent-loop-lab className="not-prose my-8 min-w-0 rounded-md border border-border p-4 sm:p-6">
      <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-bold text-muted-foreground">Agent boundary lab</p>
          <h3 className="mt-1 text-lg font-bold">다음 행동이 결과에 따라 바뀌는가?</h3>
        </div>
        <SegmentedControl
          label="업무 시나리오"
          options={Object.entries(agentScenarios).map(([value, data]) => ({ value: value as AgentScenario, label: data.label }))}
          value={scenario}
          onChange={setScenario}
        />
      </div>

      <div className="mt-5 border-y border-border py-4">
        <p className="text-sm font-semibold leading-relaxed">{item.question}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.decision}</p>
      </div>

      <div className="mt-5">
        <FlowRow items={item.steps.map((step, index) => ({ ...step, tone: (['teal', 'blue', 'violet', 'amber', 'green'] as const)[index] }))} />
      </div>

      <div className="mt-5">
        <MetricGrid items={[
          { label: '권장 제어 구조', value: item.kind, accent: true },
          { label: '모델 turn', value: item.turns },
          { label: '외부 행동', value: item.tools },
        ]} />
      </div>
    </div>
  );
}

type ContextStrategy = 'dump' | 'curated' | 'stale';
type ContextBudget = '4k' | '8k' | '16k';

const contextSources = [
  { id: 'policy', label: 'System policy', tokens: 900, utility: 100, stale: false },
  { id: 'request', label: '현재 요청', tokens: 350, utility: 100, stale: false },
  { id: 'state', label: '현재 task state', tokens: 700, utility: 95, stale: false },
  { id: 'tool', label: '최근 tool result', tokens: 1500, utility: 90, stale: false },
  { id: 'retrieval', label: '근거 문서', tokens: 2600, utility: 85, stale: false },
  { id: 'memory', label: '검증된 memory', tokens: 1800, utility: 55, stale: false },
  { id: 'logs', label: '전체 과거 log', tokens: 6800, utility: 20, stale: true },
] as const;

const budgetValues: Record<ContextBudget, number> = { '4k': 4000, '8k': 8000, '16k': 16000 };

export function ContextPacketLab() {
  const [strategy, setStrategy] = useState<ContextStrategy>('curated');
  const [budget, setBudget] = useState<ContextBudget>('8k');
  const capacity = budgetValues[budget];

  const selected = useMemo(() => {
    if (strategy === 'dump') return [...contextSources];
    if (strategy === 'stale') return contextSources.filter((source) => source.id !== 'retrieval');
    const ordered = [...contextSources].sort((a, b) => b.utility - a.utility);
    const picked: Array<(typeof contextSources)[number]> = [];
    let used = 0;
    for (const source of ordered) {
      if (source.stale || used + source.tokens > capacity) continue;
      picked.push(source);
      used += source.tokens;
    }
    return picked;
  }, [capacity, strategy]);

  const used = selected.reduce((sum, source) => sum + source.tokens, 0);
  const staleIncluded = selected.some((source) => source.stale);
  const hasEvidence = selected.some((source) => source.id === 'retrieval');
  const overflow = used > capacity;
  const outcome = overflow
    ? { label: 'Admission 실패', note: '모델 호출 전에 압축·선별해야 한다.', tone: 'text-red-700 dark:text-red-300' }
    : staleIncluded
      ? { label: '근거 오염 위험', note: '오래된 log가 현재 policy처럼 읽힐 수 있다.', tone: 'text-amber-700 dark:text-amber-300' }
      : !hasEvidence
        ? { label: '근거 누락', note: '답은 가능해도 출처가 필요한 판단은 닫히지 않는다.', tone: 'text-amber-700 dark:text-amber-300' }
        : { label: '실행 가능', note: '현재 판단에 필요한 최소 근거가 budget 안에 들어왔다.', tone: 'text-emerald-700 dark:text-emerald-300' };

  return (
    <div data-context-packet-lab className="not-prose my-8 min-w-0 rounded-md border border-border p-4 sm:p-6">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <p className="text-xs font-bold text-muted-foreground">Context packet lab</p>
          <h3 className="mt-1 text-lg font-bold">다음 turn에 무엇을 넣을 것인가?</h3>
        </div>
        <div className="flex min-w-0 flex-wrap gap-2">
          <SegmentedControl
            label="컨텍스트 구성 전략"
            options={[
              { value: 'dump', label: '전부 넣기' },
              { value: 'curated', label: '근거 선별' },
              { value: 'stale', label: '오래된 memory' },
            ]}
            value={strategy}
            onChange={setStrategy}
          />
          <SegmentedControl
            label="토큰 예산"
            options={(['4k', '8k', '16k'] as const).map((value) => ({ value, label: value }))}
            value={budget}
            onChange={setBudget}
          />
        </div>
      </div>

      <div className="mt-5 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {contextSources.map((source) => {
          const included = selected.some((candidate) => candidate.id === source.id);
          return (
            <div key={source.id} className={`min-w-0 bg-background p-3 ${included ? '' : 'opacity-45'}`}>
              <div className="flex items-center justify-between gap-2">
                <strong className="min-w-0 text-xs">{source.label}</strong>
                <span className="shrink-0 font-mono text-[11px] text-muted-foreground">{source.tokens.toLocaleString()}t</span>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                {included ? 'packet에 포함' : '이번 turn에서 제외'} · utility {source.utility}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between gap-3 text-xs">
          <span className="font-semibold">Token admission</span>
          <span className={overflow ? 'font-mono font-bold text-red-700 dark:text-red-300' : 'font-mono text-muted-foreground'}>
            {used.toLocaleString()} / {capacity.toLocaleString()}
          </span>
        </div>
        <div className="h-3 overflow-hidden rounded-sm bg-muted ring-1 ring-inset ring-border/50">
          <div
            data-context-usage={used}
            className={`h-full transition-[width] duration-300 ${overflow ? 'bg-red-500' : used / capacity > 0.85 ? 'bg-amber-500' : 'bg-emerald-500'}`}
            style={{ width: `${Math.min(100, (used / capacity) * 100)}%` }}
          />
        </div>
      </div>

      <div className="mt-5 grid gap-3 border-t border-border pt-4 sm:grid-cols-[10rem_minmax(0,1fr)]">
        <strong className={`text-sm ${outcome.tone}`}>{outcome.label}</strong>
        <p className="text-sm leading-relaxed text-muted-foreground">{outcome.note}</p>
      </div>
    </div>
  );
}

type McpCase = 'success' | 'version' | 'tool-error';

const mcpStages = [
  { id: 'describe', short: '요청 기술', method: 'Mcp-Method · _meta' },
  { id: 'negotiate', short: '요청별 협상', method: '_meta.version · capabilities' },
  { id: 'discover', short: '발견', method: 'server/discover' },
  { id: 'invoke', short: '호출', method: 'tools/call' },
  { id: 'result', short: '결과', method: 'result' },
] as const;

const mcpMessages: Record<McpCase, string[]> = {
  success: [
    `Mcp-Method: server/discover`,
    `{"_meta":{"protocolVersion":"2026-07-28",\n "capabilities":["tools"]}}`,
    `server/discover → lookup_order schema와 capability metadata`,
    `Mcp-Method: tools/call\nMcp-Name: lookup_order\n{"arguments":{"orderId":"ORD-2048"}}`,
    `{"content":[{"type":"text","text":"paid · $80"}],"isError":false}`,
  ],
  version: [
    `Mcp-Method: server/discover`,
    `요청 거부 · 합의할 수 없는 protocolVersion 2099-01-01`,
    `도달하지 않음`,
    `도달하지 않음`,
    `도달하지 않음`,
  ],
  'tool-error': [
    `Mcp-Method: server/discover`,
    `{"_meta":{"protocolVersion":"2026-07-28",\n "capabilities":["tools"]}}`,
    `server/discover → lookup_order schema와 capability metadata`,
    `Mcp-Method: tools/call\nMcp-Name: lookup_order\n{"arguments":{"orderId":"UNKNOWN"}}`,
    `{"content":[{"type":"text","text":"order not found"}],"isError":true}`,
  ],
};

export function McpRoundTripLab() {
  const [scenario, setScenario] = useState<McpCase>('success');
  const [stage, setStage] = useState(0);
  const failedAt = scenario === 'version' ? 1 : scenario === 'tool-error' ? 4 : -1;
  const outcome = scenario === 'success'
    ? '정상 완료: protocol과 tool 실행이 모두 성공했다.'
    : scenario === 'version'
      ? 'Protocol 실패: 이 request의 version·capability를 합의하지 못해 실행하지 않는다.'
      : 'Tool 실행 실패: JSON-RPC 연결은 정상이며 model이 수정 가능한 결과를 받는다.';

  return (
    <div data-mcp-round-trip-lab className="not-prose my-8 min-w-0 rounded-md border border-border p-4 sm:p-6">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <p className="text-xs font-bold text-muted-foreground">MCP round-trip lab</p>
          <h3 className="mt-1 text-lg font-bold">연결 오류와 도구 오류는 다른 층이다</h3>
        </div>
        <SegmentedControl
          label="MCP 실행 사례"
          options={[
            { value: 'success', label: '정상 호출' },
            { value: 'version', label: 'Version 불일치' },
            { value: 'tool-error', label: 'Tool 오류' },
          ]}
          value={scenario}
          onChange={(value) => { setScenario(value); setStage(0); }}
        />
      </div>

      <div role="tablist" aria-label="MCP 메시지 단계" className="mt-5 grid grid-cols-5 gap-1">
        {mcpStages.map((item, index) => {
          const failed = index === failedAt;
          const unreachable = failedAt >= 0 && index > failedAt;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={stage === index}
              aria-controls="mcp-message-panel"
              tabIndex={stage === index ? 0 : -1}
              onClick={() => setStage(index)}
              onKeyDown={(event) => {
                let next = stage;
                if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (stage + 1) % mcpStages.length;
                if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (stage - 1 + mcpStages.length) % mcpStages.length;
                if (event.key === 'Home') next = 0;
                if (event.key === 'End') next = mcpStages.length - 1;
                if (next !== stage) {
                  event.preventDefault();
                  const tabs = event.currentTarget.parentElement
                    ?.querySelectorAll<HTMLElement>('[role="tab"]');
                  setStage(next);
                  requestAnimationFrame(() => tabs?.[next]?.focus());
                }
              }}
              className={`min-h-11 min-w-0 rounded border px-1.5 py-2 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                stage === index ? 'border-blue-500/50 bg-blue-500/[0.08]' : 'border-border bg-background'
              } ${unreachable ? 'opacity-40' : ''}`}
            >
              <span className="block font-mono text-[10px] text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
              <span className={`mt-1 block text-[11px] font-bold sm:text-xs ${failed ? 'text-red-700 dark:text-red-300' : ''}`}>{item.short}</span>
            </button>
          );
        })}
      </div>

      <div id="mcp-message-panel" role="tabpanel" className="mt-4 min-w-0 rounded-md border border-border bg-muted/15 p-4">
        <p className="text-xs font-bold text-muted-foreground">{mcpStages[stage].method}</p>
        <pre className="mt-3 min-w-0 whitespace-pre-wrap break-all font-mono text-[11px] leading-5 sm:text-xs"><code>{mcpMessages[scenario][stage]}</code></pre>
      </div>

      <div className="mt-4 flex items-start gap-3 border-t border-border pt-4">
        {scenario === 'success'
          ? <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          : <AlertTriangle aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />}
        <p className="text-sm leading-relaxed">{outcome}</p>
      </div>
    </div>
  );
}

type HarnessCase = 'timeout' | 'dangerous' | 'long';

export function HarnessControlLab() {
  const [scenario, setScenario] = useState<HarnessCase>('dangerous');
  const [policyGate, setPolicyGate] = useState(true);
  const [retryLimit, setRetryLimit] = useState(true);
  const [trace, setTrace] = useState(true);

  const result = useMemo(() => {
    if (scenario === 'dangerous') {
      return policyGate
        ? { status: '차단 후 이관', owner: 'Policy gate', sideEffect: '0', release: 'PASS', detail: '80달러 환불은 자동 권한 상한을 넘어 commit 전에 멈춘다.' }
        : { status: '무단 변경', owner: 'Harness', sideEffect: '1', release: 'BLOCK', detail: 'Model proposal이 authorization 없이 실제 환불로 이어졌다.' };
    }
    if (scenario === 'timeout') {
      return retryLimit
        ? { status: '2회 뒤 중단', owner: 'Tool runtime', sideEffect: '0', release: trace ? 'PASS' : 'REVIEW', detail: '같은 timeout을 무한 반복하지 않고 원인과 시도 횟수를 남긴다.' }
        : { status: 'Retry 폭주', owner: 'Harness', sideEffect: '0', release: 'BLOCK', detail: '종료 budget이 없어 비용과 latency가 계속 증가한다.' };
    }
    return trace
      ? { status: 'Checkpoint 인계', owner: 'State manager', sideEffect: '격리', release: 'PASS', detail: '다음 session이 완료 증거와 남은 작업에서 재개한다.' }
      : { status: '진행 유실', owner: 'Harness', sideEffect: '불명', release: 'BLOCK', detail: '새 context window가 완료 여부와 이전 실패를 재구성할 수 없다.' };
  }, [policyGate, retryLimit, scenario, trace]);

  const toggles = [
    { label: 'Policy gate', value: policyGate, set: setPolicyGate },
    { label: 'Retry budget', value: retryLimit, set: setRetryLimit },
    { label: 'Trace·checkpoint', value: trace, set: setTrace },
  ];

  return (
    <div data-harness-control-lab className="not-prose my-8 min-w-0 rounded-md border border-border p-4 sm:p-6">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <p className="text-xs font-bold text-muted-foreground">Harness control lab</p>
          <h3 className="mt-1 text-lg font-bold">모델 제안을 제품의 commit으로 바로 연결하지 않는다</h3>
        </div>
        <SegmentedControl
          label="하네스 실패 사례"
          options={[
            { value: 'dangerous', label: '고위험 행동' },
            { value: 'timeout', label: 'Tool timeout' },
            { value: 'long', label: '긴 작업 인계' },
          ]}
          value={scenario}
          onChange={setScenario}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="하네스 제어 장치">
        {toggles.map((toggle) => (
          <button
            key={toggle.label}
            type="button"
            aria-pressed={toggle.value}
            onClick={() => toggle.set(!toggle.value)}
            className={`inline-flex min-h-9 items-center gap-2 rounded border px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              toggle.value ? 'border-emerald-500/40 bg-emerald-500/[0.07]' : 'border-border text-muted-foreground'
            }`}
          >
            {toggle.value ? <ShieldCheck aria-hidden className="h-4 w-4" /> : <CircleStop aria-hidden className="h-4 w-4" />}
            {toggle.label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        <FlowRow items={[
          { label: 'Admission', value: 'task + grant', note: '목표와 허용 행동을 고정한다.', tone: 'teal' },
          { label: 'Model turn', value: 'proposal', note: '모델은 다음 행동을 제안한다.', tone: 'blue' },
          { label: 'Tool gate', value: policyGate ? 'check' : 'bypass', note: 'schema·권한·budget을 검사한다.', tone: 'violet' },
          { label: 'Commit', value: result.sideEffect, note: '허용된 side effect만 반영한다.', tone: 'amber' },
          { label: 'Evidence', value: trace ? 'trace' : 'missing', note: '재실행 가능한 증거를 남긴다.', tone: 'green' },
        ]} />
      </div>

      <div className="mt-5">
        <MetricGrid items={[
          { label: '실행 결과', value: result.status, accent: true },
          { label: '최초 소유자', value: result.owner },
          { label: 'Side effect', value: result.sideEffect },
          { label: 'Release', value: result.release },
        ]} mobileColumns={2} />
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{result.detail}</p>
    </div>
  );
}
