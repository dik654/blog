import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
} from '@/components/learning/ArticleLearning';
import TrainingCode from './TrainingCode';
import WindowSliding from './WindowSliding';
import { ForecastShapeStrip } from './viz/LSTMConceptExplorers';

export default function Training() {
  return (
    <section id="training" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">시계열을 LSTM 학습 문제로 바꾸는 순서</h2>
      <QuestionLead
        question="지난 24시간으로 다음 6시간을 예측할 때, 입력 한 묶음의 shape와 정답 시점은 무엇이어야 할까?"
        answer="입력은 [batch, 24, feature], 정답은 [batch, 6, target]이다. 각 sample의 마지막 입력 timestamp보다 정답 timestamp가 반드시 뒤에 있어야 한다. Scaler와 결측치 처리도 sample을 만들기 전 전체 기간이 아니라 각 rolling fold의 과거 구간에서만 fit한다."
      />
      <ConceptPrimer
        title="코드보다 먼저 고정할 데이터 계약"
        items={[
          {
            term: 'Look-back T',
            meaning: '한 예측에서 입력으로 읽을 과거 step 수다.',
            why: '너무 짧으면 필요한 주기를 놓치고, 너무 길면 state에 불필요한 과거를 압축한다.',
          },
          {
            term: 'Horizon H',
            meaning: 'Forecast origin 다음부터 한 번에 내야 할 미래 step 수다.',
            why: '다음 1개를 반복 호출하는 모델과 다음 H개를 직접 내는 모델의 오차 전파가 다르다.',
          },
          {
            term: 'Feature F',
            meaning: '각 step에서 관측되는 target history, covariate와 mask의 수다.',
            why: '미래에 알려지지 않은 feature를 실수로 넣으면 모델 성능이 아니라 누출을 측정한다.',
          },
          {
            term: 'Fold-local transform',
            meaning: 'Scaler·imputer를 현재 fold의 train history에서만 fit하는 절차다.',
            why: '전체 기간의 평균과 결측 패턴에는 아직 오지 않은 미래가 들어 있기 때문이다.',
          },
        ]}
      />

      <ForecastShapeStrip />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>1. 먼저 forecast origin을 세우고 causal window를 자른다</h3>
        <p>
          Sliding window는 단순한 배열 자르기가 아니다. 각 sample은 <strong>이 시점까지 알 수 있던
          정보로 그 뒤를 맞히는 작은 과거 재현</strong>이어야 한다. 원본 timeline을 시간순으로 train과
          validation으로 나눈 뒤, fold 안에서 변환을 fit하고 그 다음 window를 만든다. 전체 window를 먼저
          만든 뒤 random split하면 거의 같은 history가 양쪽에 겹치고 미래 통계도 섞인다.
        </p>
      </div>
      <WindowSliding />
      <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4">
        <MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\begin{aligned}
&\underbrace{X_o=[z_{o-T+1},\ldots,z_o]}_{\text{origin까지 관측하는 look-back}}\\
&\underbrace{Y_o=[y_{o+1},\ldots,y_{o+H}]}_{\text{origin 뒤에서 채점하는 horizon}}
\end{aligned}`}</MathFormula>
      </div>
      <FormulaNote
        meaning="Forecast origin o가 정보 경계를 소유한다. Input의 모든 timestamp는 o 이하여야 하고 target은 o보다 뒤여야 한다. z에는 target history, observed covariate와 그 시점에 실제로 알 수 있던 feature만 들어간다. Calendar나 확정된 일정처럼 known-future인 covariate는 별도 availability contract로 horizon에 제공할 수 있다."
        symbols={[
          [String.raw`T`, '한 sample이 읽는 look-back 길이'],
          [String.raw`H`, '한 origin에서 평가하는 forecast horizon'],
          [String.raw`z_t`, 't 시점에 이용 가능한 feature vector'],
          [String.raw`o`, '과거와 미래를 가르는 forecast origin'],
        ]}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>2. Hidden state의 소유자를 window와 stream 중 하나로 고정한다</h3>
        <p>
          Overlapping window를 독립 sample로 만들어 shuffle한다면 각 sample의 hidden·cell state는 zero-init이
          기본이다. 이전 batch state를 다음 batch로 넘기면 다른 entity나 더 미래에서 시작한 window의 정보가
          섞이고 batch 순서에 따라 prediction이 달라진다. Stateful 처리는 하나의 연속 stream을 시간순 chunk로
          자른 경우에만 사용한다. 그때도 state 값은 넘기되 이전 chunk graph는 detach하고, entity·episode·긴
          gap 경계에서 reset한다.
        </p>
      </div>
      <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4">
        <MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\begin{aligned}
&\underbrace{(h_0,c_0)=(0,0)}_{\text{독립 window는 state를 새로 시작}}\\
&\underbrace{(h_s,c_s)=\operatorname{stopgrad}(h_e,c_e)}_{\text{연속 chunk는 state 값만 전달}}
\end{aligned}`}</MathFormula>
      </div>
      <FormulaNote
        meaning="독립 window의 state는 그 sample 안의 history만 요약해야 한다. 연속 chunk에서는 이전 chunk 끝 state를 다음 시작값으로 이어 시간 문맥을 보존하지만 stop-gradient로 이전 computation graph의 소유권을 끊는다. Reset과 detach는 같은 연산이 아니다."
        symbols={[
          [String.raw`h_0,c_0`, '독립 sample 시작의 hidden·cell state'],
          [String.raw`h_e,c_e`, '같은 stream에서 이전 chunk가 끝날 때의 state'],
          [String.raw`h_s,c_s`, '다음 chunk가 시작할 때 받을 state value'],
          [String.raw`\operatorname{stopgrad}`, '값은 유지하고 이전 graph로의 gradient만 차단'],
        ]}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>3. 출력 head와 학습 입력은 업무 horizon에 맞춘다</h3>
        <p>
          다음 값 하나만 필요하면 마지막 hidden state를 scalar head에 연결할 수 있다. 6시간 전체가
          필요하면 마지막 state에서 6개를 직접 출력하거나, step별 decoder를 둔다. 앞선 예측을 다시
          입력하는 recursive 방식은 horizon이 길수록 자기 오차를 다음 입력으로 받는다. Direct
          multi-horizon head는 이 전파를 피하지만 horizon별 관계를 학습할 출력 차원이 더 필요하다.
        </p>
      </div>
      <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4">
        <MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\begin{aligned}
&\underbrace{u_h^{\mathrm{train}}=y_{o+h-1}}_{\text{학습은 직전 정답을 입력}}\\
&\underbrace{u_h^{\mathrm{serve}}=\hat y_{o+h-1}}_{\text{추론은 직전 예측을 입력}}\\
&\underbrace{e_h\approx\varepsilon_h+\frac{\partial F_h}{\partial u_h}e_{h-1}}_{\text{이전 오차가 다음 예측으로 전파}}
\end{aligned}`}</MathFormula>
      </div>
      <FormulaNote
        meaning="Stepwise decoder를 정답 history로 학습하면 각 horizon은 깨끗한 이전 target을 본다. Serving에서는 그 자리에 model prediction이 들어가므로 작은 초기 오차가 recurrent input을 바꾸고 뒤 horizon으로 전파된다. Direct H-output head에는 이 자기입력 경로가 없지만 horizon별 joint error와 calibration은 여전히 검증해야 한다."
        symbols={[
          [String.raw`u_h^{\mathrm{train}},u_h^{\mathrm{serve}}`, 'Decoder의 h번째 step에 들어가는 이전 target 또는 prediction'],
          [String.raw`e_h=\hat y_{o+h}-y_{o+h}`, 'Horizon h의 forecast error'],
          [String.raw`\varepsilon_h`, '이전 rollout error가 없다고 가정한 local model error'],
          [String.raw`\partial F_h/\partial u_h`, '1차원 출력에서는 도함수, 벡터 출력에서는 error vector에 곱하는 Jacobian인 국소 민감도'],
        ]}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>4. Bi-LSTM의 미래 문맥과 실제 예측을 혼동하지 않는다</h3>
        <p>
          양방향 LSTM은 이미 완성된 sequence의 양쪽 문맥을 읽는 tagging·분류에는 유용하다. 그러나
          08:00에 09:00을 예측하는 live forecasting에서 역방향 branch가 09:00 이후의 관측을 읽으면
          누출이다. 입력 history <em>안에서만</em> 양방향으로 읽더라도 온라인 state를 한 step씩
          재사용하는 장점은 사라진다. 따라서 causality와 serving 방식까지 포함해 후보를 정한다.
        </p>
      </div>

      <TrainingCode />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>5. 학습 loss보다 rolling-origin 결과로 채택한다</h3>
        <p>
          Train loss가 낮아도 seasonal-naive보다 나쁠 수 있다. 같은 origin, horizon과 정보 가용성 아래
          LSTM을 ARIMA·naive와 비교하고, seed와 origin별 오차를 남긴다. Gradient clipping은 exploding
          gradient가 관측될 때 시험할 안정화 수단이지 모든 데이터에서 성능을 보장하는 필수 주문이
          아니다. 자세한 fold와 metric 계약은{' '}
          <InternalLink slug="time-series-forecasting-evaluation" learningPathId="ai-timeseries-forecasting">
            시계열 예측 검증
          </InternalLink>
          에서 이어진다.
        </p>
      </div>
      <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4">
        <MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\begin{aligned}
&\underbrace{\mathcal D_r^{\mathrm{fit}}=\{z_t,y_t:t\le o_r\}}_{\text{origin 과거에만 fit}}\\
&\underbrace{\operatorname{score}(\hat y_{o_r+1:o_r+H},y_{o_r+1:o_r+H})}_{\text{고정 horizon을 미래에서 평가}}
\end{aligned}`}</MathFormula>
      </div>
      <FormulaNote
        meaning="Rolling-origin validation은 origin을 앞으로 옮길 때마다 그 시점까지의 history로 scaler·imputer와 model을 fit하거나 update하고, origin 뒤 동일 horizon을 평가한다. Window를 먼저 전부 만든 뒤 random split하거나 전체 timeline에 scaler를 fit하면 미래 target 또는 미래 분포가 training pipeline에 섞인다."
        symbols={[
          [String.raw`o_r`, 'r번째 backtest fold의 forecast origin'],
          [String.raw`\mathcal D_r^{\mathrm{fit}}`, '해당 origin까지 허용된 training information'],
          [String.raw`\hat y_{o_r+1:o_r+H}`, 'r번째 origin에서 고정한 H-step prediction'],
          [String.raw`\operatorname{score}`, 'Origin·horizon별로 동일 정의를 쓰는 error metric'],
        ]}
      />
      <Misconception>
        Look-back 168을 넣었다고 LSTM이 168 step 전 정보를 보존하는 것은 아니다. 입력 범위와 실제로
        학습된 기억 길이는 다르다. Window 길이는 계절 주기·지연·운영 horizon을 근거로 후보화하고
        rolling backtest에서 선택한다.
      </Misconception>
    </section>
  );
}
