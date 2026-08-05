import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import { MemoryGradientLab } from './viz/LSTMConceptExplorers';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">RNN의 한계와 LSTM의 등장</h2>
      <QuestionLead
        question="12 step 전 입력이 오늘 예측에 중요하다면, 그 책임 신호가 12번의 곱셈 뒤에도 남을까?"
        answer="Vanilla RNN은 현재 hidden state를 이전 hidden state의 변환으로 다시 만든다. 역전파에서는 같은 종류의 Jacobian을 시간만큼 반복해서 곱하므로 크기가 1보다 작으면 사라지고 크면 폭발한다. LSTM은 기억을 덧셈으로 갱신하는 cell state와 0~1 gate를 두어, 보존할 성분의 더 직접적인 경로를 만든다."
      />
      <ConceptPrimer items={[
        { term: 'Hidden state hₜ', meaning: '현재 입력과 과거를 압축해 다음 step과 prediction head에 내보내는 벡터다.', why: '모든 과거 원본을 저장하지 않고 recurrent state 하나로 다음 계산을 이어 간다.' },
        { term: 'BPTT', meaning: '시간축으로 펼친 recurrent graph에 chain rule을 적용하는 backpropagation through time이다.', why: '먼 과거 입력의 책임이 몇 번의 곱셈을 지나오는지 보이게 한다.' },
        { term: 'Cell state Cₜ', meaning: 'LSTM이 hidden output과 분리해 유지하는 내부 기억 경로다.', why: '과거 기억과 새 후보를 더하는 직접 경로를 만들어 곱셈 병목을 완화한다.' },
        { term: 'Gate', meaning: 'sigmoid로 만든 0~1 성분별 통과 비율이다.', why: '무조건 오래 기억하지 않고 과거 보존·새 정보 기록·외부 출력을 학습한다.' },
      ]} />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p><InternalLink slug="rnn">RNN 글</InternalLink>의 계산을 그대로 이어 보자. Vanilla RNN은 <MathFormula>{String.raw`h_t=\phi(W_hh_{t-1}+W_xx_t+b)`}</MathFormula>처럼 한 step 전 state를 비선형 변환해 새 state를 만든다. 따라서 멀리 떨어진 두 state의 미분에는 중간 step의 activation derivative와 recurrent weight가 계속 곱해진다. <InternalLink slug="paper-long-term-dependencies-1994">1994년 분석</InternalLink>은 이 곱이 장기 credit assignment를 어렵게 하는 이유를 분리했고, <InternalLink slug="paper-lstm-1997">1997년 LSTM</InternalLink>은 constant error carousel과 input·output gate로 다른 gradient path를 제안했다.</p>
      </div>
      <div className="not-prose my-6 min-w-0">
        <div className="min-w-0 rounded-md border border-border p-3 sm:p-4">
          <MathFormula display className="my-0 text-sm sm:text-base">
            {String.raw`\begin{aligned}
\underbrace{J_h^{(k)}}_{\text{k-step hidden 영향}}
&:=\frac{\partial h_t}{\partial h_{t-k}}\\
&=\overleftarrow{\prod}_{j=t-k+1}^{t}
\underbrace{\left[\operatorname{diag}(\phi'(z_j))W_h\right]}_{\text{시간순 Jacobian 곱}}\\[0.45em]
\underbrace{J_C^{(k)}}_{\text{k-step cell 영향}}
&:=\frac{\partial C_t}{\partial C_{t-k}}\\
&\approx\prod_{j=t-k+1}^{t}\underbrace{f_j}_{\text{forget gate 보존율}}
\end{aligned}`}
          </MathFormula>
        </div>
        <FormulaNote
          meaning="Column-vector convention에서 Vanilla RNN Jacobian은 최신 step의 행렬이 왼쪽에 오도록 시간 순서를 지켜 k번 곱한다. 행렬곱은 순서를 바꿀 수 없으므로 왼쪽 화살표가 그 순서를 표시한다. LSTM cell의 직접 경로를 따로 보면 성분별 forget gate가 곱해진다. f가 1에 가까우면 과거 책임이 오래 남지만, f가 작으면 LSTM에서도 기억은 사라진다."
          symbols={[
            [String.raw`k`, '현재에서 과거 state까지 떨어진 시간 step 수'],
            [String.raw`J_h^{(k)}`, 'k-step 전 hidden state가 현재 hidden state에 주는 Jacobian'],
            [String.raw`J_C^{(k)}`, 'k-step 전 cell state에서 현재 cell state로 이어지는 직접 Jacobian'],
            [String.raw`\phi'(z_j)`, 'j번째 recurrent activation의 국소 기울기'],
            [String.raw`W_h`, '이전 hidden state를 다음 state로 보내는 recurrent weight'],
            [String.raw`\overleftarrow{\prod}`, '최신 Jacobian이 왼쪽에 오도록 시간 순서를 보존하는 행렬곱'],
            [String.raw`f_j`, 'j번째 step에서 과거 cell 성분을 남기는 0~1 gate'],
            ['근삿값', 'gate 자체가 cell state에 의존하는 우회 gradient를 잠시 떼고 직접 memory path만 본 결과'],
          ]}
        />
      </div>

      <MemoryGradientLab />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>1997년 구조와 오늘 쓰는 3-gate LSTM을 구분한다</h3>
        <p>Hochreiter와 Schmidhuber의 1997년 LSTM은 constant error carousel, input gate와 output gate로 장기 dependency를 다뤘다. 오늘 흔히 그리는 <strong>forget·input·output의 3-gate 구조가 1997년에 한 번에 나온 것은 아니다.</strong> Gers, Schmidhuber와 Cummins가 continual prediction에서 오래된 기억을 지우기 위해 forget gate를 추가했고, 이후 이 변형이 표준 구현으로 자리 잡았다.</p>
        <p>따라서 “cell state는 정보를 거의 손실 없이 전달한다”는 비유도 조건부로 읽어야 한다. 실제 보존량은 학습된 <MathFormula>{String.raw`f_t`}</MathFormula>와 입력·출력 gate, truncation length, optimizer와 데이터에 달려 있다.</p>
        <p>Fused gate tensor, retention half-life와 LSTM·GRU shape를 더 깊게 계산하는 일은 <InternalLink slug="lstm">LSTM 구조 글</InternalLink>이 소유한다. 여기서부터 이 글의 질문은 gate 자체보다 <strong>그 state를 어느 timeline과 sample이 소유하는가</strong>로 이동한다. 독립 sliding window라면 hidden·cell state도 sample마다 초기화한다. 하나의 연속 stream을 chunk로 자른 경우에만 state 값을 이어 받고 graph를 detach하며, entity·episode·gap 경계에서는 reset한다.</p>
      </div>
      <Misconception>LSTM은 기울기 소실을 없애는 마법이 아니다. 직접 cell 경로를 추가해 학습 가능한 보존 선택지를 만들었을 뿐이며, forget gate가 계속 작거나 sequence가 너무 길면 여전히 먼 정보를 잃는다.</Misconception>
      <SourceNotes sources={[
        { label: 'Bengio et al. · Learning Long-Term Dependencies with Gradient Descent is Difficult (1994)', href: 'https://doi.org/10.1109/72.279181', note: 'Recurrent dynamics의 장기 dependency와 gradient 문제를 분석한 기반 논문.' },
        { label: 'Hochreiter & Schmidhuber · Long Short-Term Memory (1997)', href: 'https://doi.org/10.1162/neco.1997.9.8.1735', note: 'Input/output gate와 constant error path를 제안한 LSTM 원 논문.' },
        { label: 'Gers et al. · Learning to Forget (2000)', href: 'https://doi.org/10.1162/089976600300015015', note: 'Continual prediction을 위해 forget gate를 추가한 1차 출처.' },
      ]} />
    </section>
  );
}
