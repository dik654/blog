export default function TensorCore() {
  return (
    <section id="tensor-core" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">2. Tensor Core 세대별 — AI 의 폭발 동력</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Tensor Core 는 NVIDIA 가 V100 (2017) 부터 도입한 행렬 곱 전용 가속기.
          <br />
          한 사이클에 4×4 행렬 곱 + 누적 (MMA, Matrix Multiply-Accumulate). 같은 die 면적의 일반 CUDA core 대비 ~10x throughput.
          <br />
          AI 학습 / 추론의 거의 모든 throughput 이 Tensor Core 에서 나온다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-1. 세대별 발전</h3>
        <ul className="leading-7">
          <li>
            <strong>1 gen — Volta (V100, 2017)</strong>
            <br />
            FP16 입력 + FP32 누적. 한 사이클 4×4×4 = 64 FMA (= 128 FLOPs). V100 SM 당 8 Tensor Core × 80 SM = 125 TFLOPS FP16.
            <br />
            의미 — 같은 FP32 의 8x throughput. AI 가 GPU 의 주요 워크로드가 된 시발점.
          </li>
          <li>
            <strong>2 gen — Turing (T4, RTX 20, 2018)</strong>
            <br />
            INT8 / INT4 추가. 추론 특화. 같은 칩에서 INT8 = FP16 의 2x throughput.
            <br />
            의미 — 첫 추론 가속 (이전엔 학습용 FP16 만).
          </li>
          <li>
            <strong>3 gen — Ampere (A100, RTX 30, 2020)</strong>
            <br />
            <strong>TF32</strong> · <strong>BF16</strong> · <strong>Sparsity</strong> 추가. 한 사이클 행렬 곱 크기 8×4×8 (확장).
            <br />
            TF32 = NVIDIA 만의 19 bit 형식. FP32 와 호환되며 Tensor Core 에서 8x 빠름. 학습 코드 수정 없이 자동 가속.
            <br />
            BF16 = brain float (Google). exponent 8 bit (FP32 와 같은 range), mantissa 7 bit. 학습에 FP16 보다 안정적 (overflow 적음).
            <br />
            Sparsity = 행렬의 50% 가 0 이면 연산 절반 생략 (2:4 패턴 강제). 이론 2x.
          </li>
          <li>
            <strong>4 gen — Hopper / Ada (H100 / RTX 40, 2022)</strong>
            <br />
            <strong>FP8</strong> + <strong>Transformer Engine</strong> 도입. FP8 = 8 bit float. FP16 의 2x throughput + 2x 메모리 효율.
            <br />
            Transformer Engine = FP8 자동 변환 + scale 동적 조정. 사용자 코드 변경 거의 없이 LLM 학습 / 추론에 FP8 활용.
            <br />
            DPX Instruction = 동적 프로그래밍 가속 (genome alignment 등).
          </li>
          <li>
            <strong>5 gen — Blackwell (B200 / RTX 50, 2024)</strong>
            <br />
            <strong>FP4</strong> 도입. 또 절반 메모리 + 또 2x throughput.
            <br />
            Quantization 진보로 inference throughput 만 H100 대비 4x. 학습은 여전히 FP8 / BF16.
            <br />
            2 gen Transformer Engine = FP4 자동 처리.
          </li>
          <li>
            <strong>6 gen — Rubin (예정, 2026)</strong>
            <br />
            세부 미공개. HBM4 + 더 큰 fabric.
          </li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-2. 정밀도 종류별 정리</h3>
        <div className="overflow-x-auto not-prose my-4">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">형식</th>
                <th className="border border-border px-3 py-2 text-left">bits</th>
                <th className="border border-border px-3 py-2 text-left">range</th>
                <th className="border border-border px-3 py-2 text-left">정밀도</th>
                <th className="border border-border px-3 py-2 text-left">용도</th>
                <th className="border border-border px-3 py-2 text-left">최초 지원</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-border px-3 py-2 font-medium">FP64</td><td className="border border-border px-3 py-2">64</td><td className="border border-border px-3 py-2">±1.7e308</td><td className="border border-border px-3 py-2">15 자리</td><td className="border border-border px-3 py-2">HPC · 과학 시뮬</td><td className="border border-border px-3 py-2">초기</td></tr>
              <tr><td className="border border-border px-3 py-2 font-medium">FP32</td><td className="border border-border px-3 py-2">32</td><td className="border border-border px-3 py-2">±3.4e38</td><td className="border border-border px-3 py-2">7 자리</td><td className="border border-border px-3 py-2">표준 / 옛 학습</td><td className="border border-border px-3 py-2">초기</td></tr>
              <tr><td className="border border-border px-3 py-2 font-medium">TF32</td><td className="border border-border px-3 py-2">19</td><td className="border border-border px-3 py-2">±3.4e38 (FP32 동일)</td><td className="border border-border px-3 py-2">3 자리</td><td className="border border-border px-3 py-2">학습 (TC 가속)</td><td className="border border-border px-3 py-2">Ampere</td></tr>
              <tr><td className="border border-border px-3 py-2 font-medium">BF16</td><td className="border border-border px-3 py-2">16</td><td className="border border-border px-3 py-2">±3.4e38</td><td className="border border-border px-3 py-2">2 자리</td><td className="border border-border px-3 py-2">학습 표준</td><td className="border border-border px-3 py-2">Ampere</td></tr>
              <tr><td className="border border-border px-3 py-2 font-medium">FP16</td><td className="border border-border px-3 py-2">16</td><td className="border border-border px-3 py-2">±65504</td><td className="border border-border px-3 py-2">3 자리</td><td className="border border-border px-3 py-2">학습 + 추론</td><td className="border border-border px-3 py-2">Volta</td></tr>
              <tr><td className="border border-border px-3 py-2 font-medium">FP8 (E5M2 / E4M3)</td><td className="border border-border px-3 py-2">8</td><td className="border border-border px-3 py-2">±57344 / ±448</td><td className="border border-border px-3 py-2">1 자리</td><td className="border border-border px-3 py-2">학습 + 추론 (LLM)</td><td className="border border-border px-3 py-2">Hopper</td></tr>
              <tr><td className="border border-border px-3 py-2 font-medium">FP4</td><td className="border border-border px-3 py-2">4</td><td className="border border-border px-3 py-2">±6</td><td className="border border-border px-3 py-2">매우 제한</td><td className="border border-border px-3 py-2">추론 (작은 모델)</td><td className="border border-border px-3 py-2">Blackwell</td></tr>
              <tr><td className="border border-border px-3 py-2 font-medium">INT8 / INT4</td><td className="border border-border px-3 py-2">8 / 4</td><td className="border border-border px-3 py-2">정수</td><td className="border border-border px-3 py-2">N/A</td><td className="border border-border px-3 py-2">추론 (quantized)</td><td className="border border-border px-3 py-2">Turing</td></tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-3. Tensor Core 의 사용 조건</h3>
        <ul className="leading-7">
          <li><strong>shape 정렬</strong> — M / N / K 가 16 의 배수일 때 최대 효율. CUTLASS / cuBLAS 가 자동 처리하지만 사용자 코드는 신중.</li>
          <li><strong>혼합 정밀도</strong> — FP16 입력 + FP32 누적이 표준. autocast (PyTorch) 가 자동.</li>
          <li><strong>누적 overflow</strong> — FP16 으로 큰 값 누적 시 inf. BF16 또는 FP32 accumulator 필수.</li>
          <li><strong>측정</strong> — Nsight Compute 의 &quot;Tensor Core utilization&quot; 메트릭. 50% 미만이면 tuning 필요.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-4. AMD / Intel 의 대응</h3>
        <ul className="leading-7">
          <li><strong>AMD CDNA3 (MI300X)</strong> — Matrix Core. NVIDIA Tensor Core 와 비슷. FP16 / BF16 / FP8 지원.</li>
          <li><strong>AMD CDNA4 (MI325X / MI355X)</strong> — FP4 추가. NVIDIA B200 따라잡기.</li>
          <li><strong>Intel Xe Matrix Extension (XMX)</strong> — Gaudi · Ponte Vecchio. 비슷한 컨셉.</li>
          <li><strong>Google TPU</strong> — Tensor Core 의 사상 (matrix multiply unit) 의 원조. 더 큰 systolic array.</li>
        </ul>
      </div>
    </section>
  );
}
