import OverviewViz from './viz/OverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">RNN의 한계와 LSTM</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        바닐라 RNN — 긴 시퀀스에서 기울기 소실(vanishing gradient) 발생.<br />
        LSTM(1997)은 게이트 메커니즘으로 이 문제를 해결한다.
      </p>
      <OverviewViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">LSTM 등장 배경</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Vanilla RNN 문제:
//
// Vanishing Gradient:
// - gradient × W (weight)
// - |W| < 1 → 기하급수 감소
// - long-term dependency 학습 불가
//
// Exploding Gradient:
// - |W| > 1 → 기하급수 증가
// - gradient clipping으로 완화

// LSTM (Hochreiter & Schmidhuber, 1997):
// - cell state 개념 도입
// - gating mechanism
// - additive update (not multiplicative)
// - gradient "highway"

// 핵심 아이디어:
// "정보를 선택적으로 기억/망각"
// - forget gate: 버릴 정보
// - input gate: 추가할 정보
// - output gate: 출력할 정보

// RNN vs LSTM vs GRU:
// RNN: simplest, worst long-term
// LSTM: 3 gates, cell state
// GRU: 2 gates, simpler LSTM

// Applications:
// - 시계열 예측
// - 언어 모델 (pre-Transformer)
// - 음성 인식
// - 기계 번역
// - video analysis

// 현재 (2024):
// - Transformer에 대부분 대체
// - time series에서 유지
// - 저자원 환경에서 efficient
// - embedded/mobile 사용`}
        </pre>
        <p className="leading-7">
          LSTM (1997): <strong>vanishing gradient 해결, 3 gates + cell state</strong>.<br />
          additive update → gradient "highway" → long-term dependency.<br />
          Transformer에 대체되었으나 time series에서 유지.
        </p>
      </div>
    </section>
  );
}
