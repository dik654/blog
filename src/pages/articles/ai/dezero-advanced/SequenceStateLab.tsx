import { useState } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { LabShell, Metric } from '../dezero-shared/ArticleFrame';

const tabs = ['State 경계', 'LSTM 경로', 'LayerNorm 축', 'Dropout', 'Embedding'] as const;

function FlowArrow() {
  return (
    <>
      <ArrowRight className="hidden h-5 w-5 shrink-0 text-muted-foreground sm:block" aria-hidden="true" />
      <ArrowDown className="h-5 w-5 shrink-0 text-muted-foreground sm:hidden" aria-hidden="true" />
    </>
  );
}

export default function SequenceStateLab() {
  const [active, setActive] = useState(0);

  return (
    <LabShell
      dataAttribute="data-dezero-sequence-lab"
      eyebrow="State and axis lab"
      title="시간 state, 통계 축, 무작위 mask와 sparse index의 책임 경계"
      tabs={tabs}
      active={active}
      onChange={setActive}
    >
      {active === 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-md border border-border p-5">
            <p className="text-xs font-semibold uppercase text-muted-foreground">detach</p>
            <p className="mt-2 font-mono text-lg font-bold">(h, c) 값은 유지</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              새 leaf로 복사해 이전 graph만 끊는다. 긴 stream의 truncated BPTT 경계에서 사용한다.
            </p>
          </div>
          <div className="rounded-md border border-amber-500/35 bg-amber-500/[0.05] p-5">
            <p className="text-xs font-semibold uppercase text-muted-foreground">reset</p>
            <p className="mt-2 font-mono text-lg font-bold">(h, c) ← (0, 0)</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              이전 sequence의 의미까지 지운다. 서로 다른 문서나 독립 sample의 경계에서 사용한다.
            </p>
          </div>
        </div>
      )}

      {active === 1 && (
        <div className="space-y-5">
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Metric label="Step 1" value="f₁ = 0.9" note="이전 cell을 90% 통과" />
            <FlowArrow />
            <Metric label="Step 2" value="f₂ = 0.8" note="남은 신호의 80% 통과" tone="cyan" />
            <FlowArrow />
            <Metric label="Step 3" value="f₃ = 0.5" note="남은 신호의 절반 통과" />
            <FlowArrow />
            <Metric label="Cell path" value="0.9·0.8·0.5 = 0.36" note="기울기는 forget gate의 곱" tone="amber" />
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            LSTM은 기울기를 항상 1로 보존하지 않는다. 곱해지는 값이 recurrent weight와 tanh 미분만이 아니라
            학습된 forget gate가 되므로 필요한 기억 경로를 더 직접 제어할 수 있다.
          </p>
        </div>
      )}

      {active === 2 && (
        <div className="grid gap-4 sm:grid-cols-[1fr_1fr]">
          <div className="rounded-md border border-border p-5">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Input contract</p>
            <p className="mt-2 font-mono text-xl font-bold">x ∈ ℝᴮˣᵀˣᴰ</p>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              <span className="rounded border border-border p-2"><strong>B</strong><br />batch</span>
              <span className="rounded border border-border p-2"><strong>T</strong><br />time</span>
              <span className="rounded border border-cyan-500/40 bg-cyan-500/[0.06] p-2"><strong>D</strong><br />feature</span>
            </div>
          </div>
          <div className="rounded-md border border-cyan-500/35 bg-cyan-500/[0.05] p-5">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Normalized axis</p>
            <p className="mt-2 font-mono text-xl font-bold">mean_D, variance_D</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              각 <code>(batch, time)</code> 위치 안에서 마지막 feature D만 정규화한다.
              <code>γ=1, β=0</code>은 affine만 그대로 두며, 전체 LayerNorm을 identity로 만들지 않는다.
            </p>
          </div>
        </div>
      )}

      {active === 3 && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Metric label="Input" value="x = 2" note="drop probability p=0.5" />
          <Metric label="Dropped mask" value="0" note="확률 0.5 · output 0" />
          <Metric label="Kept mask" value="2/(1−0.5) = 4" note="확률 0.5 · 평균 (0+4)/2 = 2" tone="cyan" />
          <p className="sm:col-span-3 text-sm leading-relaxed text-muted-foreground">
            Inverted dropout은 개별 forward 값을 보존하지 않는다. mask에 대해 평균을 냈을 때의 기댓값을 보존한다.
            평가 모드에서는 무작위 mask 없이 입력을 그대로 통과시킨다.
          </p>
        </div>
      )}

      {active === 4 && (
        <div className="grid gap-5 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <div className="rounded-md border border-border p-5">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Token ids</p>
            <p className="mt-2 font-mono text-2xl font-bold">[4, 1, 4]</p>
            <p className="mt-2 text-sm text-muted-foreground">4번 row가 두 위치에 같은 handle로 나타난다.</p>
          </div>
          <FlowArrow />
          <div className="rounded-md border border-cyan-500/35 bg-cyan-500/[0.05] p-5">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Backward scatter-add</p>
            <p className="mt-2 font-mono text-xl font-bold">grad W[4] = 1 + 1 = 2</p>
            <p className="mt-2 text-sm text-muted-foreground">grad W[1] = 1 · 읽히지 않은 row는 0</p>
          </div>
        </div>
      )}
    </LabShell>
  );
}
