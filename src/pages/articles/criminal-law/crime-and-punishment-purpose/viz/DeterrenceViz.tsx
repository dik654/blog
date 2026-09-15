import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: deterrence 의 ExplainedFormula — 잡힐 확률과 형량의 곱, 그리고 둘이 같지 않은 이유 */
const SCENES = [
  "잡힐 확률이 높으면 형량이 낮아도 된다",
  "확률이 떨어지면 같은 형량으로는 막히지 않는다",
  "형량을 올려 메울 수는 있다",
  "그런데 둘은 바꿔 쓸 수 있는 값이 아니다",
] as const;

/** 범행으로 얻는 값 */
const GAIN = 8;
const SETUP = [
  { p: 0.3, s: 30 },
  { p: 0.05, s: 30 },
  { p: 0.05, s: 200 },
  { p: 0.05, s: 200 },
] as const;

/** 마지막 장면에서 같은 기대 제재를 만드는 조합들 */
const SAME = [
  { p: 0.5, s: 20 },
  { p: 0.2, s: 50 },
  { p: 0.05, s: 200 },
  { p: 0.01, s: 1000 },
] as const;

const OK = "#10b981";
const WARN = "#ef4444";
const ACCENT = "#6366f1";
const MUTED = "#94a3b8";

const fmt = (v: number) =>
  Math.abs(v - Math.round(v)) < 1e-9 ? `${Math.round(v)}` : v.toFixed(1);
const pct = (p: number) => `${Math.round(p * 1000) / 10}`;

const BAR_X = 146;
const BAR_W = 236;
const MAX = 12;

export default function DeterrenceViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const step = scenes.active;
  const { p, s } = SETUP[step];
  const expected = p * s;
  const deterred = expected > GAIN;

  const NOTES = [
    `범행으로 얻는 값이 ${GAIN}입니다. 잡힐 확률이 ${pct(p)}퍼센트이고 형량이 ${s}이면 기대 제재가 ${fmt(expected)}이라 ${GAIN}을 넘으므로 하지 않는 쪽이 낫습니다.`,
    `확률이 ${pct(p)}퍼센트로 떨어지면 같은 형량 ${s}으로도 기대 제재가 ${fmt(expected)}밖에 되지 않습니다. ${GAIN}에 못 미치므로 형량이 그대로여도 막히지 않습니다.`,
    `형량을 ${s}으로 올리면 기대 제재가 ${fmt(expected)}이 되어 다시 ${GAIN}을 넘습니다. 낮은 검거율을 형량으로 메운 것이고, 계산만 보면 처음과 같은 상태입니다.`,
    "그런데 같은 곱을 만드는 조합들이 같은 제도는 아닙니다. 확률을 올리려면 사람과 장비가 들고, 형량을 올리려면 가두는 비용과 오판의 대가가 커집니다. 그리고 같은 곱이라도 위험을 대하는 태도에 따라 억제 효과 자체가 달라집니다.",
  ] as const;

  return (
    <VizFrame
      eyebrow="억제"
      title="막는 힘은 잡힐 확률과 형량의 곱입니다"
      description="다만 같은 곱을 만드는 조합들이 같은 제도는 아닙니다."
      note={`범행으로 얻는 값을 ${GAIN}으로 고정하고 확률과 형량만 바꾼 예입니다. 사람이 이 계산을 실제로 한다고 두는 단순화이며, 충동이나 오판은 들어 있지 않습니다.`}
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="잡힐 확률과 형량의 조합"
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
                  <text x={BAR_X - 10} y={34} textAnchor="end" fontSize={9} fontWeight={700} fill={ACCENT}>
                    잡힐 확률
                  </text>
                  <text x={BAR_X} y={34} fontSize={10} fontWeight={700} fill={ACCENT}>
                    {pct(p)}퍼센트
                  </text>
                  <text x={BAR_X + 90} y={34} fontSize={9} fontWeight={700} fill={ACCENT}>
                    형량
                  </text>
                  <text x={BAR_X + 124} y={34} fontSize={10} fontWeight={700} fill={ACCENT}>
                    {s}
                  </text>

                  <text x={BAR_X - 10} y={76} textAnchor="end" fontSize={9} fontWeight={700} fill={deterred ? OK : WARN}>
                    기대 제재
                  </text>
                  <rect x={BAR_X} y={64} width={Math.max((expected / MAX) * BAR_W, 1)} height={18} fill={deterred ? OK : WARN} fillOpacity={0.45} stroke={deterred ? OK : WARN} strokeWidth={1} />
                  <text x={BAR_X + Math.max((expected / MAX) * BAR_W, 1) + 8} y={78} fontSize={10} fontWeight={700} fill={deterred ? OK : WARN}>
                    {fmt(expected)}
                  </text>
                  <text x={BAR_X - 10} y={90} textAnchor="end" fontSize={7.5} fill={MUTED}>
                    {pct(p)}% × {s}
                  </text>

                  <text x={BAR_X - 10} y={120} textAnchor="end" fontSize={9} fontWeight={700} fill={MUTED}>
                    범행으로 얻는 값
                  </text>
                  <rect x={BAR_X} y={108} width={(GAIN / MAX) * BAR_W} height={18} fill={MUTED} fillOpacity={0.3} stroke={MUTED} strokeWidth={1} />
                  <text x={BAR_X + (GAIN / MAX) * BAR_W + 8} y={122} fontSize={10} fontWeight={700} fill={MUTED}>
                    {GAIN}
                  </text>

                  <line x1={BAR_X + (GAIN / MAX) * BAR_W} y1={58} x2={BAR_X + (GAIN / MAX) * BAR_W} y2={132} stroke={MUTED} strokeWidth={1} strokeDasharray="4 3" />

                  <text x={BAR_X} y={158} fontSize={10} fontWeight={700} fill={deterred ? OK : WARN}>
                    {deterred ? "하지 않는 쪽이 낫습니다" : "막히지 않습니다"}
                  </text>
                  <text x={BAR_X} y={178} fontSize={9} fill={MUTED}>
                    {deterred
                      ? "기대 제재가 얻는 값을 넘습니다"
                      : "기대 제재가 얻는 값에 못 미칩니다"}
                  </text>
                </g>
              ) : (
                <g>
                  <text x={40} y={28} fontSize={9} fontWeight={700} fill={MUTED}>
                    같은 기대 제재 {fmt(SAME[0].p * SAME[0].s)}을 만드는 조합들
                  </text>
                  {SAME.map((row, i) => {
                    const y = 42 + i * 26;
                    return (
                      <g key={i}>
                        <text x={120} y={y + 12} textAnchor="end" fontSize={9.5} fontWeight={700} fill={ACCENT}>
                          확률 {pct(row.p)}% · 형량 {row.s}
                        </text>
                        <rect x={128} y={y} width={row.p * 150} height={14} fill={ACCENT} fillOpacity={0.35} stroke={ACCENT} strokeWidth={1} />
                        <rect x={286} y={y} width={(row.s / 1000) * 150} height={14} fill={WARN} fillOpacity={0.35} stroke={WARN} strokeWidth={1} />
                        <text x={444} y={y + 12} fontSize={9} fontWeight={700} fill={MUTED}>
                          {fmt(row.p * row.s)}
                        </text>
                      </g>
                    );
                  })}
                  <text x={128} y={160} fontSize={8} fill={ACCENT}>
                    잡는 데 드는 자원
                  </text>
                  <text x={286} y={160} fontSize={8} fill={WARN}>
                    가두는 비용과 오판의 대가
                  </text>
                  <text x={40} y={182} fontSize={9} fontWeight={700} fill={WARN}>
                    곱이 같아도 드는 비용이 다르고, 위험을 대하는 태도에 따라 효과도 다릅니다
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
