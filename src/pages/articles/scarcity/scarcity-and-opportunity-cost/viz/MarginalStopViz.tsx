import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: margin 절의 ExplainedFormula — 한 단위 더의 값과 값이 같아지는 곳에서 멈춘다 */
const SCENES = ["한 판째", "세 판째까지", "네 판째가 답", "다섯 판째는 밑짐"] as const;

/** 장면마다 몇 판째까지 보여 줄지 */
const SHOW = [1, 3, 4, 5] as const;

/** q번째 판 하나가 더 벌어 주는 것과, 그 판 하나에 더 드는 것 (천원) */
const gain = (q: number) => 48 - 5 * q;
const spend = (q: number) => 12 + 3 * q;
const step = (q: number) => gain(q) - spend(q);
const upTo = (q: number) =>
  Array.from({ length: q }, (_, i) => step(i + 1)).reduce((a, b) => a + b, 0);

const LAST = 5;
const BEST = Array.from({ length: LAST }, (_, i) => i + 1).reduce((a, b) =>
  upTo(b) > upTo(a) ? b : a,
);

const OK = "#10b981";
const WARN = "#ef4444";
const ACCENT = "#6366f1";
const MUTED = "#94a3b8";

const ROW_X = 96;
const BAR_W = 108;
const MAX = 48;

export default function MarginalStopViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const s = scenes.active;
  const shown = SHOW[s] ?? 1;

  const NOTES = [
    `첫 판은 ${gain(1)}을 벌어 주고 ${spend(1)}이 듭니다. ${step(1)}이 남으니 굽습니다. 여기서 보는 것은 가게 전체의 이익이 아니라 이 한 판이 더 벌어 주는 것과 더 드는 것뿐입니다.`,
    `판이 늘수록 벌어 주는 쪽은 ${gain(1) - gain(2)}씩 줄고 드는 쪽은 ${spend(2) - spend(1)}씩 늘어, 남는 폭이 판마다 ${step(1) - step(2)}씩 깎입니다. 세 판째도 ${step(3)}이 남아 굽고 누적은 ${upTo(3)}이 됩니다.`,
    `네 판째는 ${gain(4)}과 ${spend(4)}이라 겨우 ${step(4)}이 남습니다. 그래도 남으므로 굽고 누적은 ${upTo(4)}으로 가장 큽니다. 적게 남는 것과 밑지는 것은 다릅니다.`,
    `다섯 판째는 ${gain(5)}을 벌어 주는데 ${spend(5)}이 들어 ${step(5)}입니다. 굽는다면 누적이 ${upTo(4)}에서 ${upTo(5)}으로 내려가므로 굽지 않습니다. 그래서 답은 ${BEST}판입니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="몇 개까지 할 것인가"
      title="전부냐 아니냐가 아니라 한 단위 더냐를 묻습니다"
      description="한 판이 더 벌어 주는 것과 그 판에 더 드는 것을 견주면, 멈출 자리가 계산 없이도 드러납니다."
      note="벌어 주는 것이 판마다 줄고 드는 것이 판마다 느는 경우입니다. 두 값이 반대로 움직이지 않으면 멈출 자리가 이렇게 깔끔하게 잡히지 않습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="한 단위 더의 셈"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(s + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[s]}</h4>

          <div className="mt-4 w-full min-w-0 overflow-x-auto">
            <svg
              viewBox="0 0 480 200"
              role="img"
              aria-label={SCENES[s]}
              className="h-auto w-full min-w-[30rem] max-w-2xl"
            >
              <text x={ROW_X - 8} y={22} textAnchor="end" fontSize={8} fontWeight={700} fill={MUTED}>
                몇 판째
              </text>
              <text x={ROW_X} y={22} fontSize={8} fill={MUTED}>
                더 버는 것
              </text>
              <text x={ROW_X + BAR_W + 24} y={22} fontSize={8} fill={MUTED}>
                더 드는 것
              </text>
              <text x={ROW_X + 2 * BAR_W + 48} y={22} fontSize={8} fill={MUTED}>
                그 판의 순
              </text>
              <text x={ROW_X + 2 * BAR_W + 116} y={22} fontSize={8} fontWeight={700} fill={MUTED}>
                누적
              </text>

              {Array.from({ length: LAST }, (_, i) => i + 1).map((q) => {
                const y = 32 + (q - 1) * 26;
                if (q > shown) {
                  return (
                    <text
                      key={q}
                      x={ROW_X - 8}
                      y={y + 12}
                      textAnchor="end"
                      fontSize={8.5}
                      fill={MUTED}
                      fillOpacity={0.35}
                    >
                      {q}판
                    </text>
                  );
                }
                const gw = (gain(q) / MAX) * BAR_W;
                const sw = (spend(q) / MAX) * BAR_W;
                const positive = step(q) > 0;
                const isBest = s === SCENES.length - 1 && q === BEST;
                return (
                  <g key={q}>
                    <text
                      x={ROW_X - 8}
                      y={y + 12}
                      textAnchor="end"
                      fontSize={8.5}
                      fontWeight={isBest ? 700 : 400}
                      fill={isBest ? OK : MUTED}
                    >
                      {q}판
                    </text>
                    <rect x={ROW_X} y={y} width={Math.max(gw, 0.6)} height={14} fill={ACCENT} fillOpacity={0.4} stroke={ACCENT} strokeWidth={1} />
                    <text x={ROW_X + gw + 4} y={y + 11} fontSize={8} fill={MUTED}>
                      {gain(q)}
                    </text>
                    <rect x={ROW_X + BAR_W + 24} y={y} width={Math.max(sw, 0.6)} height={14} fill={MUTED} fillOpacity={0.35} stroke={MUTED} strokeWidth={1} />
                    <text x={ROW_X + BAR_W + 24 + sw + 4} y={y + 11} fontSize={8} fill={MUTED}>
                      {spend(q)}
                    </text>
                    <text
                      x={ROW_X + 2 * BAR_W + 48}
                      y={y + 11}
                      fontSize={9}
                      fontWeight={700}
                      fill={positive ? OK : WARN}
                    >
                      {positive ? "+" : ""}
                      {step(q)}
                    </text>
                    <text
                      x={ROW_X + 2 * BAR_W + 116}
                      y={y + 11}
                      fontSize={9}
                      fontWeight={700}
                      fill={isBest ? OK : MUTED}
                    >
                      {upTo(q)}
                      {isBest ? " ←" : ""}
                    </text>
                  </g>
                );
              })}

              <line x1={ROW_X - 60} y1={168} x2={460} y2={168} stroke={MUTED} strokeWidth={0.75} strokeOpacity={0.5} />
              <text x={ROW_X - 8} y={186} textAnchor="end" fontSize={8.5} fontWeight={700} fill={MUTED}>
                지금 판정
              </text>
              <text
                x={ROW_X}
                y={186}
                fontSize={9.5}
                fontWeight={700}
                fill={step(shown) > 0 ? OK : WARN}
              >
                {step(shown) > 0
                  ? `${shown}판째는 ${gain(shown)} > ${spend(shown)}이므로 굽습니다`
                  : `${shown}판째는 ${gain(shown)} < ${spend(shown)}이므로 여기서 멈춥니다`}
              </text>
            </svg>
          </div>

          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[s]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
