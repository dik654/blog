import Math from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { InternalLink, Misconception } from '@/components/learning/ArticleLearning';

const failures = [
  { name: '포화', signal: '|z|가 큰 sigmoid/tanh', symptom: '앞층 gradient가 거의 0', response: '입력 scale, initialization, normalization, 함수 위치를 확인' },
  { name: 'Dying ReLU', signal: 'z<0 상태가 계속 유지', symptom: '출력과 local gradient가 모두 0', response: 'learning rate, bias, initialization을 점검하거나 Leaky 계열 고려' },
  { name: '분산 증가', signal: '층마다 activation scale이 커짐', symptom: 'NaN, 불안정한 loss, exploding gradient', response: 'fan-in/out initialization, normalization, residual 경로 점검' },
  { name: 'Mean shift', signal: 'activation 평균이 한쪽으로 치우침', symptom: '다음 층 입력 분포가 계속 이동', response: 'normalization과 architecture 기본값을 함께 검토' },
];

export default function GradientFailure() {
  return (
    <section id="gradient-flow" data-formula-pair className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">깊은 네트워크에서 gradient는 왜 사라지거나 커질까?</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          앞층 gradient는 뒤쪽 층들의 weight와 활성화 도함수를 연속해서 곱한 결과다. 도함수의 크기가 반복해서 1보다
          작으면 gradient가 줄고, 큰 값이 반복되면 커진다. 활성화 함수만의 문제가 아니라 weight initialization,
          normalization, residual connection과 함께 생기는 시스템 문제다.
          여기서는 크기 변화의 직관만 보고, Jacobian과 연쇄 법칙의 정식 계산은 다음 <InternalLink slug="backprop-optimization">역전파 글</InternalLink>에서 shape까지 맞춰 유도한다.
        </p>
      </div>

      <Math display>{String.raw`
r_\ell=
\underbrace{\left\|W^{(\ell)}\right\|}_{\text{선형층의 증폭}}
\underbrace{\left\|\phi'\!\left(z^{(\ell)}\right)\right\|}_{\text{활성화의 통과율}}
`}</Math>
      <Math display className="text-xs sm:text-base">{String.raw`
\left\|\frac{\partial\mathcal{L}}{\partial a^{(0)}}\right\|
\le
\left\|\frac{\partial\mathcal{L}}{\partial a^{(L)}}\right\|
\prod_{\ell=1}^{L}r_\ell
`}</Math>
      <FormulaNote
        meaning="rℓ은 한 층이 gradient 크기를 얼마나 통과시키거나 증폭할 수 있는지 보는 상한이다. 여러 층의 rℓ이 계속 1보다 작으면 앞쪽 신호가 빠르게 줄고, 계속 크면 불안정하게 커진다. 실제 backward는 이 크기 상한보다 방향과 Jacobian 구조까지 함께 계산한다."
        symbols={[
          ['L', '네트워크의 마지막 층 번호'],
          [String.raw`\phi'(z^{(\ell)})`, 'l번째 층 activation의 local derivative'],
          [String.raw`W^{(\ell)}`, 'l번째 층의 선형 변환'],
          [String.raw`r_\ell`, 'l번째 층이 gradient 크기에 줄 수 있는 최대 배율'],
          ['연속 곱', '많은 작은 값 또는 큰 값이 gradient 크기를 누적해서 바꾸는 원인'],
        ]}
      />

      <div className="not-prose my-8 divide-y divide-border border-y border-border">
        {failures.map((item, index) => (
          <div key={item.name} className="grid gap-3 py-5 sm:grid-cols-[2rem_8rem_1fr] sm:gap-5">
            <span className="font-mono text-xs font-bold text-muted-foreground">0{index + 1}</span><div><h3 className="text-sm font-bold">{item.name}</h3><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.signal}</p></div><div className="grid gap-2 text-sm sm:grid-cols-2"><p><strong>관찰:</strong> <span className="text-muted-foreground">{item.symptom}</span></p><p><strong>대응:</strong> <span className="text-muted-foreground">{item.response}</span></p></div>
          </div>
        ))}
      </div>
      <Misconception>
        ReLU가 vanishing gradient를 완전히 해결하는 것은 아니다. 양수 영역의 local derivative가 1이라 sigmoid보다 유리한 경로를 제공하지만, weight product, 음수 영역, 매우 깊은 경로에서는 여전히 문제가 생길 수 있다.
      </Misconception>
    </section>
  );
}
