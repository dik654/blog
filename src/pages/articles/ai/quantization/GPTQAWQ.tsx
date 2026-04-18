import GPTQvsAWQViz from './viz/GPTQvsAWQViz';

export default function GPTQAWQ() {
  return (
    <section id="gptq-awq" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">GPTQ vs AWQ vs GGUF: LLM 양자화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          <strong>핵심 문제</strong> — LLM은 수십~수백 레이어를 거치면서 양자화 오차가 누적됨.
          일반 PTQ로 INT4를 적용하면 perplexity가 급격히 증가.
          GPTQ와 AWQ는 이 문제를 <strong>레이어별 보정</strong>으로 해결 — 학습 없이(PTQ) 수 시간 내 완료
        </p>
        <p>
          <strong>GPTQ</strong>(Frantar et al., 2023): OBQ(Optimal Brain Quantization)의 LLM 확장판.
          각 가중치를 양자화할 때, 발생하는 오차를 Hessian 행렬(H = X^T X)을 이용해
          아직 양자화하지 않은 나머지 가중치에 분산 보상.
          128열을 블록 단위로 처리하여 GPU 병렬화 — 7B 모델 INT4 양자화에 약 4시간
        </p>
        <p>
          <strong>AWQ</strong>(Lin et al., 2024): 활성값(activation)을 관찰하여 중요한 채널(1%)을 찾고,
          해당 채널의 가중치에 scale factor를 곱해 양자화 해상도를 높임.
          Hessian 역행렬 없이 scale factor만 계산하므로 GPTQ보다 간단·빠름(7B INT4에 약 30분),
          비슷한 정확도를 달성
        </p>
        <p>
          <strong>GGUF</strong>(llama.cpp): CPU + 소량 GPU 혼합 추론을 위한 포맷.
          레이어별로 다른 비트를 할당하는 K-quant 혼합 양자화가 특징.
          Q4_K_M이 품질/크기 최적 균형으로 가장 널리 사용되며,
          Ollama, LM Studio 등 로컬 추론 도구의 사실상 표준
        </p>
      </div>

      <GPTQvsAWQViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">GPTQ의 작동 원리</h3>
        <p>
          Hessian H = X^T X에서 X는 calibration 데이터의 활성값.
          가중치 w[i]를 양자화할 때 오차 δ = (w − quant(w)) / H⁻¹[i,i]를 계산하고,
          나머지 가중치에 w_rest -= H⁻¹[i,:] × δ로 보상.
          이 과정이 "한 가중치의 양자화 오차를 전체 레이어의 출력 오차 최소화 관점에서 보상"하는 것.
          128열 블록 처리가 핵심 트릭 — 행렬 연산으로 변환하여 GPU 활용도를 높임
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">AWQ의 핵심 아이디어</h3>
        <p>
          관찰: 가중치의 1%에 해당하는 채널이 활성값 크기를 결정.
          이 채널의 가중치에 s(scale factor)를 곱하면 양자화 격자 간격이 s분의 1로 촘촘해짐.
          최적 s = activation_magnitude^α, α ≈ 0.5를 grid search로 결정.
          dequant 시 s로 나누어 원래 스케일을 복원하므로, 중요 채널만 높은 해상도로 보존
        </p>
        <p className="leading-7">
          요약 1: GPTQ = <strong>Hessian 기반 오차 보상</strong> — 정확하지만 느림<br />
          요약 2: AWQ = <strong>중요 채널 보호</strong> — 간단하고 빠름, 비슷한 정확도<br />
          요약 3: 실전 선택 — <strong>GPU 서빙 = AWQ</strong>(vLLM), <strong>CPU 로컬 = GGUF Q4_K_M</strong>(llama.cpp)
        </p>
      </div>
    </section>
  );
}
