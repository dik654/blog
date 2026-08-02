import FormulaNote from '@/components/ui/formula-note';

const families = [
  { name: 'ReLU', expression: 'max(0, z)', range: '[0, ∞)', gradient: '음수 0 · 양수 1', use: '단순한 MLP/CNN hidden layer', risk: '음수 영역이 계속되면 dying unit' },
  { name: 'Leaky ReLU', expression: 'max(αz, z)', range: '(-∞, ∞)', gradient: '음수 α · 양수 1', use: '음수 gradient를 보존하고 싶을 때', risk: 'α를 추가로 정해야 함' },
  { name: 'GELU', expression: 'z·Φ(z)', range: '매끄러운 비단조', gradient: '연속적인 gate', use: 'Transformer 계열 hidden layer', risk: 'ReLU보다 계산이 복잡' },
  { name: 'SiLU / Swish', expression: 'z·sigmoid(z)', range: '매끄러운 비단조', gradient: '음수에도 작은 신호', use: '일부 현대 CNN/LLM hidden layer', risk: '큰 음수에서는 여전히 작음' },
  { name: 'Sigmoid', expression: '1/(1+exp(-z))', range: '(0, 1)', gradient: '최대 0.25', use: 'gate · binary probability', risk: '양끝 포화 · 0 중심 아님' },
  { name: 'Tanh', expression: 'tanh(z)', range: '(-1, 1)', gradient: '최대 1', use: 'bounded signed state · recurrent gate', risk: '양끝 포화' },
];

export default function ActivationFamilies() {
  return (
    <section id="families" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">함수 이름보다 어떤 성질을 비교해야 할까?</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          활성화 함수 선택은 최신 이름을 고르는 문제가 아니다. 출력 범위, 음수 정보 보존, 0 부근의 gradient, 포화 영역,
          계산 비용, 모델 구조의 검증된 기본값을 함께 본다. Hidden layer와 output layer의 목적도 다르므로 같은 함수를
          모든 위치에 일괄 적용하지 않는다.
        </p>
      </div>

      <div className="not-prose my-8 divide-y divide-border border-y border-border">
        {families.map((item, index) => (
          <div key={item.name} className="grid gap-3 py-5 sm:grid-cols-[2rem_8rem_1fr] sm:gap-5">
            <span className="font-mono text-xs font-bold text-muted-foreground">0{index + 1}</span>
            <div><h3 className="text-sm font-bold">{item.name}</h3><p className="mt-1 break-words font-mono text-xs text-muted-foreground">{item.expression}</p></div>
            <dl className="grid gap-2 text-sm sm:grid-cols-4">
              <div><dt className="text-xs text-muted-foreground">출력 범위</dt><dd className="mt-1 font-medium">{item.range}</dd></div>
              <div><dt className="text-xs text-muted-foreground">도함수</dt><dd className="mt-1 font-medium">{item.gradient}</dd></div>
              <div><dt className="text-xs text-muted-foreground">대표 용도</dt><dd className="mt-1 font-medium">{item.use}</dd></div>
              <div><dt className="text-xs text-muted-foreground">주의점</dt><dd className="mt-1 font-medium">{item.risk}</dd></div>
            </dl>
          </div>
        ))}
      </div>
      <FormulaNote
        meaning="표의 식은 함수 정의를 짧게 적은 것이다. α는 Leaky ReLU의 음수 기울기이고, Φ는 표준 정규분포의 누적분포함수다. Sigmoid와 tanh는 hidden layer 기본값보다 gate나 제한된 출력에 주로 사용한다."
        symbols={[
          ['α', 'Leaky ReLU가 음수 영역에 남겨 두는 작은 기울기'],
          ['Φ(z)', 'GELU가 입력을 확률적으로 gate하는 데 사용하는 표준 정규 CDF'],
          ['exp', 'sigmoid의 지수 함수'],
          ['hidden activation', '표현을 만드는 중간층 함수'],
          ['output activation', '예측의 자료형과 범위를 맞추는 마지막 함수'],
        ]}
      />
    </section>
  );
}
