import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: how-much-care 의 ExplainedFormula — 예방 비용과 기대 손해의 합을 최소로 */
const SCENES = [
  "아무것도 하지 않으면",
  "한 단계 올리면 합이 내려간다",
  "한 단계 더 올리면 다시 올라간다",
  "한계로 보면 멈출 지점이 보인다",
] as const;

const LOSS = 1000;

/** 주의 수준별 예방 비용과 사고 확률 */
const LEVELS = [
  { label: "조치 없음", burden: 0, prob: 0.1 },
  { label: "기본 조치", burden: 20, prob: 0.06 },
  { label: "추가 조치", burden: 50, prob: 0.035 },
  { label: "과한 조치", burden: 100, prob: 0.03 },
] as const;

const OK = "#10b981";
const WARN = "#ef4444";
const ACCENT = "#6366f1";
const MUTED = "#94a3b8";

const expected = (i: number) => LEVELS[i].prob * LOSS;
const total = (i: number) => LEVELS[i].burden + expected(i);
const best = LEVELS.map((_, i) => i).reduce((a, b) => (total(b) < total(a) ? b : a), 0);

const pct = (p: number) => `${Math.round(p * 1000) / 10}`;

const fmt = (v: number) =>
  Math.abs(v - Math.round(v)) < 1e-9 ? `${Math.round(v)}` : v.toFixed(1);

const BAR_X = 132;
const BAR_W = 250;
const MAX = 140;

export default function CareLevelViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const step = scenes.active;
  const shown = step === 3 ? LEVELS.length : step + 1;

  const NOTES = [
    `사고가 나면 손해가 ${LOSS}입니다. 아무 조치도 하지 않으면 예방 비용은 0이지만 사고 확률이 ${pct(LEVELS[0].prob)}퍼센트라 기대 손해가 ${fmt(expected(0))}이고, 합은 ${fmt(total(0))}입니다.`,
    `기본 조치에 ${LEVELS[1].burden}을 쓰면 확률이 ${pct(LEVELS[1].prob)}퍼센트로 내려가 기대 손해가 ${fmt(expected(1))}이 됩니다. 합이 ${fmt(total(1))}으로 줄었으므로 이 조치는 해야 합니다.`,
    `한 단계 더 올려 ${LEVELS[2].burden}을 쓰면 기대 손해가 ${fmt(expected(2))}까지 내려가지만 합은 ${fmt(total(2))}으로 다시 올라갑니다. 줄인 손해보다 더 많은 비용을 쓴 것입니다.`,
    `멈출 지점은 한계로 보면 바로 나옵니다. 조치 없음에서 기본 조치로 갈 때 ${LEVELS[1].burden - LEVELS[0].burden}을 써서 ${fmt(expected(0) - expected(1))}을 줄였으니 남는 장사이고, 한 단계 더 갈 때는 ${LEVELS[2].burden - LEVELS[1].burden}을 써서 ${fmt(expected(1) - expected(2))}밖에 못 줄이니 손해입니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="얼마나 조심할 것인가"
      title="예방에 쓴 돈과 남은 기대 손해의 합이 가장 작은 지점이 있습니다"
      description="더 조심할수록 사고는 줄지만 조심하는 데 드는 비용은 늘어납니다."
      note={`사고 손해를 ${LOSS}으로 고정하고 주의 수준을 네 단계로 줄인 예입니다. 실제로는 연속적이고 확률도 정확히 알 수 없습니다.`}
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="주의 수준별 비용의 합"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(step + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>

          <div className="mt-4 w-full min-w-0 overflow-x-auto">
            <svg
              viewBox="0 0 480 200"
              role="img"
              aria-label={SCENES[step]}
              className="h-auto w-full min-w-[30rem] max-w-2xl"
            >
              <text x={BAR_X - 10} y={24} textAnchor="end" fontSize={8.5} fontWeight={700} fill={MUTED}>
                주의 수준
              </text>
              <text x={BAR_X} y={24} fontSize={8} fill={MUTED}>
                예방 비용
              </text>
              <text x={BAR_X + 96} y={24} fontSize={8} fill={MUTED}>
                남은 기대 손해
              </text>
              <text x={BAR_X + BAR_W + 12} y={24} fontSize={8} fontWeight={700} fill={MUTED}>
                합
              </text>

              {LEVELS.map((lv, i) => {
                const y = 36 + i * 30;
                if (i >= shown) {
                  return (
                    <g key={lv.label}>
                      <text x={BAR_X - 10} y={y + 13} textAnchor="end" fontSize={8.5} fill={MUTED} fillOpacity={0.4}>
                        {lv.label}
                      </text>
                    </g>
                  );
                }
                const bw = (lv.burden / MAX) * BAR_W;
                const ew = (expected(i) / MAX) * BAR_W;
                const isBest = step === 3 && i === best;
                return (
                  <g key={lv.label}>
                    <text x={BAR_X - 10} y={y + 13} textAnchor="end" fontSize={8.5} fontWeight={isBest ? 700 : 400} fill={isBest ? OK : MUTED}>
                      {lv.label}
                    </text>
                    <rect x={BAR_X} y={y} width={Math.max(bw, 0.6)} height={16} fill={ACCENT} fillOpacity={0.45} stroke={ACCENT} strokeWidth={1} />
                    <rect x={BAR_X + bw} y={y} width={Math.max(ew, 0.6)} height={16} fill={WARN} fillOpacity={0.4} stroke={WARN} strokeWidth={1} />
                    <text x={BAR_X + BAR_W + 12} y={y + 13} fontSize={9.5} fontWeight={700} fill={isBest ? OK : MUTED}>
                      {fmt(total(i))}
                    </text>
                    {isBest && (
                      <text x={BAR_X + BAR_W + 46} y={y + 13} fontSize={8.5} fontWeight={700} fill={OK}>
                        최소
                      </text>
                    )}
                  </g>
                );
              })}

              {step === 3 ? (
                <g>
                  <text x={BAR_X - 10} y={172} textAnchor="end" fontSize={8.5} fontWeight={700} fill={MUTED}>
                    한계 비교
                  </text>
                  <text x={BAR_X} y={172} fontSize={9} fontWeight={700} fill={OK}>
                    0→1 · {LEVELS[1].burden}을 써서 {fmt(expected(0) - expected(1))}을 줄임 · 한다
                  </text>
                  <text x={BAR_X} y={188} fontSize={9} fontWeight={700} fill={WARN}>
                    1→2 · {LEVELS[2].burden - LEVELS[1].burden}을 써서 {fmt(expected(1) - expected(2))}만 줄임 · 하지 않는다
                  </text>
                </g>
              ) : (
                <g>
                  <text x={BAR_X} y={172} fontSize={9} fill={MUTED}>
                    사고 손해 {LOSS} · 사고 확률 {pct(LEVELS[step].prob)}퍼센트
                  </text>
                  <text x={BAR_X} y={188} fontSize={9} fontWeight={700} fill={step === 1 ? OK : MUTED}>
                    지금까지 합이 가장 작은 것은 {fmt(Math.min(...LEVELS.slice(0, shown).map((_, i) => total(i))))}입니다
                  </text>
                </g>
              )}
            </svg>
          </div>

          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[step]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
