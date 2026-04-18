import BackpropViz from './viz/BackpropViz';
import S2STrainingViz from './viz/S2STrainingViz';
import M from '@/components/ui/math';

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
        <S2STrainingViz />
        <M display>{'\\mathcal{L} = -\\sum_{t=1}^{T\'} \\log \\underbrace{P(y_t \\mid y_{<t}^{\\text{true}},\\, X)}_{\\text{teacher forcing 적용 cross-entropy}}'}</M>
        <p className="leading-7">
          Teacher Forcing: decoder 입력 = <M>{'y^*_{t-1}'}</M> (정답) — 병렬 학습 가능, 빠른 수렴<br />
          Free Running: decoder 입력 = <M>{'\\hat{y}_{t-1}'}</M> (예측) — 오류 누적 위험
        </p>
        <M display>{'\\text{Scheduled Sampling}: \\quad P(\\text{use\\_target}) = \\varepsilon, \\quad \\varepsilon: 1 \\to 0 \\text{ (점진 감소)}'}</M>
        <p className="leading-7">
          요약 1: <strong>Teacher Forcing</strong>이 학습 속도와 안정성의 핵심.<br />
          요약 2: 모든 타임스텝 병렬 학습으로 <strong>GPU 효율</strong> 확보.<br />
          요약 3: 추론 시 <strong>exposure bias</strong>는 scheduled sampling으로 완화 가능.
        </p>
      </div>
    </section>
  );
}
