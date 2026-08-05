import { Link } from 'react-router-dom';
import Math from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { articlePath } from '@/lib/paths';

const shapes = [
  ['X', 'B × d', '현재 층의 입력 batch'],
  ['W', 'd × h', '학습할 가중치'],
  ['b', 'h', '모든 샘플에 broadcast되는 편향'],
  ['Z, A', 'B × h', '선형 출력과 활성화 출력'],
  ['G_A, G_Z', 'B × h', '출력과 선형 출력에 대한 gradient'],
  ['G_W', 'd × h', 'W와 같은 shape의 gradient'],
];

export default function LayerBackprop() {
  return (
    <section id="layer-backprop" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">신경망 한 층의 backward를 shape로 검산해 보자</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          실제 구현에서는 scalar 예제보다 tensor shape를 놓치기 쉽다. batch 입력 X에 가중치 W를 곱하고 편향 b를 더한 뒤
          활성화 함수 σ를 적용하는 층을 보자. 뒤쪽 층에서 A와 같은 shape의 upstream gradient G_A가 도착했다고 가정한다.
        </p>
      </div>

      <div data-formula-pair>
        <Math display>{String.raw`
\underbrace{Z}_{\text{활성화 전 출력}}
=XW+b
`}</Math>
        <Math display>{String.raw`
\underbrace{A}_{\text{다음 층으로 전달}}
=\sigma(Z)
`}</Math>
        <FormulaNote
          meaning="순전파는 B개 샘플을 d개 입력 특징에서 h개 출력 특징으로 바꾼다. 편향 b는 batch의 모든 행에 같은 값으로 더해진다."
          symbols={[
            [String.raw`X\ [B\times d]`, 'batch 입력'],
            [String.raw`W\ [d\times h]`, '입력 특징을 출력 특징으로 섞는 가중치'],
            [String.raw`b\ [h]`, 'batch 차원으로 broadcast되는 편향'],
            [String.raw`Z,A\ [B\times h]`, '활성화 전후의 출력'],
          ]}
        />
      </div>

      <div className="not-prose my-6 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
        <div className="min-w-0 border-l-2 border-cyan-600 bg-background p-4"><p className="text-[10px] font-bold text-cyan-700 dark:text-cyan-300">01 · ACTIVATION</p><Math display className="my-3 text-sm">{String.raw`\underbrace{G_Z}_{\text{선형 출력 책임}}=\underbrace{G_A}_{\text{뒤에서 온 책임}}\odot\underbrace{\sigma'(Z)}_{\text{국소 기울기}}`}</Math><p className="text-xs text-muted-foreground">먼저 활성화 함수를 거꾸로 통과한다.</p></div>
        <div className="min-w-0 border-l-2 border-blue-600 bg-background p-4"><p className="text-[10px] font-bold text-blue-700 dark:text-blue-300">02 · WEIGHT</p><Math display className="my-3 text-sm">{String.raw`\underbrace{G_W}_{\text{가중치 책임}}=\underbrace{X^\top G_Z}_{\text{배치 기여 합}}`}</Math><p className="text-xs text-muted-foreground">모든 샘플이 같은 W에 준 기여를 합친다.</p></div>
        <div className="min-w-0 border-l-2 border-amber-600 bg-background p-4"><p className="text-[10px] font-bold text-amber-700 dark:text-amber-300">03 · BIAS</p><Math display className="my-3 text-sm">{String.raw`\underbrace{G_b}_{\text{편향 책임}}=\underbrace{\sum_{i=1}^{B}G_{Z,i}}_{\text{복제의 역연산}}`}</Math><p className="text-xs text-muted-foreground">복제해 더했던 batch 축을 다시 합한다.</p></div>
        <div className="min-w-0 border-l-2 border-violet-600 bg-background p-4"><p className="text-[10px] font-bold text-violet-700 dark:text-violet-300">04 · PREVIOUS LAYER</p><Math display className="my-3 text-sm">{String.raw`\underbrace{G_X}_{\text{앞층 책임}}=\underbrace{G_ZW^\top}_{\text{입력 방향으로 투영}}`}</Math><p className="text-xs text-muted-foreground">앞층이 계속 backward할 shape로 돌려보낸다.</p></div>
      </div>
      <FormulaNote
        meaning="뒤에서 온 G_A를 활성화 함수의 local derivative와 원소별로 곱한 뒤, 같은 G_Z를 사용해 W, b, X 세 방향의 gradient를 만든다. 각 결과는 자신이 미분하는 대상과 같은 shape여야 한다."
        symbols={[
          [String.raw`\odot`, '같은 위치끼리 곱하는 element-wise product'],
          [String.raw`G_W\ [d\times h]`, 'batch의 모든 샘플이 W에 준 기여를 합친 값'],
          [String.raw`G_b\ [h]`, 'broadcast의 역연산으로 batch 차원을 합산한 값'],
          [String.raw`G_X\ [B\times d]`, '앞쪽 층으로 계속 전달할 gradient'],
        ]}
      />

      <div className="not-prose my-8 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {shapes.map(([symbol, shape, role]) => (
          <div key={symbol} className="min-w-0 bg-background p-4">
            <div className="flex items-center justify-between gap-2"><span className="font-mono text-sm font-bold">{symbol}</span><span className="font-mono text-xs text-muted-foreground">{shape}</span></div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{role}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Softmax와 cross-entropy는 어디에 들어갈까?</h3>
        <p>
          분류 모델의 마지막 logits에 softmax와 cross-entropy를 함께 적용하면 logits gradient가 예측 확률에서 정답 분포를
          뺀 형태로 단순해진다. 그 유도와 수치 안정성은 <Link to={articlePath('ai', 'cross-entropy')}>크로스 엔트로피 전용 글</Link>에서
          다루고, 이 글에서는 그 gradient가 도착한 뒤 각 층을 거꾸로 통과하는 과정에 집중한다.
        </p>
      </div>
    </section>
  );
}
