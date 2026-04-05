import BackpropViz from './viz/BackpropViz';

export default function Training() {
  return (
    <section id="training" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">학습: 역전파</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        손실 → Softmax → 디코더 LSTM → 인코더 LSTM — 하나의 역전파로 전체 학습.<br />
        Teacher Forcing: 학습 시 정답 단어를 다음 입력으로 사용하여 속도 향상.
      </p>
      <BackpropViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Teacher Forcing 원리</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Teacher Forcing vs Free Running
//
// [학습 시] Teacher Forcing
//   decoder input = 정답 시퀀스 (shifted)
//   입력:  <SOS>, y_1, y_2, y_3, ...  (ground truth)
//   타겟:  y_1, y_2, y_3, y_4, ...
//
//   장점:
//   - 모든 타임스텝 병렬 학습
//   - 오류 누적 없음
//   - 빠른 수렴
//
//   단점:
//   - 추론 시 동작과 다름
//   - Exposure bias 발생
//
// [추론 시] Free Running
//   decoder input = 이전 예측
//   입력:  <SOS>, ŷ_1, ŷ_2, ŷ_3, ...  (model's prediction)
//
//   오류가 다음 스텝으로 전파됨

// 손실 계산:
//   L = -Σ_{t=1}^{T'} log P(y_t | y_{<t}^{true}, X)
//                                ↑
//                      teacher forcing 적용
//
//   P(y_t | ...) = softmax(W · s_t)[y_t]
//
// 역전파 경로 (BPTT):
//   L → softmax → decoder LSTM 전체 → encoder LSTM 전체
//
//   모든 파라미터 동시 업데이트
//   (W_enc, W_dec, W_embed, W_out, ...)

// Scheduled Sampling (Bengio 2015):
//   - 학습 중 일부 확률로 모델 예측 사용
//   - ε-probability로 ground truth, (1-ε)로 모델 출력
//   - ε를 학습 진행과 함께 감소
//   - exposure bias 완화`}
        </pre>
        <p className="leading-7">
          요약 1: <strong>Teacher Forcing</strong>이 학습 속도와 안정성의 핵심.<br />
          요약 2: 모든 타임스텝 병렬 학습으로 <strong>GPU 효율</strong> 확보.<br />
          요약 3: 추론 시 <strong>exposure bias</strong>는 scheduled sampling으로 완화 가능.
        </p>
      </div>
    </section>
  );
}
