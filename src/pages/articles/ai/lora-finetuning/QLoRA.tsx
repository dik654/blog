import QLoraDetailViz from './viz/QLoraDetailViz';

export default function QLoRA() {
  return (
    <section id="qlora" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">QLoRA: 4비트 양자화 + LoRA</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          <strong>QLoRA(Quantized LoRA)</strong> — Dettmers et al.(2023)이 제안한 기법으로,
          사전학습 모델을 4비트로 양자화한 뒤 그 위에 LoRA 어댑터를 학습한다.
          LoRA만으로도 메모리가 크게 줄지만, base 모델 자체가 FP16(16비트)이므로 여전히 대형 모델에는 부담.
          QLoRA는 base 모델을 4비트로 압축하여 메모리를 추가로 75% 절감한다.
        </p>
        <p>
          <strong>NF4(Normal Float 4-bit)</strong> — QLoRA의 핵심 혁신.
          신경망 가중치는 정규분포(Normal distribution)를 따르므로, 양자화 구간을 정규분포 분위수에 맞추면
          균등 분할(FP4)보다 정보 손실이 적다.
          같은 4비트에서 NF4가 FP4보다 이론적 정보 보존량이 높음이 증명되었다.
        </p>
        <p>
          <strong>Double Quantization(DQ)</strong> — 블록별 양자화에서 발생하는 양자화 상수(scale factor)도
          2차 양자화하여 추가 메모리를 절감한다.
          64개 가중치당 1개 FP32 scale → 이를 FP8로 2차 양자화하면 파라미터당 0.37비트 절감.
          전체적으로 약 3% 추가 메모리 절약 효과.
        </p>
        <p>
          <strong>Paged Optimizers</strong> — 긴 시퀀스에서 활성화 메모리가 급증할 때
          NVIDIA unified memory를 활용하여 옵티마이저 상태를 CPU↔GPU 간 자동 페이징한다.
          GPU OOM(Out-Of-Memory) 없이 학습을 지속할 수 있게 하는 안전장치.
        </p>
      </div>

      <div className="not-prose"><QLoraDetailViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">QLoRA의 성능과 한계</h3>
        <p>
          논문 실험 결과: QLoRA(4-bit)로 학습한 모델이 16-bit full fine-tuning 대비
          97~99% 성능을 유지한다.
          Guanaco 65B(QLoRA)는 ChatGPT의 99.3% 수준 성능을 단일 GPU에서 달성했다.
        </p>
        <p>
          한계: 4비트 역양자화(dequantization) 과정에서 연산이 추가되어
          학습 속도는 FP16 LoRA보다 약 20~30% 느리다.
          그러나 메모리 절감으로 더 큰 배치 사이즈를 사용할 수 있어 실질적 처리량은 비슷하거나 오히려 높을 수 있다.
        </p>
        <p className="leading-7">
          핵심 1: <strong>NF4</strong>는 정규분포에 최적화된 4비트 타입 — 동일 비트에서 최소 정보 손실.<br />
          핵심 2: <strong>Double Quantization</strong>으로 양자화 오버헤드까지 압축.<br />
          핵심 3: <strong>단일 A100 80GB로 65B 모델 학습</strong> — QLoRA 이전에는 불가능했던 규모.
        </p>
      </div>
    </section>
  );
}
