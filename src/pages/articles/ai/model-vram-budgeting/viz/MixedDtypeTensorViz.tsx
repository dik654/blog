import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #weight-estimate — M_W = Σ N_d × B_d
 * 한 mechanism: 원소 수(타일 개수)는 그대로 두고 dtype이 타일의 폭(byte)만 바꾼다.
 * 공식 혼합 FP8: 24.699B × 1 B + 3.084B × 2 B = 30.867 GB = 28.75 GiB. 전부 BF16이면 27.781B × 2 B = 55.56 GB = 51.75 GiB.
 */
const FP8_N = 24.699;
const BF16_N = 3.084;
const ALL_N = 27.781;
const GIB = 1.073741824;
const CAPACITY = 48;

const FP8 = { border: "#2563eb", fill: "#dbeafe", text: "#1e3a8a" };
const BF16 = { border: "#d97706", fill: "#fef3c7", text: "#78350f" };
const OVER = { border: "#dc2626", fill: "#fee2e2", text: "#991b1b" };

/** n(십억 원소)을 1B짜리 타일로 쪼갠다. 마지막 타일은 남은 비율만큼 짧다. */
const tiles = (n: number) => Array.from({ length: Math.ceil(n) }, (_, i) => Math.min(1, n - i));

interface Scene {
  label: string;
  note: string;
}

const SCENES: readonly Scene[] = [
  { label: "원소 수부터 셈", note: "타일 하나가 parameter 10억 개입니다. 공식 혼합 FP8 checkpoint에는 FP8 원소 24.699B와 BF16로 남긴 원소 3.084B가 있습니다. 아직 byte가 아니라 개수입니다." },
  { label: "dtype이 폭을 정함", note: "같은 타일에 원소 폭을 곱합니다. FP8 타일은 1 B 폭이고 BF16 타일은 2 B 폭이라 두 배로 늘어납니다. 24.699 + 3.084 × 2 = 30.867 GB입니다." },
  { label: "48 GiB 칸에 넣기", note: "30.867 GB를 2³⁰ byte로 나누면 28.75 GiB입니다. 1칸 = 1 GiB인 48칸 중 28.75칸이 차고 KV와 runtime이 쓸 19.25칸이 남습니다." },
  { label: "이름만 보고 셈", note: "\"FP8 27B\"라는 이름만 믿고 27.781B × 1 B로 세면 25.87 GiB입니다. BF16로 남은 3.084B의 두 번째 byte 2.87 GiB가 빠져 실제보다 작게 나옵니다." },
  { label: "전부 BF16이면", note: "27.781B를 모두 2 B로 두면 55.56 GB = 51.75 GiB입니다. 48칸을 다 채우고 3.75칸이 넘쳐 KV를 넣기 전부터 한 장에 올라가지 않습니다." },
];

function Tile({ frac, wide, tone, delay, reduced }: { frac: number; wide: boolean; tone: typeof FP8; delay: number; reduced: boolean }) {
  return (
    <motion.span
      className="block h-5 shrink-0 rounded-[2px] border"
      style={{ borderColor: tone.border, backgroundColor: tone.fill }}
      initial={false}
      animate={{ width: `${frac * (wide ? 1.5 : 0.75)}rem` }}
      transition={{ duration: reduced ? 0 : 0.45, delay: reduced ? 0 : delay }}
    />
  );
}

function TileRows({ widen, reduced }: { widen: boolean; reduced: boolean }) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-[11px] font-bold" style={{ color: FP8.text }}>
          FP8 · 24.699B 원소 × 1 B = 24.70 GB
        </p>
        <div className="mt-1 flex flex-wrap gap-[3px]">
          {tiles(FP8_N).map((f, i) => (
            <Tile key={i} frac={f} wide={false} tone={FP8} delay={0} reduced={reduced} />
          ))}
        </div>
      </div>
      <div>
        <p className="text-[11px] font-bold" style={{ color: BF16.text }}>
          BF16 · 3.084B 원소 × {widen ? "2 B = 6.17 GB" : "? B"}
        </p>
        <div className="mt-1 flex flex-wrap gap-[3px]">
          {tiles(BF16_N).map((f, i) => (
            <Tile key={i} frac={f} wide={widen} tone={BF16} delay={i * 0.1} reduced={reduced} />
          ))}
        </div>
      </div>
      <p className="font-mono text-xs font-bold text-foreground">
        {widen ? "합 30.867 GB" : "원소 합 27.78B · 타일 28개(마지막 타일은 짧음)"}
      </p>
    </div>
  );
}

/** 48칸(1칸 = 1 GiB) 격자. segments 순서대로 칸을 채우고, 넘친 몫은 아래 줄에 따로 그린다. */
function CapacityGrid({ segments, reduced }: { segments: { gib: number; tone: typeof FP8 }[]; reduced: boolean }) {
  const cells = Array.from({ length: CAPACITY }, (_, i) => {
    let start = 0;
    const parts: { frac: number; tone: typeof FP8 }[] = [];
    for (const s of segments) {
      const lo = Math.max(i, start);
      const hi = Math.min(i + 1, start + s.gib);
      if (hi > lo) parts.push({ frac: hi - lo, tone: s.tone });
      start += s.gib;
    }
    return parts;
  });
  const total = segments.reduce((a, s) => a + s.gib, 0);
  const over = Math.max(0, total - CAPACITY);
  return (
    <div>
      <div className="grid grid-cols-12 gap-[3px]">
        {cells.map((parts, i) => (
          <span key={i} className="relative flex h-5 overflow-hidden rounded-[2px] border border-dashed border-[#94a3b8]">
            {parts.map((p, j) => (
              <motion.span
                key={j}
                className="h-full"
                style={{ backgroundColor: p.tone.border }}
                initial={{ width: 0 }}
                animate={{ width: `${p.frac * 100}%` }}
                transition={{ duration: reduced ? 0 : 0.2, delay: reduced ? 0 : i * 0.025 }}
              />
            ))}
          </span>
        ))}
      </div>
      <div className="mt-2 flex min-h-5 items-center gap-[3px]">
        {over > 0 ? (
          <>
            <span className="mr-1 text-[11px] font-bold" style={{ color: OVER.text }}>
              넘침
            </span>
            {tiles(over).map((f, i) => (
              <span key={i} className="block h-5 rounded-[2px] border" style={{ width: `${f * 1.25}rem`, borderColor: OVER.border, backgroundColor: OVER.fill }} />
            ))}
            <span className="ml-1 font-mono text-[11px] font-bold" style={{ color: OVER.text }}>
              {over.toFixed(2)} GiB
            </span>
          </>
        ) : (
          <span className="text-[11px] text-muted-foreground">점선 빈칸 = 남은 {(CAPACITY - total).toFixed(2)} GiB</span>
        )}
      </div>
    </div>
  );
}

export default function MixedDtypeTensorViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const step = scenes.active;
  const scene = SCENES[step];
  const reduced = scenes.reducedMotion;
  const r = (i: number) => reduced || step !== i;
  const nodes = [
    <TileRows key="t0" widen={false} reduced={r(0)} />,
    <TileRows key={`t1${step}`} widen={step === 1} reduced={r(1)} />,
    <CapacityGrid
      key={`g2${step}`}
      segments={[
        { gib: FP8_N / GIB, tone: FP8 },
        { gib: (BF16_N * 2) / GIB, tone: BF16 },
      ]}
      reduced={r(2)}
    />,
    <CapacityGrid key={`g3${step}`} segments={[{ gib: ALL_N / GIB, tone: FP8 }]} reduced={r(3)} />,
    <CapacityGrid key={`g4${step}`} segments={[{ gib: (ALL_N * 2) / GIB, tone: BF16 }]} reduced={r(4)} />,
  ];
  const result = ["27.78B 원소", "30.867 GB", "28.75 GiB", "25.87 GiB (−2.87)", "51.75 GiB > 48"][step];

  return (
    <VizFrame
      eyebrow="Mixed-dtype payload"
      title="원소 수는 그대로이고 dtype이 타일 폭만 바꿉니다"
      description="파랑은 FP8(1 B), 주황은 BF16(2 B) 원소입니다. 뒤 세 장면의 격자는 48 GiB GPU 한 장이며 한 칸이 1 GiB입니다."
      note="Tensor payload만 셉니다. scale tensor·file header·alignment와 KV·runtime 공간은 들어 있지 않습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="dtype별 원소 수와 byte 폭으로 weight payload 계산"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <div className="flex min-h-[3.7rem] flex-wrap content-start items-baseline justify-between gap-2 sm:min-h-0">
            <h4 className="text-base font-bold">{scene.label}</h4>
            <span className="font-mono text-sm font-bold text-primary">{result}</span>
          </div>
          <StableSceneStack active={step} scenes={nodes} className="mt-3 max-w-2xl" />
          <p className="mt-4 min-h-[10.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[9rem] sm:min-h-[3.5rem]">
            {scene.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
