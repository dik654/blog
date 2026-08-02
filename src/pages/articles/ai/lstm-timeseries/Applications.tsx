import {
  CapabilityCheck,
  InternalLink,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import { SequenceModelChoice } from './viz/LSTMConceptExplorers';

const decisions = [
  {
    index: '01',
    title: '업무 계약',
    body: 'Streaming인지 batch인지, horizon과 지연 예산, known-future covariate, 점·분위수 출력과 재학습 주기를 먼저 고정한다.',
  },
  {
    index: '02',
    title: '싼 기준선',
    body: 'Last-value, seasonal-naive와 ARIMA를 같은 rolling origin에 둔다. LSTM이 이기지 못하면 복잡도를 채택할 근거가 없다.',
  },
  {
    index: '03',
    title: 'LSTM 후보',
    body: '고정 크기 recurrent state, 한 step씩 도착하는 입력, nonlinear memory와 작은 local model이 실제 제약에 맞을 때 올린다.',
  },
  {
    index: '04',
    title: '다른 계열',
    body: '많은 series의 공통 패턴, 긴 context, 병렬 학습이나 zero-shot transfer가 핵심이면 Transformer·TSFM·SSM 후보를 같은 계약에서 비교한다.',
  },
] as const;

export default function Applications() {
  return (
    <section id="applications" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">LSTM은 언제 남기고 언제 다른 모델로 올라갈까</h2>
      <QuestionLead
        question="LSTM, PatchTST와 시계열 foundation model 중 무엇이 더 좋은가?"
        answer="모델 이름만으로는 답할 수 없다. 같은 forecast origin과 horizon에서 단순 기준선을 먼저 세우고, 정확도뿐 아니라 latency, memory, covariate interface와 재학습 비용을 함께 재야 한다. LSTM은 고정 state와 streaming이라는 제약이 가치가 있을 때 강한 후보이지, 데이터 행 수 하나로 자동 선택되는 모델이 아니다."
      />

      <div className="not-prose my-7 divide-y divide-border border-y border-border">
        {decisions.map((decision) => (
          <article
            key={decision.index}
            className="grid min-w-0 gap-2 py-5 sm:grid-cols-[2.5rem_9rem_minmax(0,1fr)] sm:gap-4"
          >
            <span className="font-mono text-xs font-bold text-muted-foreground">{decision.index}</span>
            <h3 className="text-sm font-bold">{decision.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{decision.body}</p>
          </article>
        ))}
      </div>

      <SequenceModelChoice />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>“단순 모델이 Transformer를 이겼다”는 문장을 정확히 읽는다</h3>
        <p>
          DLinear는 선형 projection과 decomposition으로 강한 장기 예측 기준선을 제시하며 복잡한
          Transformer가 항상 우월하지 않음을 보였다. PatchTST는 시계열을 patch token으로 바꾸고
          channel-independent attention을 사용하는 <strong>Transformer 계열</strong>이다. 두 모델을
          모두 “단순 모델”로 묶으면 무엇이 개선됐는지 사라진다. 논문 결과는 사용한 dataset, horizon,
          normalization과 protocol 안의 결과이므로 내 운영 계약에서 다시 비교해야 한다.
        </p>
        <h3>세 가지 실전 위치</h3>
        <p>
          <strong>장비 telemetry</strong>에서는 한 sample씩 도착하고 memory가 제한된 edge에서 state를
          갱신하는 LSTM이 후보가 된다. <strong>수요 예측</strong>에서는 많은 매장 간 transfer와
          known-future promotion interface가 더 중요해 global model이나 TSFM이 후보가 된다.{' '}
          <strong>불규칙 사건 탐지</strong>에서는 예측 모델보다 alert threshold, event merge와
          false-alarm budget이 먼저다. 그 경우에는{' '}
          <InternalLink slug="time-series-anomaly-detection" learningPathId="ai-timeseries-anomaly">
            시계열 이상 탐지 경로
          </InternalLink>
          로 이동한다.
        </p>
        <p>
          Mamba 같은 state-space 계열은 “LSTM의 최신 버전”이 아니라 긴 sequence 계산을 다른 방식으로
          조직하는 독립 후보군이다. 구조적 연결은{' '}
          <InternalLink slug="llm-architecture-hybrid-linear">
            Hybrid·Linear Attention·SSM
          </InternalLink>
          에서 읽되, 시계열 forecasting 성능은 별도 benchmark로 검증한다.
        </p>
      </div>

      <StopRule>
        Seasonal-naive와 ARIMA를 여러 rolling origin에서 이기고, latency·memory·운영 복잡도까지 허용
        범위에 들어오면 여기서 멈춘다. 더 최신 모델을 추가하는 일 자체는 목표가 아니다.
      </StopRule>
      <CapabilityCheck items={[
        '전이 문제: 독립 sliding window를 shuffle한 batch와 한 sensor stream의 연속 chunk에서 hidden·cell state를 각각 reset, carry, detach 중 어떻게 관리할지 판정할 수 있다.',
        '전이 문제: Vanilla RNN의 ordered Jacobian product와 LSTM direct cell path의 forget-gate product를 같은 dependency span에서 비교할 수 있다.',
        '전이 문제: Window를 만든 뒤 random split, 전체 기간 scaler fit, centered rolling feature와 미확정 future covariate 중 어디서 미래 정보가 유입되는지 찾을 수 있다.',
        '전이 문제: Teacher-forced one-step loss는 낮지만 recursive H-step 오차가 커지는 사례에서 직전 정답과 직전 예측 input의 차이를 추적할 수 있다.',
        '전이 문제: Direct H-output과 recursive one-step model을 같은 rolling origins·horizons에서 비교하고 seasonal-naive 대비 채택 여부를 판정할 수 있다.',
      ]} />
      <SourceNotes
        sources={[
          {
            label: 'Salinas et al. · DeepAR (2020)',
            href: 'https://doi.org/10.1016/j.ijforecast.2019.07.001',
            note: '많은 관련 시계열을 recurrent autoregressive model로 함께 학습하는 global forecasting의 대표 근거.',
          },
          {
            label: 'Zeng et al. · Are Transformers Effective for Time Series Forecasting? (2023)',
            href: 'https://arxiv.org/abs/2205.13504',
            note: 'DLinear 기준선과 당시 Transformer 계열의 장기 forecasting 비교.',
          },
          {
            label: 'Nie et al. · A Time Series is Worth 64 Words: PatchTST (2023)',
            href: 'https://arxiv.org/abs/2211.14730',
            note: 'Patch token과 channel-independent Transformer 설계를 제안한 1차 논문.',
          },
        ]}
      />
    </section>
  );
}
