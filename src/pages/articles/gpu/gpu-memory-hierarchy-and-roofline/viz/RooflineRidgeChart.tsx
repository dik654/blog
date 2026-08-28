import { Coordinates, Mafs, Plot, Point, Text, Theme } from "mafs";

/**
 * H100 SXM5 가정값(FP16 Tensor dense 989 TFLOPS, FP32 67 TFLOPS, HBM3 3.35 TB/s)으로
 * attainable = min(peak, BW × AI) 의 모양과 ridge point 를 보여 준다. 축은 선형이라
 * AI 가 큰 GEMM 은 오른쪽 바깥에 있고, 그 사실 자체가 compute-bound 의 뜻이다.
 */
const BW = 3.35; // TB/s
const PEAK_TENSOR = 989; // TFLOPS, FP16 dense
const PEAK_FP32 = 67; // TFLOPS

export default function RooflineRidgeChart() {
  const ridgeTensor = PEAK_TENSOR / BW; // ≈ 295 FLOP/B
  const ridgeFp32 = PEAK_FP32 / BW; // ≈ 20 FLOP/B

  return (
    <div className="not-prose my-8 rounded-lg border border-border/70 bg-background p-4 sm:p-6">
      <p className="text-xs font-bold text-primary">Roofline 의 두 지붕과 ridge point</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        x = arithmetic intensity(FLOP/byte), y = 도달 가능한 TFLOPS. 기울기 3.35 인 선이
        HBM3 대역폭 지붕이고, 989 와 67 의 수평선이 FP16 Tensor Core 와 FP32 CUDA core 의
        compute 지붕입니다. 두 지붕이 만나는 x 가 ridge point 입니다.
      </p>
      <div className="themed-mafs mt-4 min-w-0 overflow-x-auto">
        <Mafs height={260} viewBox={{ x: [0, 420], y: [0, 1100], padding: 0 }} preserveAspectRatio={false}>
          <Coordinates.Cartesian
            xAxis={{ lines: 50, labels: (v) => (v % 100 === 0 ? String(v) : "") }}
            yAxis={{ lines: 100, labels: (v) => (v % 500 === 0 ? String(v) : "") }}
          />
          <Plot.OfX y={(x) => Math.min(PEAK_TENSOR, BW * x)} color={Theme.blue} />
          <Plot.OfX y={(x) => Math.min(PEAK_FP32, BW * x)} color={Theme.green} />
          <Point x={ridgeTensor} y={PEAK_TENSOR} color={Theme.pink} />
          <Point x={ridgeFp32} y={PEAK_FP32} color={Theme.pink} />
          <Point x={1} y={BW * 1} color={Theme.orange} />
          <Text x={ridgeTensor + 8} y={PEAK_TENSOR - 70} size={12} color={Theme.pink} attach="e">
            ridge ≈ 295 FLOP/B
          </Text>
          <Text x={ridgeFp32 + 8} y={PEAK_FP32 + 90} size={12} color={Theme.pink} attach="e">
            FP32 ridge ≈ 20
          </Text>
          <Text x={20} y={170} size={12} color={Theme.orange} attach="e">
            GEMV AI≈1 → 3.35 TFLOPS
          </Text>
        </Mafs>
      </div>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        AI 1 인 decode GEMV 는 Tensor Core 를 써도 3.35 TFLOPS 에 묶이고, AI 1,365 인
        4096³ FP16 GEMM 은 그래프 오른쪽 바깥에서 989 TFLOPS 지붕에 닿습니다. 수치는 NVIDIA
        가 공개한 H100 SXM5 peak 이며 clock·SKU 조건에 묶인 값입니다.
      </p>
    </div>
  );
}
