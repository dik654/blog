import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';

const groups = [
  {
    title: '1 · 같은 입력에서 세 비율과 한 후보를 병렬 계산',
    latex: String.raw`\begin{aligned}
\underbrace{u_t}_{\text{게이트의 공통 입력}}&=[\underbrace{h_{t-1}}_{\text{이전 외부 state}};\underbrace{x_t}_{\text{현재 관측}}]\\
\underbrace{f_t}_{\text{과거 보존 비율}}&=\sigma(W_fu_t+b_f)\\
\underbrace{i_t}_{\text{새 기록 비율}}&=\sigma(W_iu_t+b_i)\\
\underbrace{\tilde C_t}_{\text{기록할 새 내용}}&=\tanh(W_Cu_t+b_C)\\
\underbrace{o_t}_{\text{외부 출력 비율}}&=\sigma(W_ou_t+b_o)
\end{aligned}`,
    meaning: '이전 hidden state와 현재 입력을 이어 붙인 같은 벡터 uₜ를 서로 다른 affine layer에 넣는다. Sigmoid는 0~1 통과 비율을, tanh는 -1~1 후보 내용을 만든다. 식을 순서대로 적어도 구현에서는 네 projection을 하나의 큰 matrix multiply로 합칠 수 있다.',
    symbols: [
      [String.raw`[h_{t-1};x_t]`, '두 벡터를 feature 축으로 이어 붙이는 concatenation'],
      [String.raw`\sigma`, '값을 0~1로 바꿔 성분별 gate 비율을 만드는 sigmoid'],
      [String.raw`\tanh`, '새 후보의 부호를 보존하면서 범위를 -1~1로 누르는 함수'],
      [String.raw`W_f,W_i,W_C,W_o`, '각 gate와 candidate가 서로 다른 판단을 학습하는 weight'],
    ] as [string, string][],
  },
  {
    title: '2 · 과거를 남긴 값과 새로 쓸 값을 더해 cell 갱신',
    latex: String.raw`\underbrace{C_t}_{\text{갱신된 내부 기억}}
=\underbrace{f_t\odot C_{t-1}}_{\text{선택해서 남긴 과거}}
+\underbrace{i_t\odot\tilde C_t}_{\text{선택해서 기록한 현재 후보}}`,
    meaning: 'Forget gate는 이전 cell의 각 성분을 줄이고, input gate는 새 후보의 각 성분을 줄인다. 두 경로를 더하는 additive update가 LSTM memory path의 핵심이다. ⊙는 scalar 곱이 아니라 같은 위치끼리 곱하는 연산이다.',
    symbols: [
      [String.raw`\odot`, '동일한 feature 위치끼리 곱하는 element-wise product'],
      [String.raw`f_t\odot C_{t-1}`, '지우고 남은 과거 기억'],
      [String.raw`i_t\odot\tilde C_t`, '현재 step에서 새로 기록할 내용'],
    ] as [string, string][],
  },
  {
    title: '3 · 내부 기억 중 지금 밖으로 보일 state 생성',
    latex: String.raw`\underbrace{h_t}_{\text{현재 외부 hidden state}}
=\underbrace{o_t}_{\text{출력 gate}}\odot
\underbrace{\tanh(C_t)}_{\text{내부 기억을 출력 범위로 변환}}`,
    meaning: 'Cell state는 내부 memory로 남고, tanh로 범위를 바꾼 뒤 output gate가 현재 밖으로 내보낼 성분을 선택한다. 이 hₜ가 prediction head, 위 layer와 다음 시점의 gate 계산에 들어간다.',
    symbols: [
      [String.raw`C_t`, '시간축으로 이어지는 내부 cell state'],
      [String.raw`h_t`, '현재 step에서 외부로 노출되는 hidden state'],
      [String.raw`o_t`, '현재 기억을 얼마나 읽어낼지 정하는 0~1 비율'],
    ] as [string, string][],
  },
];

export default function GateEquations() {
  return (
    <div data-lstm-gate-equations className="not-prose my-8 space-y-5">
      {groups.map((group) => (
        <section key={group.title} className="min-w-0">
          <h3 className="mb-3 text-sm font-bold">{group.title}</h3>
          <div className="min-w-0 rounded-md border border-border p-3 sm:p-4">
            <MathFormula display className="my-0 text-sm sm:text-base">{group.latex}</MathFormula>
          </div>
          <FormulaNote meaning={group.meaning} symbols={group.symbols} />
        </section>
      ))}
    </div>
  );
}
