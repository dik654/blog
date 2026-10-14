import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * key 원소 네 개가 쓰기(÷s, FP8 격자)와 읽기(×s)를 지나며 어떻게 달라지는지 보여 준다.
 * 한 mechanism: x̂ = FP8(x / s) · s. 격자 간격과 448 상한이 오차를 만든다.
 * 값은 계산으로 검증한 E4M3 반올림 결과다(round-to-nearest, 448에서 포화).
 */
const SCENES = ["원래 key 넷", "scale로 나누기", "FP8 격자에 맞추기", "읽을 때 곱하기", "큰 채널에 따로 scale"] as const;

interface Row {
  x: string;
  divided: string;
  stored: string;
  restored: string;
  error: string;
  clipped?: boolean;
}

const SHARED: readonly Row[] = [
  { x: "0.47", divided: "23.5", stored: "24", restored: "0.48", error: "0.01" },
  { x: "-1.3", divided: "-65", stored: "-64", restored: "-1.28", error: "0.02" },
  { x: "3.1", divided: "155", stored: "160", restored: "3.2", error: "0.10" },
  { x: "12.0", divided: "600", stored: "448", restored: "8.96", error: "3.04", clipped: true },
];

const OWN_SCALE: Row = { x: "12.0", divided: "200", stored: "192", restored: "11.52", error: "0.48" };

const NOTES = [
  "같은 head의 key 원소 네 개입니다. warmup 때 본 가장 큰 절댓값은 4.0이었고, 마지막 12.0은 그 뒤에 처음 나타난 큰 값입니다.",
  "scale s = 4.0 ÷ 200 = 0.02입니다. 쓰는 쪽은 값을 s로 나눕니다. 12.0은 600이 되어 FP8 E4M3가 담는 최댓값 448을 넘습니다.",
  "E4M3는 16~32 사이를 2 간격, 64~128을 8 간격, 128~256을 16 간격으로 나눕니다. 가장 가까운 칸에 맞추고, 448을 넘은 값은 448에 멈춥니다.",
  "읽는 쪽은 저장된 수에 s를 곱합니다. 작은 세 값의 오차는 0.01~0.10이지만, 상한에 걸린 12.0은 8.96으로 돌아와 3.04가 사라집니다.",
  "큰 값이 늘 같은 채널에 나온다면 그 채널만 s = 12 ÷ 200 = 0.06을 씁니다. 저장값 192에서 11.52로 돌아와 오차가 0.48로 줄어듭니다.",
] as const;

const COLS = ["x", "x ÷ s", "FP8 저장", "× s", "오차"] as const;

export default function QuantRoundTripViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const scene = scenes.active;
  const rows = scene === 4 ? [...SHARED.slice(0, 3), OWN_SCALE] : SHARED;
  const visibleCols = scene === 4 ? 5 : scene + 2;

  const cell = (row: Row, col: number) => [row.x, row.divided, row.stored, row.restored, row.error][col];

  return (
    <VizFrame
      eyebrow="Quantize on write · dequantize on read"
      title="쓸 때 나누고 읽을 때 곱하는 사이에 격자 오차와 상한 오차가 생깁니다"
      description="한 줄이 key 원소 하나입니다. 오른쪽으로 갈수록 KV를 쓰는 kernel과 읽는 attention kernel이 하는 일을 차례로 더합니다."
      note="scale 0.02는 vLLM의 calc_kv_scales처럼 max|k| ÷ 200으로 정한 가정값입니다. 실제 모델의 key 값은 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="FP8 KV 쓰기와 읽기의 왕복 오차"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scene + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>

          <div className="mt-4 grid grid-cols-5 gap-1 font-mono text-xs">
            {COLS.map((label, col) => (
              <div key={label} className={`px-1 pb-1 text-[11px] font-bold ${col < visibleCols ? "text-primary" : "text-muted-foreground/40"}`}>
                {label}
              </div>
            ))}
            {rows.map((row, rowIndex) =>
              COLS.map((label, col) => {
                const shown = col < visibleCols;
                const warn = row.clipped && col >= 2 && shown;
                const fixed = scene === 4 && rowIndex === 3 && col >= 1;
                return (
                  <div
                    key={`${rowIndex}-${label}`}
                    className={`flex h-9 items-center justify-end border px-1.5 tabular-nums ${
                      !shown
                        ? "border-border/40 text-transparent"
                        : warn
                          ? "border-[#dc2626]/60 bg-[#dc2626]/10 font-bold text-[#dc2626]"
                          : fixed
                            ? "border-[#0d9488]/60 bg-[#0d9488]/10 font-bold text-[#0d9488]"
                            : "border-border bg-muted/30 text-foreground"
                    }`}
                  >
                    {shown ? cell(row, col) : "·"}
                  </div>
                );
              }),
            )}
          </div>

          <svg viewBox="0 0 360 52" className="mt-3 w-full max-w-[22rem]" role="img" aria-label="FP8 E4M3 표현 범위와 600의 위치">
            <line x1={10} y1={26} x2={350} y2={26} stroke="#6b7280" strokeWidth={1} />
            <rect x={10} y={20} width={(448 / 640) * 340} height={12} fill="#2563eb" fillOpacity={0.15} />
            <line x1={10 + (448 / 640) * 340} y1={14} x2={10 + (448 / 640) * 340} y2={38} stroke="#2563eb" strokeWidth={1} />
            <text x={10 + (448 / 640) * 340 - 4} y={50} fontSize={13} fill="#2563eb" textAnchor="end">448</text>
            <text x={10} y={50} fontSize={13} fill="#6b7280">0</text>
            {scene >= 1 && scene <= 3 ? (
              <>
                <circle cx={10 + (600 / 640) * 340} cy={26} r={4} fill="#dc2626" />
                <text x={10 + (600 / 640) * 340} y={12} fontSize={13} fill="#dc2626" textAnchor="middle">600</text>
              </>
            ) : null}
            {scene === 4 ? (
              <>
                <circle cx={10 + (200 / 640) * 340} cy={26} r={4} fill="#0d9488" />
                <text x={10 + (200 / 640) * 340} y={12} fontSize={13} fill="#0d9488" textAnchor="middle">200</text>
              </>
            ) : null}
          </svg>

          <p className="mt-3 min-h-[9.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground sm:min-h-[4.5rem]">
            {NOTES[scene]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
