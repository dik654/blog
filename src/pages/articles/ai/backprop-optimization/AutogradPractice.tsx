import { Link } from 'react-router-dom';
import Math from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { CapabilityCheck, SourceNotes } from '@/components/learning/ArticleLearning';
import { articlePath } from '@/lib/paths';

const failures = [
  ['gradient가 None', '그래프가 끊겼거나 requires_grad가 꺼졌는지 확인한다. detach, item, 새 tensor 생성 지점을 찾는다.'],
  ['gradient가 계속 커짐', 'gradient accumulation 때문에 zero_grad가 빠졌는지, exploding gradient가 있는지 구분한다.'],
  ['in-place 오류', 'backward가 저장한 activation을 덮어쓴 연산이 있는지 확인한다.'],
  ['수치 gradient와 다름', 'shape 합산, broadcast 역연산, transpose, 비미분점, epsilon 크기를 확인한다.'],
  ['0 또는 NaN', '포화 활성화, 잘못된 log, overflow, mixed precision scale, gradient norm을 확인한다.'],
];

export default function AutogradPractice() {
  return (
    <section id="autograd-practice" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Autograd는 이 과정을 어떻게 실행하고 검증할까?</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          프레임워크는 순전파 중 실제로 실행된 연산과 parent 관계를 기록한다. loss에 gradient 1을 넣고 node를 역위상 순서로
          방문하면서 각 연산의 VJP를 호출한다. 같은 parent로 여러 gradient가 도착하면 누적한다. 사용자는 이 결과를
          optimizer에 넘기기 전에 shape와 수치가 타당한지 확인해야 한다.
        </p>
        <p>
          <strong>위상 순서</strong>는 모든 parent를 그 결과를 쓰는 child보다 먼저 놓는 순서이고, 역위상 순서는 이를 뒤집어 loss 쪽부터 입력 쪽으로 걷는 순서다.
          h처럼 여러 child가 함께 쓰는 node는 그 child들의 backward가 모두 끝난 뒤에 방문해야 각 경로에서 돌아온 gradient를 빠짐없이 합친 상태로 parent에 넘길 수 있다.
        </p>
      </div>

      <pre className="not-prose my-6 whitespace-pre-wrap break-words rounded-md border border-border bg-muted/20 p-4 text-xs leading-6 sm:text-sm"><code>{`topo = topological_sort(loss)
loss.grad = 1

for node in reverse(topo):
    for parent, contribution in node.vjp(node.grad):
        parent.grad += contribution`}</code></pre>

      <h3 className="mt-10 text-lg font-bold">미분 구현은 finite difference로 어떻게 확인할까?</h3>
      <Math display className="text-xs sm:text-base">{String.raw`\frac{\partial\mathcal{L}}{\partial\theta_i}\approx\frac{\mathcal{L}(\theta+\epsilon e_i)-\mathcal{L}(\theta-\epsilon e_i)}{2\epsilon}`}</Math>
      <FormulaNote
        meaning="한 파라미터만 +ε와 -ε로 흔들어 얻은 중앙 차분을 autograd gradient와 비교한다. 느리지만 새 연산의 backward 규칙을 검증하는 강력한 테스트다."
        symbols={[
          ['θᵢ', '검사할 한 파라미터 원소'],
          ['eᵢ', 'i번째 원소만 1인 방향 벡터'],
          ['ε', '부동소수점 오차와 근사 오차 사이를 조절하는 작은 변화량'],
          ['중앙 차분', '+ε와 -ε 양쪽 loss를 사용한 수치 미분 근사'],
        ]}
      />

      <div className="not-prose my-8 divide-y divide-border border-y border-border">
        {failures.map(([symptom, check], index) => (
          <div key={symptom} className="grid gap-2 py-4 sm:grid-cols-[2rem_10rem_1fr] sm:gap-4">
            <span className="font-mono text-xs font-bold text-muted-foreground">0{index + 1}</span>
            <h4 className="text-sm font-bold">{symptom}</h4>
            <p className="text-sm leading-relaxed text-muted-foreground">{check}</p>
          </div>
        ))}
      </div>

      <CapabilityCheck
        items={[
          '순전파 값과 역전파 gradient를 서로 다른 방향의 흐름으로 그린다.',
          'upstream gradient와 local derivative를 곱하는 이유를 설명한다.',
          '그래프가 갈라질 때 gradient contribution을 합산한다.',
          'Reverse mode가 scalar loss와 많은 파라미터에 유리한 이유를 설명한다.',
          '선형층 backward의 모든 tensor shape를 검산한다.',
          'finite difference로 custom backward 구현을 검사한다.',
        ]}
      />

      <div className="not-prose my-8 border-y border-border py-5">
        <p className="text-sm font-bold">다음 단계: gradient를 어떻게 사용할까?</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          역전파가 만든 gradient를 그대로 빼는 SGD부터, momentum state와 adaptive scale을 사용하는 AdamW까지는 optimizer의 책임이다.
        </p>
        <Link to={articlePath('ai', 'optimizers')} className="mt-4 inline-flex items-center rounded-md bg-foreground px-3 py-2 text-sm font-semibold text-background hover:opacity-90">
          옵티마이저로 이어서 보기
        </Link>
      </div>

      <SourceNotes
        sources={[
          { label: 'Automatic Differentiation in Machine Learning', href: 'https://www.jmlr.org/papers/v18/17-468.html', note: 'forward/reverse mode, Jacobian product, 계산 복잡도를 정리한 JMLR survey.' },
          { label: 'PyTorch autograd mechanics', href: 'https://docs.pytorch.org/docs/stable/notes/autograd.html', note: '동적 계산 그래프, saved tensor, non-differentiable operation의 실제 동작.' },
          { label: 'Tensor.backward', href: 'https://docs.pytorch.org/docs/stable/generated/torch.Tensor.backward.html', note: 'gradient accumulation과 scalar가 아닌 출력의 gradient 인자.' },
        ]}
      />
    </section>
  );
}
