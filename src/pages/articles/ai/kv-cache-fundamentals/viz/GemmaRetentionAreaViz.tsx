import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 가로 = token 위치(0~4096), 세로 = 위치 하나의 KiB(0~960). 사각형 넓이가 곧 MiB다.
 * 한 mechanism: 층별 모양과 보존 길이를 반영하면 3,840MiB의 사각형이 1,120MiB의 두 조각으로 줄어든다.
 * 첫 장면만 한 층·한 위치의 K 모양을 head(세로) × 값(가로) 척도로 그린다.
 */
const W = 380;
const H = 240;
const M = { l: 34, r: 14, t: 22, b: 36 };
const LOCAL = "#d97706";
const GLOBAL = "#0891b2";
const MAX_POS = 4096;
const MAX_KIB = 960;

const x = (position: number) => M.l + (position / MAX_POS) * (W - M.l - M.r);
const y = (kib: number) => H - M.b - (kib / MAX_KIB) * (H - M.t - M.b);

const SCENES = [
  { label: "한 층의 모양이 다름", step: 0, value: "16KiB / 8KiB", note: "막대 한 줄이 head 하나이고 가로 길이가 값 개수입니다. V도 같은 크기로 하나 더 있고 값마다 2byte라 층 하나가 위치마다 16KiB와 8KiB를 남깁니다." },
  { label: "uniform 대용 계산", step: 1, value: "3,840MiB", note: "60층 전부를 local 모양으로 세고 4096위치를 모두 남기면 위치당 960KiB의 큰 사각형이 됩니다. 점선이 이 넓이입니다." },
  { label: "local 최근 1024위치", step: 2, value: "800MiB", note: "local 50층은 위치당 800KiB이지만 window 1024까지만 남긴다고 가정합니다. 높이는 높아도 폭이 4분의 1입니다." },
  { label: "global 4096위치", step: 3, value: "320MiB", note: "global 10층은 위치당 80KiB로 얇지만 모든 위치를 남깁니다. 폭이 전체인 띠가 생깁니다." },
  { label: "칠한 넓이 비교", step: 4, value: "1,120 / 3,840MiB", note: "칠한 두 조각을 더하면 1,120MiB이고 점선 사각형의 29.2%입니다. 줄어든 넓이 대부분은 local이 남기지 않는 왼쪽 3,072위치에서 나옵니다." },
] as const;

function Shapes() {
  const scale = 0.32;
  const stripe = 7;
  const gap = 2;
  const top = 20;
  const shape = (left: number, heads: number, width: number, color: string) =>
    Array.from({ length: heads }, (_, index) => (
      <rect key={index} x={left} y={top + index * (stripe + gap)} width={width * scale} height={stripe} fill={color} fillOpacity={0.8} />
    ));
  const bottom = top + 16 * (stripe + gap) + 16;
  return (
    <g>
      {shape(30, 16, 256, LOCAL)}
      {shape(180, 4, 512, GLOBAL)}
      <text x={30} y={12} fontSize={12} fontWeight={700} className="fill-foreground">local층 50개</text>
      <text x={180} y={12} fontSize={12} fontWeight={700} className="fill-foreground">global층 10개</text>
      <text x={30} y={bottom} fontSize={12} className="fill-muted-foreground">head 16 × 값 256</text>
      <text x={30} y={bottom + 18} fontSize={12} className="fill-foreground">= K 4,096개</text>
      <text x={180} y={top + 4 * (stripe + gap) + 16} fontSize={12} className="fill-muted-foreground">head 4 × 값 512</text>
      <text x={180} y={top + 4 * (stripe + gap) + 34} fontSize={12} className="fill-foreground">= K 2,048개</text>
    </g>
  );
}

function Area({ step }: { step: number }) {
  const bandTop = y(80);
  const localTop = y(880);
  return (
    <g>
      {[0, 80, 880, 960].map((kib) => (
        <text key={kib} x={M.l - 5} y={y(kib) + 4} textAnchor="end" fontSize={11} className="fill-muted-foreground">
          {kib}
        </text>
      ))}
      {[0, 1024, 3072, 4096].map((position) => (
        <text key={position} x={x(position)} y={H - M.b + 15} textAnchor="middle" fontSize={11} className="fill-muted-foreground">
          {position}
        </text>
      ))}
      <text x={M.l - 5} y={9} textAnchor="end" fontSize={10} className="fill-muted-foreground">KiB</text>
      <text x={(M.l + W - M.r) / 2} y={H - 3} textAnchor="middle" fontSize={11} className="fill-muted-foreground">
        token 위치 (왼쪽이 오래된 쪽)
      </text>
      <line x1={M.l} x2={M.l} y1={M.t} y2={H - M.b} stroke="#94a3b8" strokeWidth={1} />
      <line x1={M.l} x2={W - M.r} y1={H - M.b} y2={H - M.b} stroke="#94a3b8" strokeWidth={1} />
      <rect x={x(0)} y={y(960)} width={x(4096) - x(0)} height={y(0) - y(960)} fill="none" stroke="#64748b" strokeWidth={1} strokeDasharray="5 4" />
      <text x={x(0) + 8} y={y(960) + 18} fontSize={12} fontWeight={700} className="fill-foreground">
        uniform 4096 × 960KiB = 3,840MiB
      </text>
      {step >= 2 ? (
        <g>
          <rect x={x(3072)} y={localTop} width={x(4096) - x(3072)} height={bandTop - localTop - 2} fill={LOCAL} fillOpacity={0.8} />
          <text x={(x(3072) + x(4096)) / 2} y={(localTop + bandTop) / 2 - 4} textAnchor="middle" fontSize={12} fontWeight={700} className="fill-foreground">local</text>
          <text x={(x(3072) + x(4096)) / 2} y={(localTop + bandTop) / 2 + 12} textAnchor="middle" fontSize={12} fontWeight={700} className="fill-foreground">800MiB</text>
        </g>
      ) : null}
      {step >= 3 ? (
        <g>
          <rect x={x(0)} y={bandTop} width={x(4096) - x(0)} height={y(0) - bandTop} fill={GLOBAL} fillOpacity={0.8} />
          <text x={x(0) + 8} y={bandTop + 13} fontSize={12} fontWeight={700} className="fill-foreground">global 320MiB</text>
        </g>
      ) : null}
    </g>
  );
}

export default function GemmaRetentionAreaViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="넓이로 세는 cache"
      title="Gemma의 cache는 큰 사각형 하나가 아니라 모양이 다른 두 조각입니다"
      description="첫 장면에서 층의 모양을 본 뒤, 다음 장면부터는 가로 위치 수와 세로 위치당 KiB의 넓이로 용량을 읽습니다."
      note="4096위치를 처리했고 local은 정확히 1024위치까지 남긴다고 둔 계산입니다(가정). local을 가장 최근 위치에 그렸습니다. BF16 원소 2byte의 논리 용량이며 실제 엔진의 block 배정·padding·회수 시점을 측정한 값이 아닙니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Gemma 4 31B의 층별 KV 모양과 보존 넓이"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <div className="flex min-h-[3.7rem] flex-wrap content-start items-baseline justify-between gap-2 sm:min-h-0">
            <h4 className="text-base font-bold">{scene.label}</h4>
            <span className="font-mono text-sm font-bold text-primary">{scene.value}</span>
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-2 h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.value}`}>
            {scene.step === 0 ? <Shapes /> : <Area step={scene.step} />}
          </svg>
          <p className="mt-3 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]">{scene.note}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
