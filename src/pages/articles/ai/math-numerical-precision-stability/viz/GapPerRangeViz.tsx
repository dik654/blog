import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #precision — 자리 간격은 2의 거듭제곱을 넘을 때마다 두 배가 된다.
 * 앞 두 장면은 같은 δ 축척의 실제 FP16 자리입니다. 셋째 장면만 1024칸을 8칸으로 줄였습니다.
 */
const W = 340;
const H = 168;
const CENTER = 170;
const UNIT = 25; // δ 하나의 화면 폭
const AXIS_Y = 96;

const BLUE = "#2563eb";
const GRAY = "#64748b";
const AMBER = "#d97706";

const WINDOWS = [
  { base: "1", below: 1, above: 2, half: "반 칸" },
  { base: "2", below: 2, above: 4, half: "1/4칸" },
] as const;

const SCENES = [
  { label: "1 근처", summary: "아래 δ · 위 2δ", note: "1 위쪽 간격은 2δ=2⁻¹⁰이고 바로 아래는 그 절반인 δ입니다. 1에 δ를 더하면 두 자리의 정확히 가운데입니다." },
  { label: "2 근처", summary: "아래 2δ · 위 4δ", note: "2를 넘자 위쪽 간격이 4δ=2⁻⁹로 커집니다. 같은 δ를 더해도 이제 1/4칸이라 가까운 자리인 2로 돌아옵니다." },
  { label: "구간 전체", summary: "구간마다 1024칸", note: "소수부 10 bit는 어느 구간이든 1024칸으로 나눕니다. 구간이 두 배면 한 칸도 두 배라 같은 증가량을 구별하기 어려워집니다." },
] as const;

const RANGES = [
  { from: 0.5, to: 1, gap: "δ" },
  { from: 1, to: 2, gap: "2δ" },
  { from: 2, to: 4, gap: "4δ" },
] as const;
const rx = (value: number) => 16 + ((value - 0.5) / 3.5) * (W - 32);

function offsetLabel(base: string, offset: number) {
  if (offset === 0) return base;
  return `${base}${offset < 0 ? "−" : "+"}${Math.abs(offset)}δ`;
}

export default function GapPerRangeViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const active = scenes.active;
  const win = active < 2 ? WINDOWS[active] : null;

  const slots: number[] = [];
  if (win) {
    for (let o = -win.below; o >= -6; o -= win.below) slots.push(o);
    for (let o = 0; o <= 6; o += win.above) slots.push(o);
  }
  const labelled = win ? slots.filter((o) => o === 0 || o % (win.below * 2) === 0 || win.below > 1).filter((o) => Math.abs(o) <= 4) : [];
  const ox = (offset: number) => CENTER + offset * UNIT;

  return (
    <VizFrame
      eyebrow="FP16의 자리 배치"
      title="자리 간격은 2의 거듭제곱을 넘을 때마다 두 배가 됩니다"
      description="눈금이 저장할 수 있는 자리, 빈 점이 저장 직전의 값입니다. δ=1/2048은 앞에서 정한 가정입니다."
      note="앞 두 장면은 실제 FP16 자리를 같은 축척으로 그렸습니다. 셋째 장면은 1024칸을 8칸으로 줄여 간격 비율만 맞췄습니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="1과 2 근처에서 FP16 자리 간격이 두 배가 되는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={active}
          scenes={SCENES.map((item) => (
            <div key={item.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{item.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{item.summary}</span>
            </div>
          ))}
        />
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-3 h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {win && (
            <g>
              <line x1={ox(-6.3)} x2={ox(6.3)} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
              {slots.map((o) => (
                <line key={o} x1={ox(o)} x2={ox(o)} y1={AXIS_Y - 8} y2={AXIS_Y + 8} stroke={o === 0 ? BLUE : GRAY} strokeWidth={o === 0 ? 1.25 : 1} />
              ))}
              {labelled.map((o) => (
                <text key={o} x={ox(o)} y={AXIS_Y + 26} textAnchor="middle" fontSize={12} fontWeight={o === 0 ? 700 : 400} fill={o === 0 ? BLUE : GRAY}>{offsetLabel(win.base, o)}</text>
              ))}
              <path d={`M ${ox(-win.below)} ${AXIS_Y + 40} v 6 H ${ox(0)} v -6`} fill="none" stroke={GRAY} strokeWidth={1} />
              <text x={ox(-win.below / 2)} y={AXIS_Y + 62} textAnchor="middle" fontSize={12} fontWeight={700} fill={GRAY}>{win.below === 1 ? "δ" : `${win.below}δ`}</text>
              <path d={`M ${ox(0)} ${AXIS_Y + 40} v 6 H ${ox(win.above)} v -6`} fill="none" stroke={BLUE} strokeWidth={1} />
              <text x={ox(win.above / 2)} y={AXIS_Y + 62} textAnchor="middle" fontSize={12} fontWeight={700} fill={BLUE}>{`${win.above}δ`}</text>

              <path d={`M ${ox(0)} ${AXIS_Y - 38} H ${ox(1)}`} fill="none" stroke={AMBER} strokeWidth={1.25} />
              <path d={`M ${ox(1)} ${AXIS_Y - 38} V ${AXIS_Y - 14}`} fill="none" stroke={AMBER} strokeWidth={1} strokeDasharray="3 3" />
              <circle cx={ox(1)} cy={AXIS_Y - 38} r={5} fill="#ffffff" stroke={AMBER} strokeWidth={1.25} />
              <text x={ox(1) + 10} y={AXIS_Y - 34} fontSize={12} fontWeight={700} fill={AMBER}>{`${win.base}+δ: ${win.half}`}</text>
            </g>
          )}
          {!win && (
            <g>
              <line x1={rx(0.5)} x2={rx(4)} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
              {RANGES.map((range, index) => {
                const color = index === 2 ? BLUE : GRAY;
                return (
                  <g key={range.from}>
                    {Array.from({ length: 8 }, (_, i) => range.from + ((range.to - range.from) * i) / 8).map((value) => (
                      <line key={value} x1={rx(value)} x2={rx(value)} y1={AXIS_Y - 6} y2={AXIS_Y + 6} stroke={color} strokeWidth={1} />
                    ))}
                    <line x1={rx(range.from)} x2={rx(range.from)} y1={AXIS_Y - 14} y2={AXIS_Y + 14} stroke={color} strokeWidth={1.25} />
                    <text x={rx(range.from)} y={AXIS_Y + 30} textAnchor="middle" fontSize={12} fill={color}>{range.from === 0.5 ? "1/2" : range.from}</text>
                    <text x={(rx(range.from) + rx(range.to)) / 2} y={AXIS_Y - 22} textAnchor="middle" fontSize={12} fontWeight={700} fill={color}>{range.gap}</text>
                  </g>
                );
              })}
              <line x1={rx(4)} x2={rx(4)} y1={AXIS_Y - 14} y2={AXIS_Y + 14} stroke={BLUE} strokeWidth={1.25} />
              <text x={rx(4)} y={AXIS_Y + 30} textAnchor="end" fontSize={12} fill={BLUE}>4</text>
              <text x={W / 2} y={AXIS_Y - 48} textAnchor="middle" fontSize={12} fill={GRAY}>한 칸의 크기</text>
              <text x={W / 2} y={AXIS_Y + 56} textAnchor="middle" fontSize={12} fill={GRAY}>세 구간 모두 1024칸 (8칸으로 줄여 그림)</text>
            </g>
          )}
        </svg>
        <StableSceneStack
          active={active}
          className="mt-2"
          scenes={SCENES.map((item) => (
            <p key={item.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {item.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={SCENES.map((item) => item.label)} />
        <StaticSceneList labels={SCENES.map((item) => item.label)} notes={SCENES.map((item) => item.note)} />
      </div>
    </VizFrame>
  );
}
