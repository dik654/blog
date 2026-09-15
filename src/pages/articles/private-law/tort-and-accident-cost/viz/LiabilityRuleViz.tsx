import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: which-rule — 규칙에 따라 누구의 주의가 움직이는가 */
const SCENES = [
  "아무도 책임지지 않게 두면",
  "일으킨 쪽이 무조건 물면",
  "기준을 두고 그 기준을 넘겼을 때만 물면",
  "기준을 낮게 잡으면 거기서 멈춘다",
] as const;

const OK = "#10b981";
const WARN = "#ef4444";
const ACCENT = "#6366f1";
const MUTED = "#94a3b8";

type Side = {
  injurer: boolean;
  victim: boolean;
  note: string;
  injurerText?: string;
  injurerWhy?: string;
};

const RULES: Array<{ title: string; detail: string } & Side> = [
  {
    title: "책임 없음",
    detail: "손해는 난 자리에 남는다",
    injurer: false,
    victim: true,
    note: "일으킨 쪽은 물지 않으므로 조심할 이유가 없습니다",
  },
  {
    title: "무과실 책임",
    detail: "일으킨 쪽이 결과만으로 문다",
    injurer: true,
    victim: false,
    note: "당한 쪽은 어차피 다 받으므로 조심할 이유가 없습니다",
  },
  {
    title: "과실 책임",
    detail: "기준을 넘겼을 때만 문다",
    injurer: true,
    victim: true,
    note: "기준을 맞추면 면하므로 맞추고, 남은 손해는 당한 쪽이 지므로 그쪽도 조심합니다",
  },
  {
    title: "기준이 낮은 과실 책임",
    detail: "기준이 최적보다 아래에 있다",
    injurer: false,
    victim: true,
    injurerText: "낮은 기준까지만 조심한다",
    injurerWhy: "그 위로는 조심해도 면책이 달라지지 않음",
    note: "기준만 맞추면 면하므로 그 낮은 기준에서 멈춥니다",
  },
];

const CX = 150;
const CW = 130;

export default function LiabilityRuleViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const step = scenes.active;
  const rule = RULES[step];
  const both = rule.injurer && rule.victim;

  const NOTES = [
    "손해를 난 자리에 그대로 두면 일으킨 쪽은 아무것도 물지 않습니다. 조심하는 데 드는 비용만 자기 몫이 되므로 조심할 이유가 없습니다. 당한 쪽만 혼자 조심합니다.",
    "결과만으로 물게 하면 반대가 됩니다. 일으킨 쪽은 이제 사고 손해를 자기 것으로 보고 앞 절의 계산을 하지만, 당한 쪽은 어차피 다 받으므로 조심할 이유가 사라집니다.",
    "기준을 두고 그 기준을 넘겼을 때만 물게 하면 둘 다 움직입니다. 일으킨 쪽은 기준을 맞춰 책임을 면하려 하고, 기준을 맞춘 사고의 손해는 당한 쪽에 남으므로 당한 쪽도 조심합니다.",
    "다만 이 결과는 기준이 옳게 잡혔을 때의 이야기입니다. 기준이 최적보다 낮으면 일으킨 쪽은 그 낮은 기준까지만 조심하고 멈춥니다. 규칙의 이름이 아니라 기준의 위치가 결과를 정합니다.",
  ] as const;

  return (
    <VizFrame
      eyebrow="책임 규칙"
      title="같은 사고라도 규칙에 따라 누가 조심하는지가 달라집니다"
      description="손해를 지는 쪽만 앞 절의 계산을 하게 됩니다."
      note="양쪽 모두 조심할 수 있는 사고를 전제한 비교입니다. 한쪽만 조심할 수 있는 사고에서는 그쪽에 손해를 지우는 것으로 충분합니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="책임 규칙별 주의 유인"
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
              <rect x={30} y={26} width={104} height={44} rx={4} fill={ACCENT} fillOpacity={0.12} stroke={ACCENT} strokeWidth={1} />
              <text x={82} y={44} textAnchor="middle" fontSize={10} fontWeight={700} fill={ACCENT}>
                {rule.title}
              </text>
              <text x={82} y={58} textAnchor="middle" fontSize={7} fill={MUTED}>
                {rule.detail}
              </text>

              {[
                {
                  label: "일으킨 쪽",
                  takes: rule.injurer,
                  text: rule.injurerText,
                  why: rule.injurerWhy,
                },
                { label: "당한 쪽", takes: rule.victim, text: undefined, why: undefined },
              ].map((side, i) => {
                const x = CX + i * (CW + 20);
                const color = side.takes ? OK : WARN;
                return (
                  <g key={side.label}>
                    <rect x={x} y={26} width={CW} height={62} rx={4} fill={color} fillOpacity={0.1} stroke={color} strokeWidth={1} />
                    <text x={x + CW / 2} y={45} textAnchor="middle" fontSize={10} fontWeight={700} fill={color}>
                      {side.label}
                    </text>
                    <text x={x + CW / 2} y={64} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>
                      {side.text ?? (side.takes ? "조심한다" : "조심하지 않는다")}
                    </text>
                    <text x={x + CW / 2} y={79} textAnchor="middle" fontSize={7.5} fill={MUTED}>
                      {side.why ?? (side.takes ? "손해가 자기 몫이 됨" : "조심해도 얻는 것이 없음")}
                    </text>
                  </g>
                );
              })}

              <rect x={30} y={104} width={420} height={28} rx={4} fill={both ? OK : WARN} fillOpacity={0.08} stroke={both ? OK : WARN} strokeWidth={1} />
              <text x={240} y={122} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={both ? OK : WARN}>
                {both ? "양쪽 다 조심합니다" : "한쪽의 주의가 모자랍니다"}
              </text>

              <text x={30} y={154} fontSize={9} fill={MUTED}>
                {rule.note}
              </text>

              {step === 3 && (
                <text x={30} y={178} fontSize={9} fontWeight={700} fill={WARN}>
                  규칙의 이름이 아니라 기준의 위치가 결과를 정합니다
                </text>
              )}
              {step === 2 && (
                <text x={30} y={178} fontSize={9} fontWeight={700} fill={OK}>
                  기준이 옳게 잡혔다는 전제에서만 이렇게 됩니다
                </text>
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
