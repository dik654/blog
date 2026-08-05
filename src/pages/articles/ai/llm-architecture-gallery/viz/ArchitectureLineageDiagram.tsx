import { ArrowDown, ArrowRight, ExternalLink } from 'lucide-react';
import type { ReactNode } from 'react';

export type ArchitectureDiagramKind = 'gpt2' | 'llama3' | 'gemma3' | 'deepseek-v3' | 'kimi-linear';

type ArchitectureLineageDiagramProps = {
  kind: ArchitectureDiagramKind;
  model: string;
  sourceHref: string;
};

type FlowNodeProps = {
  eyebrow: string;
  title: string;
  detail: string;
  tone?: 'neutral' | 'context' | 'capacity' | 'memory';
};

const toneClass = {
  neutral: 'border-border bg-background',
  context: 'border-sky-300/70 bg-sky-50/80 dark:border-sky-900 dark:bg-sky-950/30',
  capacity: 'border-amber-300/70 bg-amber-50/80 dark:border-amber-900 dark:bg-amber-950/30',
  memory: 'border-emerald-300/70 bg-emerald-50/80 dark:border-emerald-900 dark:bg-emerald-950/30',
};

export default function ArchitectureLineageDiagram({
  kind,
  model,
  sourceHref,
}: ArchitectureLineageDiagramProps) {
  return (
    <figure
      className="not-prose min-w-0 rounded-md border border-border bg-muted/15"
      data-architecture-native-diagram
      data-architecture-kind={kind}
      aria-label={`${model} 핵심 구조 흐름`}
    >
      <figcaption className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div>
          <p className="text-xs font-bold uppercase text-muted-foreground">구조 판독도</p>
          <p className="mt-1 text-sm font-bold text-foreground">{model}</p>
        </div>
        <a
          href={sourceHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-9 items-center gap-2 text-xs font-semibold text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground"
          aria-label={`${model} 구조도 원본 크기로 열기`}
        >
          원문 구조도
          <ExternalLink className="size-3.5" aria-hidden="true" />
        </a>
      </figcaption>
      <div className="min-w-0 p-4 sm:p-5">
        {kind === 'gpt2' && <Gpt2Flow />}
        {kind === 'llama3' && <LlamaFlow />}
        {kind === 'gemma3' && <GemmaFlow />}
        {kind === 'deepseek-v3' && <DeepSeekFlow />}
        {kind === 'kimi-linear' && <KimiFlow />}
      </div>
    </figure>
  );
}

function Gpt2Flow() {
  return (
    <div className="space-y-4">
      <FlowRow>
        <FlowNode eyebrow="입력" title="Token + 위치" detail="순서 정보까지 hidden에 더한다" />
        <FlowArrow />
        <FlowNode eyebrow="문맥 혼합" title="Causal MHA" detail="과거 token 전체를 조회한다" tone="context" />
        <FlowArrow />
        <FlowNode eyebrow="채널 혼합" title="GELU MLP" detail="모든 token이 같은 dense FFN을 지난다" tone="capacity" />
        <FlowArrow />
        <FlowNode eyebrow="출력" title="다음 token logit" detail="residual stream을 vocabulary로 투영한다" />
      </FlowRow>
      <div className="grid gap-3 sm:grid-cols-2">
        <ReadingSignal label="반복 깊이" value="GPT-2 XL은 같은 decoder 계약을 48개 block으로 반복한다." />
        <ReadingSignal label="Residual 우회" value="Attention과 MLP의 변화량을 입력 stream에 각각 더해 원래 신호를 보존한다." />
      </div>
    </div>
  );
}

function LlamaFlow() {
  return (
    <div className="space-y-4">
      <FlowRow>
        <FlowNode eyebrow="입력 정규화" title="RMSNorm" detail="크기만 안정화하고 평균은 빼지 않는다" />
        <FlowArrow />
        <FlowNode eyebrow="문맥 혼합" title="RoPE + GQA" detail="Q는 많게, 공유 K/V는 적게 저장한다" tone="context" />
        <FlowArrow />
        <FlowNode eyebrow="채널 혼합" title="SwiGLU" detail="gate가 통과시킬 feature를 고른다" tone="capacity" />
        <FlowArrow />
        <FlowNode eyebrow="계속 유지" title="Dense residual" detail="router 없이 모든 block을 지난다" />
      </FlowRow>
      <div className="grid gap-3 sm:grid-cols-2">
        <MiniContract
          label="GQA 내부"
          steps={['여러 Q head', '공유 K/V 묶음', '같은 context']}
          note="Query 표현 수는 유지하면서 저장할 K/V 수를 줄인다."
        />
        <MiniContract
          label="SwiGLU 내부"
          steps={['gate projection', 'up projection', '원소곱 → down']}
          note="두 병렬 projection의 곱으로 통과시킬 feature를 고른다."
        />
      </div>
    </div>
  );
}

function GemmaFlow() {
  return (
    <div className="space-y-4">
      <div className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-6">
        {[1, 2, 3, 4, 5].map((layer) => (
          <div
            key={layer}
            className="min-h-[88px] min-w-0 rounded border border-sky-300/70 bg-sky-50/80 p-3 dark:border-sky-900 dark:bg-sky-950/30"
          >
            <p className="text-xs font-bold text-sky-800 dark:text-sky-300">LOCAL {layer}</p>
            <p className="mt-2 text-xs font-semibold leading-5 text-foreground">가까운 window만 조회</p>
          </div>
        ))}
        <div className="col-span-2 min-h-[88px] min-w-0 rounded border border-emerald-300/70 bg-emerald-50/80 p-3 sm:col-span-1 dark:border-emerald-900 dark:bg-emerald-950/30">
          <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">GLOBAL 6</p>
          <p className="mt-2 text-xs font-semibold leading-5 text-foreground">먼 token까지 다시 연결</p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center">
        <ReadingSignal label="5개 local" value="대부분의 layer 비용을 window 안으로 제한한다." />
        <ArrowRight className="mx-auto hidden size-4 text-muted-foreground sm:block" aria-hidden="true" />
        <ReadingSignal label="1개 global" value="주기적으로 window 밖 정보를 전체 문맥에 섞는다." />
      </div>
    </div>
  );
}

function DeepSeekFlow() {
  return (
    <div className="space-y-4">
      <FlowRow compact>
        <FlowNode eyebrow="문맥 저장" title="MLA latent" detail="Head별 K/V를 작은 latent로 압축한다" tone="memory" />
        <FlowArrow />
        <FlowNode eyebrow="경로 선택" title="Router score" detail="이번 token에 필요한 expert를 고른다" tone="context" />
      </FlowRow>
      <div className="grid gap-2 sm:grid-cols-3">
        <ExpertNode label="공유 expert" detail="모든 token이 통과" active />
        <ExpertNode label="선택 expert A" detail="Top-k에 들면 활성" active />
        <ExpertNode label="나머지 experts" detail="이번 token은 건너뜀" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <ReadingSignal label="전체 용량" value="671B · 저장된 expert 전체가 지식 용량을 만든다." />
        <ReadingSignal label="token당 활성" value="약 37B · 선택된 경로만 계산한다(약 5.5%)." />
      </div>
    </div>
  );
}

function KimiFlow() {
  return (
    <div className="space-y-4">
      <FlowRow>
        <FlowNode eyebrow="압축 기억 1" title="KDA state" detail="현재 token으로 고정 크기 state 갱신" tone="memory" />
        <FlowArrow />
        <FlowNode eyebrow="압축 기억 2" title="KDA state" detail="KV 전체 대신 누적 상태를 전달" tone="memory" />
        <FlowArrow />
        <FlowNode eyebrow="압축 기억 3" title="KDA state" detail="긴 문맥의 선형 경로를 유지" tone="memory" />
        <FlowArrow />
        <FlowNode eyebrow="정확한 검색" title="MLA global" detail="필요한 token-to-token 검색을 보충" tone="context" />
      </FlowRow>
      <ReadingSignal label="3 : 1 hybrid" value="state 경로로 대부분을 압축하고, 주기적 attention으로 세부 검색 능력을 남긴다." />
    </div>
  );
}

function FlowRow({ children, compact = false }: { children: ReactNode; compact?: boolean }) {
  return (
    <div
      className={`grid min-w-0 gap-2 sm:items-stretch ${
        compact
          ? 'sm:grid-cols-[minmax(0,1fr)_24px_minmax(0,1fr)]'
          : 'sm:grid-cols-[minmax(0,1fr)_24px_minmax(0,1fr)_24px_minmax(0,1fr)_24px_minmax(0,1fr)]'
      }`}
    >
      {children}
    </div>
  );
}

function FlowNode({ eyebrow, title, detail, tone = 'neutral' }: FlowNodeProps) {
  return (
    <div className={`min-h-[96px] min-w-0 rounded border p-3.5 ${toneClass[tone]}`} role="group" aria-label={`${eyebrow}: ${title}. ${detail}`}>
      <p className="text-xs font-bold text-muted-foreground">{eyebrow}</p>
      <p className="mt-2 text-sm font-bold leading-5 text-foreground">{title}</p>
      <p className="mt-1.5 text-xs leading-5 text-muted-foreground">{detail}</p>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="grid min-h-6 place-items-center text-muted-foreground" aria-hidden="true">
      <ArrowDown className="size-4 sm:hidden" />
      <ArrowRight className="hidden size-4 sm:block" />
    </div>
  );
}

function ExpertNode({ label, detail, active = false }: { label: string; detail: string; active?: boolean }) {
  return (
    <div className={`min-w-0 rounded border p-3.5 ${active ? toneClass.capacity : 'border-dashed border-border bg-background/60'}`} role="group" aria-label={`${label}: ${detail}`}>
      <div className="flex items-center gap-2">
        <span className={`size-2 shrink-0 rounded-full ${active ? 'bg-amber-500' : 'bg-muted-foreground/35'}`} aria-hidden="true" />
        <p className="text-sm font-bold text-foreground">{label}</p>
      </div>
      <p className="mt-1.5 pl-4 text-xs leading-5 text-muted-foreground">{detail}</p>
    </div>
  );
}

function ReadingSignal({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 border-l-2 border-foreground/25 pl-3">
      <p className="text-xs font-bold text-muted-foreground">{label}</p>
      <p className="mt-1 text-xs font-semibold leading-5 text-foreground">{value}</p>
    </div>
  );
}

function MiniContract({ label, steps, note }: { label: string; steps: string[]; note: string }) {
  return (
    <div className="min-w-0 rounded border border-border bg-background p-3.5" role="group" aria-label={`${label}: ${steps.join(', ')}`}>
      <p className="text-xs font-bold text-muted-foreground">{label}</p>
      <div className="mt-2 flex min-w-0 flex-wrap items-center gap-1.5">
        {steps.map((step, index) => (
          <div key={step} className="contents">
            {index > 0 && <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />}
            <span className="rounded border border-border bg-muted/20 px-2 py-1 text-xs font-semibold text-foreground">{step}</span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">{note}</p>
    </div>
  );
}
