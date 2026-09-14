import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: rent-seeking 의 ExplainedFormula — 경쟁자가 늘수록 지대 전체가 소모된다 */
const SCENES = [
  "둘이 다투면 절반이 사라진다",
  "넷이면 넷 중 셋이 사라진다",
  "열이면 거의 다 사라진다",
  "그래서 다툼 자체가 비용이다",
] as const;

const V = 1000; // 억 원 단위로 둔 특혜의 가치
const COUNTS = [2, 4, 10] as const;
const CURVE = [2, 3, 4, 6, 10, 20] as const;

const ACCENT = "#6366f1";
const WARN = "#ef4444";
const OK = "#10b981";
const MUTED = "#94a3b8";

/** 대칭 균형에서 한 명이 쓰는 금액과 전체 지출 */
const spendEach = (n: number) => (V * (n - 1)) / (n * n);
const spendTotal = (n: number) => (V * (n - 1)) / n;

const fmt = (v: number) => (Number.isInteger(v) ? `${v}` : v.toFixed(1));

const BAR_X = 120;
const BAR_W = 280;

export default function RentSeekingViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const step = scenes.active;
  const n = step < 3 ? COUNTS[step] : COUNTS[COUNTS.length - 1];
  const each = spendEach(n);
  const total = spendTotal(n);

  const NOTES = [
    `가치 ${V}억짜리 특혜를 ${n}곳이 놓고 다툽니다. 균형에서 각자 ${fmt(each)}억을 쓰고 합계가 ${fmt(total)}억이 되어, 특혜 가치의 ${fmt((total / V) * 100)}퍼센트가 가져가는 일이 아니라 다투는 일에 들어갑니다.`,
    `경쟁자가 ${n}곳이 되면 한 곳이 쓰는 돈은 ${fmt(each)}억으로 오히려 줄지만 합계는 ${fmt(total)}억으로 늘어 ${fmt((total / V) * 100)}퍼센트가 됩니다. 각자는 덜 쓰는데 사회 전체는 더 씁니다.`,
    `${n}곳이면 각자 ${fmt(each)}억이고 합계는 ${fmt(total)}억이라 특혜 가치의 ${fmt((total / V) * 100)}퍼센트가 됩니다. 경쟁자를 더 늘려도 합계는 전체에 가까워지기만 하고 넘지는 않습니다.`,
    "지출의 대부분은 진 쪽의 것이라 아무것도 남기지 않습니다. 특혜를 누가 가져가느냐는 자리를 옮기는 문제지만, 가져가려고 쓴 돈은 통째로 사라지는 문제입니다.",
  ] as const;

  return (
    <VizFrame
      eyebrow="지대 추구"
      title="특혜를 놓고 다투는 비용이 특혜만큼 커집니다"
      description="누가 가져가느냐는 옮기는 문제지만, 가져가려고 쓰는 돈은 사라지는 문제입니다."
      note="승리 확률이 자기 지출의 비중과 같고 모두의 조건이 같다고 둔 계산입니다. 실제로는 연줄과 정보가 비대칭이라 같은 돈이 같은 확률을 사지 않습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="경쟁자 수와 지대 소모"
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
              {step < 3 && (
                <g>
                  <text x={BAR_X - 10} y={40} textAnchor="end" fontSize={9} fontWeight={700} fill={ACCENT}>
                    특혜 가치
                  </text>
                  <rect x={BAR_X} y={28} width={BAR_W} height={16} fill={ACCENT} fillOpacity={0.18} stroke={ACCENT} strokeWidth={1} />
                  <text x={BAR_X + BAR_W + 10} y={40} fontSize={9} fontWeight={700} fill={ACCENT}>
                    {V}억
                  </text>

                  <text x={BAR_X - 10} y={72} textAnchor="end" fontSize={9} fontWeight={700} fill={MUTED}>
                    경쟁자 {n}곳
                  </text>
                  {Array.from({ length: n }, (_, i) => (
                    <rect
                      key={i}
                      x={BAR_X + (i * BAR_W) / n}
                      y={60}
                      width={(each / V) * BAR_W}
                      height={16}
                      fill={WARN}
                      fillOpacity={0.22}
                      stroke={WARN}
                      strokeWidth={1}
                    />
                  ))}
                  <text x={BAR_X + BAR_W + 10} y={72} fontSize={9} fill={MUTED}>
                    각 {fmt(each)}억
                  </text>

                  <text x={BAR_X - 10} y={108} textAnchor="end" fontSize={9} fontWeight={700} fill={WARN}>
                    합계 지출
                  </text>
                  <rect x={BAR_X} y={96} width={(total / V) * BAR_W} height={16} fill={WARN} fillOpacity={0.5} stroke={WARN} strokeWidth={1} />
                  <text x={BAR_X + BAR_W + 10} y={108} fontSize={9} fontWeight={700} fill={WARN}>
                    {fmt(total)}억
                  </text>
                  <line x1={BAR_X + BAR_W} y1={24} x2={BAR_X + BAR_W} y2={116} stroke={ACCENT} strokeWidth={1} strokeDasharray="4 3" />

                  <text x={BAR_X} y={140} fontSize={9.5} fontWeight={700} fill={WARN}>
                    특혜 가치의 {fmt((total / V) * 100)}퍼센트가 다투는 데 들어갑니다
                  </text>
                  <text x={BAR_X} y={160} fontSize={9} fill={MUTED}>
                    한 곳이 쓰는 돈은 {fmt(each)}억이고, 경쟁자가 늘수록 이 값은 줄어듭니다
                  </text>
                  <text x={BAR_X} y={176} fontSize={9} fill={MUTED}>
                    그런데 합계는 늘어납니다
                  </text>
                </g>
              )}

              {step === 3 && (
                <g>
                  <text x={40} y={26} fontSize={9} fontWeight={700} fill={MUTED}>
                    경쟁자 수와 합계 지출
                  </text>
                  {CURVE.map((count, i) => {
                    const t = spendTotal(count);
                    const y = 40 + i * 20;
                    return (
                      <g key={count}>
                        <text x={74} y={y + 11} textAnchor="end" fontSize={9} fontWeight={700} fill={MUTED}>
                          {count}곳
                        </text>
                        <rect x={80} y={y} width={(t / V) * 260} height={13} fill={WARN} fillOpacity={0.45} stroke={WARN} strokeWidth={1} />
                        <text x={348} y={y + 11} fontSize={9} fontWeight={700} fill={WARN}>
                          {fmt((t / V) * 100)}%
                        </text>
                      </g>
                    );
                  })}
                  <line x1={80 + 260} y1={36} x2={80 + 260} y2={168} stroke={ACCENT} strokeWidth={1} strokeDasharray="4 3" />
                  <text x={80 + 260} y={180} textAnchor="middle" fontSize={8} fontWeight={700} fill={ACCENT}>
                    특혜 가치 100%
                  </text>
                  <text x={400} y={60} fontSize={9} fontWeight={700} fill={OK}>
                    한 곳만
                  </text>
                  <text x={400} y={74} fontSize={9} fill={MUTED}>
                    가져가고
                  </text>
                  <text x={400} y={92} fontSize={9} fontWeight={700} fill={WARN}>
                    나머지 지출은
                  </text>
                  <text x={400} y={106} fontSize={9} fill={MUTED}>
                    사라집니다
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
