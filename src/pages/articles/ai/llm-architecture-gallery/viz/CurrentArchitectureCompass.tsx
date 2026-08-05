import { ExternalLink } from 'lucide-react';
import { useState } from 'react';

type AxisId = 'input' | 'context' | 'capacity' | 'memory' | 'depth';

type CurrentChange = {
  id: string;
  order: string;
  model: string;
  axisIds: AxisId[];
  thesis: string;
  baseline: string;
  changed: string;
  path: string[];
  consequence: string;
  verify: string;
  sourceLabel: string;
  sourceHref: string;
};

const axes: { id: AxisId; order: string; label: string; question: string }[] = [
  { id: 'input', order: '01', label: '입력 경계', question: '누가 modality를 token으로 바꾸는가' },
  { id: 'context', order: '02', label: '문맥 혼합', question: '어느 과거 token을 읽는가' },
  { id: 'capacity', order: '03', label: '용량 배분', question: '어느 FFN·expert를 계산하는가' },
  { id: 'memory', order: '04', label: '상태 저장', question: '과거를 어떤 형태로 남기는가' },
  { id: 'depth', order: '05', label: '깊이 혼합', question: '어느 이전 layer를 가져오는가' },
];

const currentChanges: CurrentChange[] = [
  {
    id: 'deepseek-v4',
    order: '01',
    model: 'DeepSeek-V4',
    axisIds: ['context', 'memory', 'depth'],
    thesis: '긴 문맥을 줄이는 attention과 깊이를 안정화하는 residual을 함께 바꾼다.',
    baseline: '모든 과거 token의 K/V를 저장하고, 현재 layer는 직전 residual stream을 받는다.',
    changed: 'CSA·HCA가 장거리 접근과 KV 저장을 압축하고, mHC가 layer 사이 신호 결합을 제약한다.',
    path: ['현재 token 입력', '압축된 장거리 후보 읽기', '선택된 문맥을 attention에 혼합', 'mHC 경로로 다음 layer에 전달'],
    consequence: '긴 문맥 비용과 깊은 network의 신호 안정성을 서로 다른 장치로 동시에 다룬다.',
    verify: '공식 수치는 DeepSeek-V3.2 대비 저자 환경의 FLOPs·KV 비교다. 실제 latency는 kernel, 통신, batch와 함께 다시 재야 한다.',
    sourceLabel: 'DeepSeek-V4 공식 기술 보고서',
    sourceHref: 'https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash/blob/main/DeepSeek_V4.pdf',
  },
  {
    id: 'attention-residuals',
    order: '02',
    model: 'Attention Residuals',
    axisIds: ['depth'],
    thesis: 'attention을 token 방향뿐 아니라 layer 깊이 방향에도 적용한다.',
    baseline: 'PreNorm residual은 이전 변화량을 같은 가중치로 계속 누적한다.',
    changed: '현재 layer가 learned pseudo-query로 이전 layer·block 표현을 선택해 가져온다.',
    path: ['이전 layer 표현 모으기', 'RMSNorm으로 비교 좌표 맞추기', 'depth softmax weight 계산', '선택한 표현을 현재 block 입력으로 만들기'],
    consequence: '직전 hidden 하나만 받던 깊이 경로가 입력에 따라 달라지는 조회 문제로 바뀐다.',
    verify: 'Full 방식은 O(Ld) activation memory가 필요하다. Block 방식이 같은 이득을 유지하는지는 깊이·block 수별 ablation으로 확인해야 한다.',
    sourceLabel: 'Moonshot AI 공식 논문·구현',
    sourceHref: 'https://github.com/MoonshotAI/Attention-Residuals',
  },
  {
    id: 'gemma-4',
    order: '03',
    model: 'Gemma 4 12B',
    axisIds: ['input'],
    thesis: 'vision·audio 처리를 별도 대형 encoder보다 공통 backbone 쪽으로 옮긴다.',
    baseline: '전용 vision·audio encoder가 특징을 충분히 만든 뒤 LLM token 공간에 연결한다.',
    changed: 'Vision은 얕은 embedding module, audio는 raw signal projection을 거쳐 공통 LLM backbone으로 들어간다.',
    path: ['image·audio 입력', '얕은 embedding·projection', 'text와 같은 hidden 공간에 배치', 'shared backbone에서 modality 처리'],
    consequence: '모델 구조와 memory 경계는 단순해지지만, modality 처리 부담이 backbone으로 이동한다.',
    verify: 'Encoder-free와 16GB 실행은 Google 공개 범위의 주장이다. 품질·latency·memory는 동일 입력과 runtime의 독립 측정이 필요하다.',
    sourceLabel: 'Google DeepMind 공식 발표',
    sourceHref: 'https://blog.google/innovation-and-ai/technology/developers-tools/introducing-gemma-4-12B/',
  },
];

export default function CurrentArchitectureCompass() {
  const [selectedId, setSelectedId] = useState(currentChanges[0].id);
  const selected = currentChanges.find((change) => change.id === selectedId) ?? currentChanges[0];

  return (
    <figure
      className="not-prose mt-8 overflow-hidden rounded-md border border-border bg-background"
      data-current-architecture-compass
      data-viz-canvas
    >
      <figcaption className="border-b border-border px-4 py-4 sm:px-6 sm:py-5">
        <p className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">CURRENT DELTA COMPASS · 2026</p>
        <h3 className="mt-2 text-lg font-bold leading-7">모델 이름보다 먼저, 바뀐 축과 token 경로를 찾는다</h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          공개 변화 하나를 고르면 같은 다섯 좌표 위에서 기준 계약, 변경 지점, 실행 순서와 증거 한계를 함께 읽는다.
        </p>
      </figcaption>

      <div className="grid grid-cols-5 border-b border-border" aria-label="LLM 구조 판독 다섯 축">
        {axes.map((axis) => {
          const active = selected.axisIds.includes(axis.id);
          return (
            <div
              key={axis.id}
              className={`min-w-0 border-r border-border px-1.5 py-3 last:border-r-0 sm:px-3 ${active ? 'bg-foreground text-background' : 'bg-muted/15 text-muted-foreground'}`}
              data-axis-active={active ? 'true' : 'false'}
            >
              <p className="font-mono text-xs font-bold">{axis.order}</p>
              <p className="mt-1 break-keep text-xs font-bold leading-4 sm:text-sm">{axis.label}</p>
              <p className="mt-1 hidden text-xs leading-5 opacity-75 lg:block">{axis.question}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 border-b border-border" role="tablist" aria-label="2026년 현재 구조 변화">
        {currentChanges.map((change) => {
          const active = change.id === selected.id;
          return (
            <button
              key={change.id}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls="current-architecture-change"
              onClick={() => setSelectedId(change.id)}
              className={`min-h-[68px] min-w-0 border-r border-border px-2 py-3 text-left transition-colors last:border-r-0 sm:px-4 ${active ? 'bg-muted/55 text-foreground' : 'bg-background text-muted-foreground hover:bg-muted/25 hover:text-foreground'}`}
            >
              <span className="block font-mono text-xs font-bold">{change.order}</span>
              <span className="mt-1 block break-words text-xs font-bold leading-4 sm:text-sm sm:leading-5">{change.model}</span>
            </button>
          );
        })}
      </div>

      <div id="current-architecture-change" role="tabpanel" className="min-w-0 px-4 py-6 sm:px-6 sm:py-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 max-w-3xl">
            <p className="text-xs font-bold text-muted-foreground">{selected.axisIds.map((id) => axes.find((axis) => axis.id === id)?.label).filter(Boolean).join(' · ')}</p>
            <h4 className="mt-2 text-xl font-bold leading-7">{selected.model}</h4>
            <p className="mt-2 text-sm font-medium leading-7">{selected.thesis}</p>
          </div>
          <a
            href={selected.sourceHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground"
          >
            {selected.sourceLabel}
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
        </div>

        <div className="mt-6 grid border-y border-border md:grid-cols-2">
          <ContractDelta label="기준 계약" body={selected.baseline} />
          <ContractDelta label="바뀐 계약" body={selected.changed} changed />
        </div>

        <div className="mt-7">
          <p className="text-xs font-bold text-muted-foreground">한 입력이 지나가는 순서</p>
          <ol className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {selected.path.map((step, index) => (
              <li key={step} className="grid min-w-0 grid-cols-[28px_minmax(0,1fr)] gap-2 border-t border-border pt-3">
                <span className="font-mono text-xs font-bold text-foreground/55">{String(index + 1).padStart(2, '0')}</span>
                <span className="text-sm font-semibold leading-6">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-7 grid gap-5 border-t border-border pt-5 md:grid-cols-2">
          <ReadingResult label="그래서 달라지는 것" body={selected.consequence} />
          <ReadingResult label="아직 검증할 것" body={selected.verify} />
        </div>
      </div>
    </figure>
  );
}

function ContractDelta({ label, body, changed = false }: { label: string; body: string; changed?: boolean }) {
  return (
    <div className={`min-w-0 py-5 md:px-5 ${changed ? 'border-t border-border bg-emerald-50/45 md:border-l md:border-t-0 dark:bg-emerald-950/15' : ''}`}>
      <p className="text-xs font-bold text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm font-semibold leading-7">{body}</p>
    </div>
  );
}

function ReadingResult({ label, body }: { label: string; body: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-bold text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm leading-7 text-foreground/80">{body}</p>
    </div>
  );
}
