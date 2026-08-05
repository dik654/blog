import Math from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { Misconception } from '@/components/learning/ArticleLearning';

const modes = [
  {
    mode: 'Forward mode',
    carries: '입력 방향 하나의 변화율',
    efficient: '입력 수가 적고 출력 수가 많을 때',
    repeats: '모든 파라미터 gradient에는 많은 seed가 필요',
  },
  {
    mode: 'Reverse mode',
    carries: '출력 scalar에서 온 adjoint',
    efficient: '출력이 scalar이고 입력 파라미터가 많을 때',
    repeats: '한 번의 reverse sweep으로 전체 gradient 계산',
  },
];

export default function CoreReverseMode() {
  return (
    <section id="reverse-mode" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">왜 신경망은 Reverse mode를 사용할까?</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          신경망 훈련은 수백만 개 이상의 파라미터를 입력으로 보고 최종 loss 하나를 출력하는 함수로 생각할 수 있다.
          우리가 원하는 것은 그 scalar loss를 모든 파라미터로 미분한 gradient다. Reverse mode는 출력 쪽 seed 하나에서
          시작해 그래프를 역순으로 훑으므로 이 비대칭에 잘 맞는다.
        </p>
      </div>

      <div className="not-prose my-8 divide-y divide-border border-y border-border">
        {modes.map((mode, index) => (
          <div key={mode.mode} className="grid gap-3 py-5 sm:grid-cols-[2rem_9rem_1fr] sm:gap-5">
            <span className="font-mono text-xs font-bold text-muted-foreground">0{index + 1}</span>
            <h3 className="text-sm font-bold">{mode.mode}</h3>
            <dl className="grid gap-2 text-sm sm:grid-cols-3">
              <div><dt className="text-xs text-muted-foreground">운반하는 값</dt><dd className="mt-1 font-medium leading-relaxed">{mode.carries}</dd></div>
              <div><dt className="text-xs text-muted-foreground">유리한 형태</dt><dd className="mt-1 font-medium leading-relaxed">{mode.efficient}</dd></div>
              <div><dt className="text-xs text-muted-foreground">반복 특성</dt><dd className="mt-1 font-medium leading-relaxed">{mode.repeats}</dd></div>
            </dl>
          </div>
        ))}
      </div>

      <Math display>{String.raw`\bar{x}=\bar{y}\,J_f(x)`}</Math>
      <FormulaNote
        meaning="Reverse mode의 각 연산은 전체 Jacobian을 저장하지 않고, 뒤에서 온 row vector ȳ와 local Jacobian J를 곱한 vector-Jacobian product만 계산한다."
        symbols={[
          ['f', '입력 x를 출력 y로 바꾸는 현재 연산'],
          ['Jf(x)', 'y=f(x)의 각 출력 y_i를 각 입력 x_j로 편미분해 모은 local 행렬(∂y_i/∂x_j)'],
          ['ȳ', '출력 y에 대한 upstream gradient'],
          ['x̄', '입력 x에 대한 downstream gradient'],
        ]}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>“한 번의 backward”가 O(1)이라는 뜻은 아니다</h3>
        <p>
          Reverse mode는 파라미터마다 전체 forward를 다시 실행하는 일을 피한다. 그러나 그래프의 각 연산은 적어도 한 번
          역방향으로 처리해야 하므로 비용은 대체로 forward 계산량과 같은 차수다. 또한 backward에 필요한 activation을
          보관하므로 메모리 사용량도 그래프 깊이와 tensor 크기에 따라 늘어난다.
        </p>
      </div>

      <Misconception>
        역전파는 symbolic differentiation으로 거대한 미분식을 먼저 만드는 방식이 아니다. 실행된 primitive operation의 그래프를 기록하고, 각 primitive의 VJP 규칙을 역순으로 적용한다.
      </Misconception>
    </section>
  );
}
