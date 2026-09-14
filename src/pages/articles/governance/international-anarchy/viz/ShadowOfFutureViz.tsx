import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: shadow 의 ExplainedFormula — 미래의 몫이 문턱을 넘어야 협력이 유지된다 */
const SCENES = [
  "미래가 가벼우면 배신이 낫다",
  "딱 경계에서는 두 값이 같다",
  "미래가 무거우면 협력이 낫다",
  "배신의 이득이 커지면 문턱이 올라간다",
] as const;

/** 배신 유혹 T, 함께 협력 R, 함께 배신 P, 혼자 당함 S */
const T = 5;
const R = 3;
const P = 1;
const S = 0;

const DELTAS = [0.3, 0.5, 0.8] as const;
const TEMPTATIONS = [4, 5, 7, 11] as const;

const ACCENT = "#6366f1";
const OK = "#10b981";
const WARN = "#ef4444";
const MUTED = "#94a3b8";

const keepCooperating = (d: number) => R / (1 - d);
const defectOnce = (d: number) => T + (d * P) / (1 - d);
const threshold = (t: number) => (t - R) / (t - P);

const fmt = (v: number) =>
  Math.abs(v - Math.round(v)) < 1e-9 ? `${Math.round(v)}` : v.toFixed(2);

const BAR_X = 150;
const BAR_W = 220;
const MAX = 16;

export default function ShadowOfFutureViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const step = scenes.active;
  const delta = DELTAS[Math.min(step, DELTAS.length - 1)];
  const coop = keepCooperating(delta);
  const defect = defectOnce(delta);
  const star = threshold(T);

  const NOTES = [
    `다음에 또 만날 몫을 ${delta}로 두면 계속 협력했을 때의 값이 ${fmt(coop)}이고, 한 번 배신하고 이후 관계가 나빠졌을 때가 ${fmt(defect)}입니다. 배신 쪽이 크므로 약속이 서지 않습니다.`,
    `몫이 ${delta}이면 두 값이 ${fmt(coop)}으로 정확히 같아집니다. 이 지점이 문턱이며, 배신 유혹 ${T}, 함께 협력 ${R}, 함께 배신 ${P}에서 (${T}−${R})÷(${T}−${P}) = ${fmt(star)}으로 계산됩니다.`,
    `몫이 ${delta}이면 계속 협력이 ${fmt(coop)}, 한 번 배신이 ${fmt(defect)}입니다. 강제할 곳이 없어도 약속이 서는 것은 앞으로 만날 횟수가 충분히 많을 때입니다.`,
    "문턱은 고정된 수가 아닙니다. 한 번 어겨서 얻는 것이 클수록 필요한 미래의 몫이 커지고, 함께 협력해서 얻는 것이 크거나 함께 어겼을 때의 손해가 클수록 작아집니다.",
  ] as const;

  return (
    <VizFrame
      eyebrow="미래의 그림자"
      title="강제할 곳이 없어도 약속이 서는 조건이 있습니다"
      description="한 번 어겨서 얻는 것과 관계를 계속 이어서 얻는 것을 견주면 문턱이 나옵니다."
      note={`한 번 어겨서 얻는 값 ${T}, 함께 지켰을 때 ${R}, 함께 어겼을 때 ${P}, 혼자 당했을 때 ${S}로 둔 예입니다. 어기면 이후 협력이 돌아오지 않는다는 가장 단순한 대응을 가정했습니다.`}
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="미래의 몫과 협력의 문턱"
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
                  <text x={BAR_X - 10} y={38} textAnchor="end" fontSize={9} fontWeight={700} fill={ACCENT}>
                    다음에 또 만날 몫
                  </text>
                  <rect x={BAR_X} y={26} width={delta * BAR_W} height={14} fill={ACCENT} fillOpacity={0.25} stroke={ACCENT} strokeWidth={1} />
                  <text x={BAR_X + BAR_W + 10} y={38} fontSize={9} fontWeight={700} fill={ACCENT}>
                    {delta}
                  </text>
                  <line x1={BAR_X + star * BAR_W} y1={22} x2={BAR_X + star * BAR_W} y2={44} stroke={WARN} strokeWidth={1} strokeDasharray="3 3" />
                  <text x={BAR_X + star * BAR_W} y={18} textAnchor="middle" fontSize={8} fontWeight={700} fill={WARN}>
                    문턱 {fmt(star)}
                  </text>

                  <text x={BAR_X - 10} y={82} textAnchor="end" fontSize={9} fontWeight={700} fill={OK}>
                    계속 협력할 때
                  </text>
                  <rect x={BAR_X} y={70} width={(coop / MAX) * BAR_W} height={16} fill={OK} fillOpacity={0.45} stroke={OK} strokeWidth={1} />
                  <text x={BAR_X + (coop / MAX) * BAR_W + 8} y={82} fontSize={9.5} fontWeight={700} fill={OK}>
                    {fmt(coop)}
                  </text>

                  <text x={BAR_X - 10} y={116} textAnchor="end" fontSize={9} fontWeight={700} fill={WARN}>
                    한 번 어길 때
                  </text>
                  <rect x={BAR_X} y={104} width={(defect / MAX) * BAR_W} height={16} fill={WARN} fillOpacity={0.45} stroke={WARN} strokeWidth={1} />
                  <text x={BAR_X + (defect / MAX) * BAR_W + 8} y={116} fontSize={9.5} fontWeight={700} fill={WARN}>
                    {fmt(defect)}
                  </text>

                  <text x={BAR_X} y={148} fontSize={9.5} fontWeight={700} fill={coop > defect ? OK : coop === defect ? MUTED : WARN}>
                    {coop > defect
                      ? "협력이 유리합니다 · 약속이 스스로 섭니다"
                      : coop === defect
                        ? "두 값이 같습니다 · 여기가 경계입니다"
                        : "배신이 유리합니다 · 약속이 서지 않습니다"}
                  </text>
                  <text x={BAR_X} y={168} fontSize={8.5} fill={MUTED}>
                    계속 협력 = {R} ÷ (1 − {delta}) · 한 번 어김 = {T} + {delta} × {P} ÷ (1 − {delta})
                  </text>
                </g>
              )}

              {step === 3 && (
                <g>
                  <text x={40} y={26} fontSize={9} fontWeight={700} fill={MUTED}>
                    한 번 어겨서 얻는 값과 그때 필요한 미래의 몫
                  </text>
                  {TEMPTATIONS.map((t, i) => {
                    const s = threshold(t);
                    const y = 44 + i * 26;
                    return (
                      <g key={t}>
                        <text x={94} y={y + 12} textAnchor="end" fontSize={9} fontWeight={700} fill={MUTED}>
                          어기면 {t}
                        </text>
                        <rect x={100} y={y} width={s * 260} height={14} fill={WARN} fillOpacity={0.4} stroke={WARN} strokeWidth={1} />
                        <text x={370} y={y + 12} fontSize={9} fontWeight={700} fill={WARN}>
                          문턱 {fmt(s)}
                        </text>
                      </g>
                    );
                  })}
                  <line x1={360} y1={40} x2={360} y2={152} stroke={MUTED} strokeWidth={1} strokeDasharray="4 3" />
                  <text x={360} y={164} textAnchor="middle" fontSize={8} fill={MUTED}>
                    몫의 최대값 1
                  </text>
                  <text x={40} y={182} fontSize={9} fill={MUTED}>
                    함께 지켰을 때 {R}, 함께 어겼을 때 {P}는 그대로 두고 어겼을 때의 값만 바꿨습니다
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
