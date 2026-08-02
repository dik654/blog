import Math from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { Misconception } from '@/components/learning/ArticleLearning';

function BranchingGradientMap() {
  return (
    <figure className="not-prose my-8 rounded-md border border-border p-4 sm:p-6">
      <figcaption className="mb-5 text-sm font-semibold">하나의 값이 두 경로로 쓰이면 backward에서 다시 더해진다</figcaption>
      <div className="grid gap-3 text-center sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
        <div className="rounded-md border border-border bg-muted/15 p-4">
          <p className="font-mono text-sm font-bold">h</p>
          <p className="mt-1 text-xs text-muted-foreground">공유된 중간값</p>
        </div>
        <span className="hidden text-muted-foreground sm:block" aria-hidden="true">→</span>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-md border border-blue-500/40 p-3"><p className="font-mono text-sm font-bold">a=f(h)</p><p className="mt-1 text-xs text-muted-foreground">경로 A</p></div>
          <div className="rounded-md border border-violet-500/40 p-3"><p className="font-mono text-sm font-bold">b=g(h)</p><p className="mt-1 text-xs text-muted-foreground">경로 B</p></div>
        </div>
        <span className="hidden text-muted-foreground sm:block" aria-hidden="true">→</span>
        <div className="rounded-md border border-rose-500/40 bg-muted/15 p-4">
          <p className="font-mono text-sm font-bold">L=a+b</p>
          <p className="mt-1 text-xs text-muted-foreground">두 경로를 합친 손실</p>
        </div>
      </div>
      <p className="mt-5 text-xs leading-relaxed text-muted-foreground">Backward 방향에서는 A가 보낸 gradient와 B가 보낸 gradient를 h에서 합산한다.</p>
    </figure>
  );
}

export default function CoreChainRule() {
  return (
    <section id="chain-rule" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">연쇄 법칙은 gradient를 어떻게 연결할까?</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          현재 node가 받은 upstream gradient는 “이 node의 출력이 최종 손실에 미친 영향”이다. 여기에 “이 node의 입력이
          출력에 미친 영향”인 local derivative를 곱하면 앞쪽 입력의 gradient가 된다. 역전파 엔진은 모든 연산에서 이
          규칙 하나를 반복한다.
        </p>
      </div>

      <Math display>{String.raw`\bar{x}=\bar{y}\,\frac{\partial y}{\partial x}, \qquad \bar{y}=\frac{\partial\mathcal{L}}{\partial y}, \quad \bar{x}=\frac{\partial\mathcal{L}}{\partial x}`}</Math>
      <FormulaNote
        meaning="y=f(x)인 한 연산에서 upstream gradient ȳ와 local derivative ∂y/∂x를 곱해 x로 보낼 gradient x̄를 만든다. 막대 표기는 해당 값에 대한 최종 손실의 gradient를 뜻한다."
        symbols={[
          ['ȳ', '뒤쪽 그래프에서 전달된 ∂L/∂y'],
          ['∂y/∂x', '현재 연산 f만 아는 local derivative'],
          ['x̄', '앞쪽 node로 전달할 ∂L/∂x'],
        ]}
      />

      <BranchingGradientMap />

      <Math display>{String.raw`\frac{\partial\mathcal{L}}{\partial h}=\frac{\partial\mathcal{L}}{\partial a}\frac{\partial a}{\partial h}+\frac{\partial\mathcal{L}}{\partial b}\frac{\partial b}{\partial h}`}</Math>
      <FormulaNote
        meaning="h가 두 경로 a와 b에 쓰이면 h의 총 gradient는 각 경로가 보낸 기여의 합이다. residual connection, attention의 여러 head, 공유 파라미터에서도 같은 합산이 일어난다."
        symbols={[
          ['h', '여러 뒤쪽 연산이 함께 사용한 중간값'],
          ['a, b', 'h에서 갈라진 두 계산 경로'],
          ['덧셈', '서로 다른 경로가 최종 손실에 미친 기여를 모두 반영하는 accumulation'],
        ]}
      />

      <Misconception>
        계산 그래프가 직선일 때만 gradient를 계속 곱한다. 그래프가 갈라졌다가 합쳐지면 각 경로에서는 곱하고, 같은 node로 돌아온 기여는 더한다.
      </Misconception>
    </section>
  );
}
