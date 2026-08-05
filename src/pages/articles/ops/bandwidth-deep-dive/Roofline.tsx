import RooflineViz from './viz/RooflineViz';

export default function Roofline() {
  return (
    <section id="roofline" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">1. Roofline Model — 워크로드 진단의 표준</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Roofline 은 GPU / CPU 의 성능 한계를 두 ceiling 으로 그린 모델 — <strong>compute peak</strong> 와 <strong>memory bandwidth</strong>.
          <br />
          어떤 워크로드든 둘 중 더 낮은 곳에 막힌다.
        </p>
      </div>

      <RooflineViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-10">
        <h3 className="text-xl font-semibold mt-8 mb-3">1-1. Operational Intensity (OI)</h3>
        <ul className="leading-7">
          <li><strong>정의</strong> — 메모리에서 1 byte 읽을 때마다 수행하는 FLOP 수.</li>
          <li><strong>OI = FLOPs / Memory bytes accessed</strong>.</li>
          <li><strong>예시</strong>:
            <ul>
              <li><code>c[i] = a[i] + b[i]</code> (벡터 합) — 2 read + 1 write = 12 byte (FP32), FLOPs = 1. OI = 0.083.</li>
              <li><code>SAXPY: y[i] = a*x[i] + y[i]</code> — OI ≈ 0.17. memory bound.</li>
              <li><code>GEMM (matrix multiply) batch=1</code> — OI ≈ 1~10. memory bound.</li>
              <li><code>GEMM batch=32+</code> — OI ≈ 100~500. compute bound.</li>
              <li><code>Attention (vanilla)</code> — OI ≈ 5~20. memory bound 강함.</li>
              <li><code>FlashAttention</code> — OI ≈ 30~100. tiling 으로 memory access 줄임.</li>
            </ul>
          </li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">1-2. Ridge Point</h3>
        <ul className="leading-7">
          <li><strong>정의</strong> — memory line 과 compute line 이 만나는 OI 값.</li>
          <li><strong>공식</strong> — Ridge OI = Peak FLOPS / Memory bandwidth.</li>
          <li><strong>H100</strong> — 989 TFLOPS / 3.35 TB/s = ~295 FLOPs/byte. 이 이상이면 compute bound, 이하면 memory bound.</li>
          <li><strong>A100</strong> — 312 TFLOPS / 2 TB/s = ~156. H100 보다 낮음 → 더 많은 워크로드가 compute bound.</li>
          <li><strong>의미</strong> — H100 에서 memory bound 였던 워크로드가 H200/B200 에선 compute bound 될 수도 있음.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">1-3. 두 영역 — 완전히 다른 최적화</h3>
        <ul className="leading-7">
          <li>
            <strong>Memory bound (왼쪽 영역)</strong>
            <br />
            한계는 bandwidth. 더 빠른 GPU 사도 같은 비율로 빨라짐 (H100 → B200 의 2x bw 만큼만).
            <br />
            최적화 — 데이터 재사용 ↑ (cache · tiling), quantization (FP16 → FP8 → FP4), kernel fusion.
            <br />
            FlashAttention 이 vanilla attention 의 5~10x 빠른 이유 = OI 를 5x 늘렸기 때문.
          </li>
          <li>
            <strong>Compute bound (오른쪽 영역)</strong>
            <br />
            한계는 TFLOPS. tensor core 활용도 + sparsity + 더 빠른 GPU.
            <br />
            최적화 — sparsity, tensor core 정렬 (M/N/K 가 16 의 배수), batch 키우기.
            <br />
            여기 있으면 사실상 GPU 의 가치를 다 쓰고 있는 것.
          </li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">1-4. 운영 시 측정</h3>
        <ul className="leading-7">
          <li><strong>NVIDIA Nsight Compute</strong> — 커널별 OI 자동 측정 + roofline plot 자동 생성.</li>
          <li><strong>vLLM 의 metrics</strong> — token throughput · GPU utilization. utilization 낮으면 memory bound.</li>
          <li><strong>nvidia-smi</strong> — sm utilization · memory utilization. 둘 다 100% 가까우면 OK.</li>
          <li><strong>실수 패턴</strong> — &quot;sm utilization 80% 인데 왜 빠르지 않지&quot; — sm 이 idle 한 cycle 도 utilization 으로 카운트. 진짜 throughput 측정 필요.</li>
        </ul>
      </div>
    </section>
  );
}
