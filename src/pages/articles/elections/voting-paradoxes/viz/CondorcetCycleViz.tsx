import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: overview·cycle·agenda — 개인 선호는 멀쩡한데 집단 결과만 순환한다 */
const SCENES = [
  "세 사람의 선호는 각자 멀쩡하다",
  "둘씩 붙이면 전부 2대 1로 갈린다",
  "그래서 이기는 순서가 원을 그린다",
  "순서를 쥔 사람이 우승자를 정한다",
] as const;

const OPTIONS = ["가안", "나안", "다안"] as const;
const SHORT = ["가", "나", "다"] as const;
const COLORS = ["#6366f1", "#f59e0b", "#10b981"];
const WARN = "#ef4444";
const MUTED = "#94a3b8";

/** 유권자별 선호 순서. 값은 OPTIONS의 index이며 앞에 올수록 더 원한다 */
const PREFS: number[][] = [
  [0, 1, 2],
  [1, 2, 0],
  [2, 0, 1],
];

const rank = (voter: number, option: number) => PREFS[voter].indexOf(option);

/** a와 b를 붙였을 때 a를 더 원하는 사람 수 */
const support = (a: number, b: number) =>
  PREFS.filter((_, v) => rank(v, a) < rank(v, b)).length;

const beats = (a: number, b: number) => support(a, b) > PREFS.length / 2;

const PAIRS: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 0],
];

/** 먼저 둘을 붙이고 이긴 쪽을 남은 하나와 붙이는 2단계 의사일정 */
const AGENDAS: Array<[number, number, number]> = [
  [0, 1, 2],
  [1, 2, 0],
  [0, 2, 1],
];

function runAgenda([a, b, c]: [number, number, number]) {
  const first = beats(a, b) ? a : b;
  return beats(first, c) ? first : c;
}

export default function CondorcetCycleViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const step = scenes.active;

  const NOTES = [
    "누구도 이상한 선호를 갖고 있지 않습니다. 세 사람 모두 첫째보다 둘째를, 둘째보다 셋째를 덜 원하는 일관된 순서를 갖습니다.",
    `둘씩 붙이면 ${PAIRS.map(([a, b]) => `${SHORT[a]}가 ${SHORT[b]}를 ${support(a, b)}대 ${support(b, a)}로`).join(" · ")} 이깁니다. 세 판 모두 과반이 갈렸고 어디에도 무승부가 없습니다.`,
    "세 결과를 이으면 원이 됩니다. 가장 원하는 안이 무엇이냐는 질문에 다수결이 답을 내놓지 못합니다. 개인의 순서는 전부 이행적인데 집단의 순서만 그렇지 않습니다.",
    `어느 둘을 먼저 붙이느냐에 따라 우승자가 ${AGENDAS.map((a) => SHORT[runAgenda(a)]).join(" · ")}로 전부 달라집니다. 표를 한 장도 바꾸지 않고 순서만 정해 결과를 고를 수 있습니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="다수결의 순환"
      title="개인의 선호가 전부 멀쩡해도 집단의 순서는 무너집니다"
      description="세 사람이 세 안을 놓고 다수결을 하면 이기는 순서가 원을 그립니다."
      note="사람 셋, 안 셋으로 줄인 최소 예입니다. 사람이 많아도 선호가 충분히 갈리면 같은 일이 생깁니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="다수결이 순환하는 과정"
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
              {/* 선호표는 모든 장면에 남겨 둔다 */}
              <text x={22} y={26} fontSize={9} fontWeight={700} fill={MUTED}>
                각자의 선호 순서
              </text>
              {PREFS.map((pref, v) => (
                <g key={v}>
                  <text x={22} y={48 + v * 26} fontSize={9} fontWeight={700} fill={MUTED}>
                    {v + 1}번
                  </text>
                  {pref.map((opt, position) => (
                    <g key={opt}>
                      <rect
                        x={54 + position * 38}
                        y={38 + v * 26}
                        width={34}
                        height={16}
                        fill={COLORS[opt]}
                        fillOpacity={position === 0 ? 0.3 : 0.1}
                        stroke={COLORS[opt]}
                        strokeWidth={1}
                      />
                      <text x={71 + position * 38} y={50 + v * 26} textAnchor="middle" fontSize={8.5} fontWeight={700} fill={COLORS[opt]}>
                        {SHORT[opt]}
                      </text>
                    </g>
                  ))}
                </g>
              ))}
              <text x={54} y={130} fontSize={8} fill={MUTED}>
                왼쪽일수록 더 원합니다
              </text>

              {step === 0 && (
                <text x={200} y={100} fontSize={9.5} fill={MUTED}>
                  세 사람 모두 순서가 일관됩니다
                </text>
              )}

              {step === 1 && (
                <g>
                  <text x={200} y={26} fontSize={9} fontWeight={700} fill={MUTED}>
                    둘씩 붙인 결과
                  </text>
                  {PAIRS.map(([a, b], i) => (
                    <g key={i}>
                      <text x={200} y={48 + i * 26} fontSize={9.5} fill={MUTED}>
                        {OPTIONS[a]} 대 {OPTIONS[b]}
                      </text>
                      <text x={300} y={48 + i * 26} fontSize={9.5} fontWeight={700} fill={COLORS[a]}>
                        {SHORT[a]} 승 · {support(a, b)}대 {support(b, a)}
                      </text>
                    </g>
                  ))}
                  <text x={200} y={130} fontSize={9} fill={MUTED}>
                    세 판 모두 과반이 분명히 갈렸습니다
                  </text>
                </g>
              )}

              {step === 2 && (
                <g>
                  <circle cx={300} cy={44} r={15} fill={COLORS[0]} fillOpacity={0.2} stroke={COLORS[0]} strokeWidth={1} />
                  <text x={300} y={48} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS[0]}>
                    {SHORT[0]}
                  </text>
                  <circle cx={356} cy={112} r={15} fill={COLORS[1]} fillOpacity={0.2} stroke={COLORS[1]} strokeWidth={1} />
                  <text x={356} y={116} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS[1]}>
                    {SHORT[1]}
                  </text>
                  <circle cx={244} cy={112} r={15} fill={COLORS[2]} fillOpacity={0.2} stroke={COLORS[2]} strokeWidth={1} />
                  <text x={244} y={116} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS[2]}>
                    {SHORT[2]}
                  </text>
                  <path d="M312 56 L344 98" stroke={COLORS[0]} strokeWidth={1.25} markerEnd="url(#cyc-arrow)" />
                  <path d="M341 116 L259 116" stroke={COLORS[1]} strokeWidth={1.25} markerEnd="url(#cyc-arrow)" />
                  <path d="M256 98 L288 56" stroke={COLORS[2]} strokeWidth={1.25} markerEnd="url(#cyc-arrow)" />
                  <defs>
                    <marker id="cyc-arrow" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
                      <path d="M0 0 L6 3 L0 6 z" fill={MUTED} />
                    </marker>
                  </defs>
                  <text x={200} y={160} fontSize={9.5} fontWeight={700} fill={WARN}>
                    가장 원하는 안이 무엇인지에 답이 없습니다
                  </text>
                </g>
              )}

              {step === 3 && (
                <g>
                  <text x={200} y={26} fontSize={9} fontWeight={700} fill={MUTED}>
                    먼저 붙이는 둘을 고르면
                  </text>
                  {AGENDAS.map((agenda, i) => {
                    const [a, b, c] = agenda;
                    const winner = runAgenda(agenda);
                    return (
                      <g key={i}>
                        <text x={200} y={48 + i * 26} fontSize={9} fill={MUTED}>
                          {SHORT[a]}·{SHORT[b]} 먼저 → 이긴 쪽 대 {SHORT[c]}
                        </text>
                        <text x={352} y={48 + i * 26} fontSize={9.5} fontWeight={700} fill={COLORS[winner]}>
                          {OPTIONS[winner]} 우승
                        </text>
                      </g>
                    );
                  })}
                  <text x={200} y={130} fontSize={9} fontWeight={700} fill={WARN}>
                    표는 하나도 바뀌지 않았습니다
                  </text>
                  <text x={200} y={148} fontSize={9} fill={MUTED}>
                    순서를 정하는 자리가 결과를 정하는 자리가 됩니다
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
