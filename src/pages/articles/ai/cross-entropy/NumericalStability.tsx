import Math from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { Misconception } from '@/components/learning/ArticleLearning';

const checklist = [
  ['입력', '확률이 아니라 raw logits를 loss에 전달한다.'],
  ['정답', 'single-label 분류는 보통 class index를 사용한다.'],
  ['reduction', '샘플 평균인지 합인지 확인해 gradient 규모를 통제한다.'],
  ['불균형', 'class weight는 드문 class의 오차 기여도를 키운다.'],
  ['label smoothing', 'hard target을 완화하지만 calibration과 정확도를 따로 검증한다.'],
];

export default function NumericalStability() {
  return (
    <section id="numerical-stability" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">코드에서는 왜 softmax를 먼저 호출하면 안 될까?</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          큰 logit에 직접 지수함수를 적용하면 overflow가 나고, 아주 작은 확률에 log를 적용하면 -infinity가 될 수 있다.
          프레임워크의 fused cross-entropy는 softmax와 log를 따로 계산하지 않고 log-sum-exp 형태로 묶어 안정적으로 계산한다.
          <code>log_softmax</code> 뒤 <code>nll_loss</code>를 쓰는 것은 수학적으로 가능하지만, 확률을 명시적으로 만든 뒤 다시 log를
          취하는 수동 구현은 정밀도와 API 계약을 함께 점검해야 한다.
        </p>
      </div>
      <div className="not-prose my-6 grid gap-3 lg:grid-cols-2">
        <div className="min-w-0 rounded-md border border-rose-500/40 p-4">
          <p className="text-xs font-bold text-rose-700 dark:text-rose-300">틀린 double softmax</p>
          <pre className="mt-4 overflow-x-auto text-xs leading-6"><code>{`probs = softmax(logits, dim=-1)\nloss = F.cross_entropy(probs, target)`}</code></pre>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">cross_entropy가 확률을 다시 logits로 해석해 softmax를 한 번 더 적용한다. loss는 줄어도 의도한 목적 함수가 아니다.</p>
        </div>
        <div className="min-w-0 rounded-md border border-emerald-500/40 p-4">
          <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">안정적인 fused 계산</p>
          <pre className="mt-4 overflow-x-auto text-xs leading-6"><code>{`loss = F.cross_entropy(\n    logits, target\n)`}</code></pre>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">raw logits를 받아 log-softmax와 NLL을 안정적인 순서로 계산한다.</p>
        </div>
      </div>
      <div className="not-prose my-6 space-y-2">
        <div className="min-w-0 rounded-md border border-border p-3"><Math display className="my-0 text-xs sm:text-base">{String.raw`\underbrace{m}_{\text{안정화 기준}}=\underbrace{\max_k z_k}_{\text{가장 큰 logit 선택}}`}</Math></div>
        <div className="min-w-0 rounded-md border border-border p-3"><Math display className="my-0 text-xs sm:text-base">{String.raw`\log\sum_k e^{z_k}=\underbrace{m}_{\text{뺀 기준을 복원}}+\underbrace{\log\sum_k e^{z_k-m}}_{\text{지수 overflow 없이 합산}}`}</Math></div>
      </div>
      <FormulaNote
        meaning="모든 logit에서 같은 최대값 m을 빼도 softmax 확률은 변하지 않는다. 가장 큰 지수항이 exp(0)=1이 되어 overflow를 막고 나머지는 0~1 사이가 된다."
        symbols={[
          [String.raw`m`, '현재 샘플 logits 중 최댓값'],
          [String.raw`\operatorname{LSE}(z)`, 'softmax의 정규화 항을 log 공간에서 안정적으로 계산하는 연산'],
          [String.raw`\text{fused loss}`, '서로 연결된 연산을 중간값 없이 함께 계산하는 구현'],
          [String.raw`z`, 'softmax를 통과하기 전 raw logits'],
        ]}
      />

      <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
        {checklist.map(([term, description]) => (
          <div key={term} className="grid gap-1 border-b border-border px-4 py-3 last:border-0 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-4">
            <p className="text-sm font-bold">{term}</p><p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
      <Misconception>
        multi-label 문제는 class 하나만 정답인 softmax cross-entropy가 아니다. 각 label이 독립적으로 켜질 수 있으므로 label별 sigmoid와 binary cross-entropy를 사용해야 한다.
      </Misconception>
    </section>
  );
}
