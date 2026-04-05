import OverviewViz from './viz/OverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 시퀀스 모델이 필요한가</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        FC는 입력 크기 고정, CNN은 순서 미보존 — 자연어의 가변 길이·순서 의존성 처리 불가.<br />
        RNN은 은닉 상태의 순환으로 이 문제를 해결한다.
      </p>
      <OverviewViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">시퀀스 모델의 필요성</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Non-sequential models 한계:

// FC (Fully Connected):
// - 입력 크기 고정
// - 순서 무관
// - 예: 10-word sentence → 20-word: 구조 변경

// CNN:
// - 지역 패턴 감지
// - translation invariant
// - 순서 일부 보존
// - 장거리 의존성 약함

// RNN의 해결책:
// - 은닉 상태 h_t가 시간축으로 순환
// - h_t = f(h_(t-1), x_t)
// - 가변 길이 입력 가능
// - 순서 중요

// Sequence tasks:
// - 언어 모델 (next word prediction)
// - 기계 번역
// - 음성 인식
// - 시계열 예측
// - 감정 분석
// - 토큰 태깅

// Many-to-X 패턴:
// Many-to-One:
// - sentiment analysis
// - 전체 문장 → 감정

// Many-to-Many (same length):
// - POS tagging
// - 각 단어 → 품사

// Many-to-Many (diff length):
// - machine translation
// - EN sentence → KO sentence

// One-to-Many:
// - image captioning
// - image → sentence

// RNN formulations:

// Elman network (standard):
// h_t = tanh(W_h · h_(t-1) + W_x · x_t + b)
// y_t = softmax(W_y · h_t + b_y)

// Jordan network:
// h_t = tanh(W_h · y_(t-1) + W_x · x_t + b)
// - uses output feedback (not hidden)

// Weight sharing:
// - same W across time steps
// - parameter efficient
// - inductive bias

// 비교 (2024):
// RNN: old, foundational
// LSTM/GRU: classical
// Transformer: dominant
// Mamba/SSM: emerging`}
        </pre>
        <p className="leading-7">
          RNN: <strong>h_t = f(h_(t-1), x_t), 가변 길이 시퀀스</strong>.<br />
          many-to-X patterns: sentiment, translation, tagging, captioning.<br />
          Elman vs Jordan, weight sharing으로 parameter efficient.
        </p>
      </div>
    </section>
  );
}
