import QATTrainViz from './viz/QATTrainViz';

export default function QAT() {
  return (
    <section id="qat" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">QAT: 양자화 인식 학습</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          <strong>Quantization-Aware Training</strong> — 학습 과정에서 양자화를 시뮬레이션하여
          모델이 양자화 오차에 적응하도록 만드는 기법.
          PTQ 대비 정확도 우수하지만, 추가 학습 비용이 수반
        </p>
        <p>
          핵심 구조: Forward에서 <strong>Fake Quantization 노드</strong>를 삽입하여
          FP32 가중치를 INT8로 양자화했다가 다시 FP32로 복원.
          이 과정에서 발생하는 양자화 오차가 손실 함수에 반영되고,
          역전파를 통해 모델이 이 오차를 줄이는 방향으로 학습
        </p>
        <p>
          역전파의 난제: round() 함수의 gradient가 0 (계단 함수)이므로 직접 역전파가 불가능.
          <strong>STE(Straight-Through Estimator)</strong>로 해결 — forward는 round() 적용,
          backward는 round()를 건너뛰고 gradient를 직접 전달.
          Bengio(2013)가 제안한 경험적 해법으로, 수학적으로는 정확하지 않지만 실전에서 잘 작동
        </p>
      </div>

      <QATTrainViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">QAT의 실전 위치</h3>
        <p>
          INT8에서 QAT는 PTQ 대비 0.3~0.7% 추가 정확도를 확보.
          INT4에서는 그 격차가 2~5%로 벌어짐 — 비트 수가 줄수록 QAT의 가치가 커짐.
          하지만 7B 모델 QAT는 GPU 8장 × 수시간이 필요하여 <strong>LLM에서는 비용 대비 효과가 낮음</strong>
        </p>
        <p>
          실무에서의 역할 분담: <strong>LLM = PTQ(GPTQ/AWQ)</strong>가 표준,
          <strong>소형 모델(MobileNet, EfficientNet) + 엣지 디바이스 = QAT</strong>가 표준.
          엣지에서는 INT4/INT2까지 내려가야 하므로 QAT의 정확도 이점이 결정적
        </p>
        <p className="leading-7">
          요약 1: QAT = <strong>학습 중 양자화 시뮬레이션</strong> → 모델이 오차에 적응<br />
          요약 2: STE는 round()의 gradient 문제를 <strong>"그냥 통과시키는"</strong> 경험적 해법<br />
          요약 3: LLM에서는 비용 과다 → <strong>GPTQ/AWQ가 대안</strong>, 소형 모델에서는 QAT가 최적
        </p>
      </div>
    </section>
  );
}
