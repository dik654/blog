import { useState } from 'react';
import { ArrowDown, ArrowRight, BadgeCheck } from 'lucide-react';
import { LabShell, Metric } from '../dezero-shared/ArticleFrame';

const tabs = ['소유권', 'Forward', 'Backward', 'Step'] as const;

function FlowArrow() {
  return (
    <>
      <ArrowRight className="hidden h-5 w-5 shrink-0 text-muted-foreground sm:block" aria-hidden="true" />
      <ArrowDown className="h-5 w-5 shrink-0 text-muted-foreground sm:hidden" aria-hidden="true" />
    </>
  );
}

export default function TrainingContractLab() {
  const [active, setActive] = useState(0);

  return (
    <LabShell
      dataAttribute="data-dezero-training-lab"
      eyebrow="Training contract lab"
      title="한 parameter가 예측, 기울기, update를 통과해도 같은 객체인가"
      tabs={tabs}
      active={active}
      onChange={setActive}
    >
      {active === 0 && (
        <div className="grid gap-4 sm:grid-cols-[1fr_1fr]">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Model shape</p>
            <div className="mt-4 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <Metric label="Input" value="[2]" note="feature 두 개" />
              <FlowArrow />
              <Metric label="Hidden" value="[3] → [2]" note="두 Linear layer" tone="cyan" />
              <FlowArrow />
              <Metric label="Output" value="[1]" note="회귀값 하나" />
            </div>
          </div>
          <div className="rounded-md border border-cyan-500/35 bg-cyan-500/[0.05] p-4">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Identity invariant</p>
            <p className="mt-3 font-mono text-lg font-bold">W_shared · id 0x7f…</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Layer 목록에서 같은 handle이 두 번 발견돼도 optimizer에는 한 번만 넘긴다. 값이 같다는 비교가 아니라
              같은 allocation인지 확인해야 한다.
            </p>
          </div>
        </div>
      )}

      {active === 1 && (
        <div className="space-y-4">
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            {[
              ['x', '2 features', '입력 길이 검사'],
              ['Linear 1', '2 → 3', 'xW₁+b₁'],
              ['Linear 2', '3 → 2', 'h₁W₂+b₂'],
              ['Linear 3', '2 → 1', 'h₂W₃+b₃'],
              ['MSE', 'scalar', '(ŷ−t)²'],
            ].map(([label, value, note], index) => (
              <div key={label} className="contents">
                <Metric label={label} value={value} note={note} tone={index === 4 ? 'amber' : index === 2 ? 'cyan' : 'plain'} />
                {index < 4 && <FlowArrow />}
              </div>
            ))}
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Shape 검사는 디버깅 편의가 아니라 layer 계약이다. <code>[2]</code>가 필요한 곳에 <code>[1]</code>이 오면
            조용히 broadcasting하지 않고 즉시 실패한다.
          </p>
        </div>
      )}

      {active === 2 && (
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ['1. zero_grad', '이전 batch의 parameter.grad를 비운다', '누적 정책을 batch 경계에서 결정'],
            ['2. loss.backward', '출력에서 모든 parameter까지 chain rule', '같은 parameter 경로는 합산'],
            ['3. optimizer.step', '현재 grad로 data를 한 번 갱신', 'identity 중복을 제거한 뒤 실행'],
          ].map(([label, value, note], index) => (
            <Metric key={label} label={label} value={value} note={note} tone={index === 1 ? 'cyan' : 'plain'} />
          ))}
        </div>
      )}

      {active === 3 && (
        <div className="grid gap-5 sm:grid-cols-[1fr_1fr]">
          <div className="rounded-md border border-border p-5">
            <p className="text-xs font-semibold uppercase text-muted-foreground">SGD update</p>
            <p className="mt-3 break-words font-mono text-lg font-bold">θ ← θ − 0.1 · ∂L/∂θ</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Update 뒤에는 이전 forward graph를 재사용하지 않는다. 새 parameter data로 다시 forward해 새 loss를 만든다.
            </p>
          </div>
          <div className="flex items-start gap-3 rounded-md border border-cyan-500/35 bg-cyan-500/[0.05] p-5">
            <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-cyan-700 dark:text-cyan-300" aria-hidden="true" />
            <div>
              <p className="font-bold">Contract test: L_after &lt; L_before</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                정확한 숫자를 외우지 않는다. 같은 입력과 target에서 한 번의 작은 SGD step 뒤 손실이 실제로 낮아지는지를
                실행 테스트로 닫는다.
              </p>
            </div>
          </div>
        </div>
      )}
    </LabShell>
  );
}
