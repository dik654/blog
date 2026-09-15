import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: threshold 의 ExplainedFormula — 두 오판 비용의 비가 문턱을 정한다 */
const SCENES = [
  "두 잘못이 같은 무게라면",
  "열 배 무겁다면",
  "백 배 무겁다면",
  "문턱을 옮겨 쓰면 어떻게 되는가",
] as const;

/** 무고한 유죄의 무게가 놓아주는 것의 몇 배인가 */
const RATIOS = [1, 10, 100] as const;

const OK = "#10b981";
const WARN = "#ef4444";
const ACCENT = "#6366f1";
const MUTED = "#94a3b8";

const threshold = (r: number) => r / (1 + r);
const pct = (v: number) => `${Math.round(v * 1000) / 10}`;

const X0 = 60;
const SPAN = 360;
const toX = (p: number) => X0 + p * SPAN;

export default function ProofThresholdViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const step = scenes.active;
  const r = RATIOS[Math.min(step, RATIOS.length - 1)];
  const t = threshold(r);

  const NOTES = [
    `무고한 유죄와 놓아주는 것의 무게가 같다면 문턱은 ${pct(t)}퍼센트입니다. 조금이라도 더 그럴듯한 쪽으로 정하면 된다는 뜻이고, 사인끼리 다투는 사건에서 쓰는 기준이 여기 가깝습니다.`,
    `무고한 유죄가 ${r}배 무겁다면 문턱은 ${pct(t)}퍼센트로 올라갑니다. 열 명을 놓치더라도 한 명을 잘못 벌하지 말라는 말이 이 비를 고른 것이고, 그 비가 이 문턱을 만듭니다.`,
    `${r}배로 두면 문턱이 ${pct(t)}퍼센트가 됩니다. 비를 올릴수록 문턱은 1에 가까워지지만 결코 1이 되지는 않습니다. 확실해야 한다는 말이 완전히 확실해야 한다는 뜻일 수는 없습니다.`,
    "문턱을 맞바꿔 쓰면 두 방향으로 어긋납니다. 사인끼리 다투는 사건에 형사 문턱을 쓰면 옳은 청구의 대부분이 기각되고, 형사 사건에 사인 사이의 문턱을 쓰면 무고한 유죄가 크게 늘어납니다.",
  ] as const;

  return (
    <VizFrame
      eyebrow="문턱"
      title="얼마나 확실해야 벌할 수 있는지는 두 잘못의 무게가 정합니다"
      description="무게가 같으면 반반이고, 한쪽이 무거우면 그만큼 옮겨 갑니다."
      note="두 잘못의 무게를 같은 단위로 견줄 수 있다고 둔 계산입니다. 실제로는 그 비를 정하는 일 자체가 사회의 선택입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="오판 비용의 비와 유죄 문턱"
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
              {step < 3 ? (
                <g>
                  <text x={X0} y={30} fontSize={9} fontWeight={700} fill={MUTED}>
                    무고한 유죄가 놓아주는 것보다
                  </text>
                  <text x={X0 + 150} y={30} fontSize={11} fontWeight={700} fill={WARN}>
                    {r}배 무겁다
                  </text>

                  <rect x={X0} y={52} width={toX(t) - X0} height={22} fill={OK} fillOpacity={0.18} stroke={OK} strokeWidth={1} />
                  <rect x={toX(t)} y={52} width={toX(1) - toX(t)} height={22} fill={WARN} fillOpacity={0.25} stroke={WARN} strokeWidth={1} />
                  <text x={X0 + 8} y={67} fontSize={8.5} fontWeight={700} fill={OK}>
                    무죄
                  </text>
                  <text x={toX(1) - 8} y={67} textAnchor="end" fontSize={8.5} fontWeight={700} fill={WARN}>
                    유죄
                  </text>

                  <line x1={toX(t)} y1={44} x2={toX(t)} y2={96} stroke={ACCENT} strokeWidth={1.25} />
                  <text x={toX(t)} y={40} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={ACCENT}>
                    문턱 {pct(t)}%
                  </text>

                  <line x1={X0} y1={104} x2={X0 + SPAN} y2={104} stroke={MUTED} strokeWidth={1} />
                  {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
                    <g key={tick}>
                      <line x1={toX(tick)} y1={100} x2={toX(tick)} y2={108} stroke={MUTED} strokeWidth={1} />
                      <text x={toX(tick)} y={120} textAnchor="middle" fontSize={8} fill={MUTED}>
                        {pct(tick)}%
                      </text>
                    </g>
                  ))}
                  <text x={X0 + SPAN} y={136} textAnchor="end" fontSize={8} fill={MUTED}>
                    증거를 본 뒤의 유죄 확률
                  </text>

                  <text x={X0} y={162} fontSize={9.5} fontWeight={700} fill={ACCENT}>
                    문턱 = 비 ÷ (1 + 비) = {r} ÷ {1 + r} = {pct(t)}퍼센트
                  </text>
                  <text x={X0} y={182} fontSize={9} fill={MUTED}>
                    {r === 1
                      ? "조금이라도 더 그럴듯한 쪽으로 정하면 됩니다"
                      : "비를 올릴수록 문턱은 1에 가까워지되 1이 되지는 않습니다"}
                  </text>
                </g>
              ) : (
                <g>
                  <text x={36} y={28} fontSize={9} fontWeight={700} fill={MUTED}>
                    문턱을 맞바꿔 쓰면
                  </text>
                  {[
                    {
                      label: "사인 사이 다툼에 형사 문턱",
                      detail: `${pct(threshold(10))}퍼센트를 넘지 못한 옳은 청구가 전부 기각됩니다`,
                      color: WARN,
                    },
                    {
                      label: "형사 사건에 사인 사이 문턱",
                      detail: `${pct(threshold(1))}퍼센트만 넘으면 벌하게 되어 무고한 유죄가 크게 늘어납니다`,
                      color: WARN,
                    },
                    {
                      label: "각자 제 문턱을 쓰면",
                      detail: "두 잘못의 무게 차이가 각 영역에서 그대로 반영됩니다",
                      color: OK,
                    },
                  ].map((row, i) => (
                    <g key={row.label}>
                      <rect x={36} y={42 + i * 40} width={172} height={30} rx={4} fill={row.color} fillOpacity={0.1} stroke={row.color} strokeWidth={1} />
                      <text x={122} y={61 + i * 40} textAnchor="middle" fontSize={9} fontWeight={700} fill={row.color}>
                        {row.label}
                      </text>
                      <text x={220} y={61 + i * 40} fontSize={9} fill={MUTED}>
                        {row.detail}
                      </text>
                    </g>
                  ))}
                  <text x={36} y={180} fontSize={9.5} fontWeight={700} fill={ACCENT}>
                    문턱이 다른 것은 기준이 느슨해서가 아니라 무게가 다르기 때문입니다
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
