import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 가중치 256개를 세 형식으로 저장할 때 byte 막대가 어떻게 줄어드는지 같은 눈금으로 그린다.
 * 한 mechanism: 블록마다 배율 몇 byte를 붙이고 값 자체는 적은 비트로 저장한다.
 */
const SCENES = ["F16 256개", "Q8_0 블록 8개", "Q4_K 블록 1개", "8B 모델 전체"] as const;

const FULL = 512;

interface Segment {
  label: string;
  bytes: number;
  color: string;
}

const LAYOUTS: readonly Segment[][] = [
  [{ label: "f16 값 2 byte × 256", bytes: 512, color: "bg-slate-500" }],
  Array.from({ length: 8 }, (_, index) => ({
    label: "블록 하나 = d 2 + int8 32 = 34 byte",
    bytes: 34,
    color: index % 2 ? "bg-teal-700" : "bg-teal-500",
  })),
  [
    { label: "d·dmin 4", bytes: 4, color: "bg-violet-600" },
    { label: "6비트 scale·min 12", bytes: 12, color: "bg-amber-500" },
    { label: "4비트 값 128", bytes: 128, color: "bg-blue-600" },
  ],
];

const TOTALS = [
  { name: "F16", bytes: 512, bits: "16", model: "16.06 GB" },
  { name: "Q8_0", bytes: 272, bits: "8.5", model: "8.53 GB" },
  { name: "Q4_K", bytes: 144, bits: "4.5", model: "4.52 GB" },
] as const;

const NOTES = [
  "같은 가중치 256개를 2 byte씩 그대로 두면 512 byte입니다. 이 길이를 100%로 두고 아래 장면들을 같은 눈금으로 그립니다.",
  "Q8_0은 32개마다 f16 배율 d 2 byte와 int8 값 32 byte를 묶어 34 byte입니다. 256개면 8블록, 272 byte로 값당 8.5비트입니다.",
  "Q4_K는 256개를 한 블록으로 묶고 작은 블록 8개의 배율을 6비트로 줄여 12 byte에 넣습니다. 4 + 12 + 128 = 144 byte, 4.5비트입니다.",
  "Llama 3.1 8B의 가중치 8.03 × 10⁹개 전부를 각 형식으로 둔다고 가정한 크기입니다. 실제 파일은 텐서마다 형식을 섞어 이 값과 다릅니다.",
] as const;

function pct(bytes: number) {
  return `${(bytes / FULL) * 100}%`;
}

export default function Q4KBlockViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const scene = scenes.active;
  const showModel = scene === 3;
  const legend = showModel ? [] : LAYOUTS[scene].filter((segment, index, all) => all.findIndex((other) => other.label === segment.label) === index);

  return (
    <VizFrame
      eyebrow="GGUF K-quant block"
      title="배율 몇 byte를 붙이고 값은 4비트로 담아 256개가 144 byte가 됩니다"
      description="막대 길이는 가중치 256개가 차지하는 byte입니다. 모든 장면이 F16 512 byte를 전체 폭으로 둔 같은 눈금입니다."
      note="마지막 장면은 모든 텐서를 한 형식으로 둔다는 가정의 계산입니다. 정확도 차이는 여기 넣지 않았습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="양자화 형식별 byte 배치"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(scene + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>

          <div className="mt-4 min-h-[8.5rem]">
            {showModel ? (
              <ul className="space-y-3">
                {TOTALS.map((row) => (
                  <li key={row.name} className="min-w-0">
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="font-bold text-foreground">
                        {row.name} · {row.bits}비트
                      </span>
                      <span className="font-mono font-bold text-foreground">{row.model}</span>
                    </div>
                    <div className="mt-1 h-3 w-full rounded-sm bg-muted/60">
                      <div className="h-full rounded-sm bg-blue-600/70" style={{ width: pct(row.bytes) }} />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <>
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>0 byte</span>
                  <span>512 byte</span>
                </div>
                <div className="mt-1 flex h-9 w-full rounded-sm border border-dashed border-muted-foreground/50">
                  {LAYOUTS[scene].map((segment, index) => (
                    <div key={index} className={`h-full border-r border-background ${segment.color}`} style={{ width: pct(segment.bytes) }} />
                  ))}
                </div>
                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  {legend.map((segment) => (
                    <li key={segment.label} className="flex items-center gap-1.5">
                      <span className={`inline-block size-2.5 ${segment.color}`} />
                      {segment.label}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 font-mono text-xs font-bold text-foreground">
                  {TOTALS[scene].bytes} byte · 값당 {TOTALS[scene].bits}비트 · F16의 {Math.round((TOTALS[scene].bytes / FULL) * 1000) / 10}%
                </p>
              </>
            )}
          </div>

          <p className="mt-4 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground sm:min-h-[3.5rem]">
            {NOTES[scene]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
