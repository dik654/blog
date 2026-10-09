import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: four-knobs·not-a-cause 절. 네 경우 모두 Fisher 개정판 19~21쪽의 예시 */
const SCENES = [
  "기준이 되는 한 해입니다",
  "손 바뀜이 두 배면 값이 두 배가 됩니다",
  "물량이 두 배면 값이 절반이 됩니다",
  "돈이 두 배라도 값이 그대로일 수 있습니다",
] as const;

/** [가진 돈 배수, 손 바뀜 배수, 물량 배수] */
const CASES = [
  { m: 1, v: 1, q: 1, label: "기준" },
  { m: 1, v: 2, q: 1, label: "손 바뀜 ×2" },
  { m: 1, v: 1, q: 2, label: "물량 ×2" },
  { m: 2, v: 0.5, q: 1, label: "돈 ×2 · 손 바뀜 ÷2" },
] as const;

const M0 = 5_000_000;
const V0 = 20;

const MONEY_C = "#6366f1";
const TURN_C = "#0ea5e9";
const QTY_C = "#14b8a6";
const PRICE_C = "#ef4444";
const MUTED = "#94a3b8";

export default function FourKnobsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200);
  const s = scenes.active;
  const c = CASES[s];
  /** 값 수준은 나머지 셋이 정하면 따라옵니다 */
  const priceIdx = (c.m * c.v) / c.q;

  const ROWS = [
    { key: "m", label: "가진 돈", color: MONEY_C, mult: c.m, base: `${M0 / 10_000}만 달러` },
    { key: "v", label: "손 바뀜", color: TURN_C, mult: c.v, base: `한 해 ${V0}번` },
    { key: "q", label: "오간 물량", color: QTY_C, mult: c.q, base: "기준 물량" },
  ] as const;

  const NOTES = [
    `가진 돈 ${M0 / 10_000}만 달러가 한 해에 ${V0}번 손을 바꾸고, 그만큼의 물건이 오갑니다. 네 자리 가운데 셋이 이렇게 정해지면 나머지 하나인 값 수준이 따라옵니다. 이 자리를 1로 두고 나머지 세 장면을 견줍니다.`,
    `돈의 양은 그대로인데 같은 돈이 한 해에 ${V0 * 2}번 손을 바꾸면 건너간 돈이 두 배가 됩니다. 물건은 그대로이므로 값이 두 배가 됩니다. 빵은 0.1달러에서 0.2달러, 석탄은 5달러에서 10달러가 됩니다.`,
    `이번에는 돈도 손 바뀜도 그대로인데 오간 물건이 두 배가 됩니다. 같은 돈으로 두 배의 물건을 사야 하므로 값은 절반이 됩니다. 빵은 0.05달러, 석탄은 2.5달러가 됩니다.`,
    `가진 돈이 두 배가 되어도 같은 돈이 손을 바꾸는 횟수가 절반이면 건너간 돈은 그대로입니다. 값도 그대로입니다. 돈을 두 배로 늘리는 것이 늘 값을 두 배로 만들지는 않는다는 것이 Fisher 자신의 문장입니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="네 자리"
      title="셋이 정해지면 나머지 하나가 따라오므로, 값이 올랐다는 말만으로는 어디가 움직였는지 알 수 없습니다"
      description="가진 돈·손 바뀜·오간 물량·값 수준 가운데 어느 자리가 움직였는지에 따라 같은 결과가 전혀 다른 일이 됩니다."
      note="네 경우 모두 Fisher 개정판 19~21쪽에 숫자와 함께 적혀 있는 것입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="세 자리를 바꿀 때 값 수준이 어떻게 따라오는지"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100svh-15rem))] min-h-[23rem] min-w-0 flex-col max-[389px]:[&_[data-viz-mobile-controls]>p]:min-h-[3rem] overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(s + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold min-h-[3rem] min-[390px]:min-h-0">{SCENES[s]}</h4>

          <div className="mt-4 w-full min-w-0 overflow-x-auto">
            <svg
              viewBox="0 0 480 200"
              role="img"
              aria-label={SCENES[s]}
              className="h-auto w-full min-w-[30rem] max-w-2xl"
            >
              {ROWS.map((r, i) => {
                const y = 48 + i * 34;
                const w = 92 * r.mult;
                const changed = r.mult !== 1;
                return (
                  <g key={r.key}>
                    <text x={14} y={y + 4} fontSize={8.5} fontWeight={700} fill={r.color}>
                      {r.label}
                    </text>
                    <rect x={86} y={y - 9} width={Math.min(w, 196)} height={18} rx={3} fill={r.color} opacity={changed ? 0.72 : 0.3} />
                    <text x={90 + Math.min(w, 196)} y={y + 4} fontSize={8} fontWeight={700} fill={changed ? r.color : MUTED}>
                      {r.mult === 1 ? r.base : `×${r.mult}`}
                    </text>
                  </g>
                );
              })}

              <line x1={86} y1={154} x2={300} y2={154} stroke={MUTED} strokeWidth={0.75} />
              <text x={14} y={176} fontSize={8.5} fontWeight={700} fill={PRICE_C}>
                값 수준
              </text>
              <rect x={86} y={163} width={Math.min(92 * priceIdx, 196)} height={18} rx={3} fill={PRICE_C} opacity={0.72} />
              <text x={90 + Math.min(92 * priceIdx, 196)} y={176} fontSize={9} fontWeight={700} fill={PRICE_C}>
                ×{priceIdx}
              </text>

              {/* 오른쪽 셈 */}
              <text x={330} y={44} fontSize={8} fontWeight={700} fill={MUTED}>
                건너간 돈
              </text>
              <text x={330} y={64} fontSize={13} fontWeight={700} fill={MONEY_C}>
                ×{c.m * c.v}
              </text>
              <text x={330} y={88} fontSize={8} fontWeight={700} fill={MUTED}>
                건너온 물량
              </text>
              <text x={330} y={108} fontSize={13} fontWeight={700} fill={QTY_C}>
                ×{c.q}
              </text>
              <text x={330} y={134} fontSize={8} fontWeight={700} fill={MUTED}>
                그래서 값 수준
              </text>
              <text x={330} y={156} fontSize={16} fontWeight={700} fill={PRICE_C}>
                ×{priceIdx}
              </text>

              <text x={14} y={196} fontSize={7.5} fill={MUTED}>
                {s === 0
                  ? `기준: 가진 돈 ${M0 / 10_000}만 달러 × 손 바뀜 ${V0}번 = 한 해에 건너간 돈`
                  : s === 1
                    ? "돈의 양은 그대로인데 건너간 돈이 두 배가 되었습니다"
                    : s === 2
                      ? "같은 돈으로 두 배의 물건을 사야 합니다"
                      : "두 자리가 서로 상쇄되어 값이 움직이지 않습니다"}
              </text>
            </svg>
          </div>

          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-h-[12.25rem] min-[390px]:min-h-[8.75rem] sm:min-h-0">
            {NOTES[s]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
