import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: damages 의 ExplainedFormula — 배상액이 파기 결정을 어디로 옮기는가 */
const SCENES = [
  "배상이 상대의 이익과 같을 때",
  "배상이 작으면 안 해도 될 파기를 한다",
  "배상이 크면 해야 할 파기를 안 한다",
  "세 경우를 나란히 놓으면",
] as const;

/** 상대가 이행으로 얻는 이익 */
const V = 100;
const DAMAGES = [100, 60, 150] as const;
/** 각 장면에서 들여다볼 사례의 이행 비용 */
const SAMPLE = [130, 80, 130] as const;

const ACCENT = "#6366f1";
const OK = "#10b981";
const WARN = "#ef4444";
const MUTED = "#94a3b8";

const X0 = 60;
const SPAN = 360;
const MAXC = 200;
const toX = (c: number) => X0 + (c / MAXC) * SPAN;

const fmt = (v: number) => `${v}`;

export default function BreachIncentiveViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const step = scenes.active;
  const d = DAMAGES[Math.min(step, DAMAGES.length - 1)];
  const c = SAMPLE[Math.min(step, SAMPLE.length - 1)];
  const breaches = c > d;
  const shouldBreach = c > V;
  const aligned = breaches === shouldBreach;
  const lossLow = Math.min(d, V);
  const lossHigh = Math.max(d, V);

  const NOTES = [
    `배상액을 상대의 이익과 같은 ${d}으로 두면, 파기하는 쪽은 이행 비용이 ${d}을 넘을 때만 파기합니다. 사회적으로 파기가 나은 조건도 이행 비용이 ${V}을 넘는 것이라 두 경계가 정확히 겹칩니다.`,
    `배상을 ${d}으로 낮추면 파기 경계가 ${d}으로 내려옵니다. 이행 비용이 ${c}인 사례를 보면 파기하면 ${d}, 이행하면 ${c}이라 파기를 고르는데, 사회적으로는 ${c}을 들여 ${V}짜리를 만드는 편이 나았습니다. ${fmt(V - c)}만큼 사라집니다.`,
    `배상을 ${d}으로 올리면 반대가 됩니다. 이행 비용이 ${c}인 사례에서 파기하면 ${d}, 이행하면 ${c}이라 이행을 고르는데, ${c}을 들여 ${V}짜리를 만드는 것은 ${fmt(c - V)}만큼 손해입니다.`,
    "배상이 상대의 이익과 같을 때만 두 경계가 겹칩니다. 낮으면 안 해도 될 파기가 일어나고 높으면 해야 할 파기가 막히며, 어긋난 구간의 폭이 곧 배상액과 상대 이익의 차이입니다.",
  ] as const;

  return (
    <VizFrame
      eyebrow="배상과 유인"
      title="배상액을 어디에 두느냐가 파기할지 말지를 정합니다"
      description="어기는 쪽은 배상액과 이행 비용을 견주고, 사회는 이행 비용과 상대의 이익을 견줍니다."
      note={`상대가 이행으로 얻는 이익을 ${V}으로 고정하고 배상액만 바꾼 예입니다. 사정 변경이 사후에 드러난다고 두었고 소송 비용은 넣지 않았습니다.`}
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="배상액에 따른 파기 결정"
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
                  <text x={X0 - 8} y={48} textAnchor="end" fontSize={8.5} fontWeight={700} fill={WARN}>
                    어기는 쪽
                  </text>
                  <rect x={toX(d)} y={36} width={toX(MAXC) - toX(d)} height={16} fill={WARN} fillOpacity={0.3} stroke={WARN} strokeWidth={1} />
                  <text
                    x={d > 120 ? toX(d) - 6 : toX(d) + 6}
                    y={48}
                    textAnchor={d > 120 ? "end" : "start"}
                    fontSize={8.5}
                    fontWeight={700}
                    fill={WARN}
                  >
                    이행 비용이 배상 {d}을 넘으면 파기
                  </text>

                  <text x={X0 - 8} y={78} textAnchor="end" fontSize={8.5} fontWeight={700} fill={OK}>
                    사회
                  </text>
                  <rect x={toX(V)} y={66} width={toX(MAXC) - toX(V)} height={16} fill={OK} fillOpacity={0.3} stroke={OK} strokeWidth={1} />
                  <text x={toX(V) + 6} y={78} fontSize={8.5} fontWeight={700} fill={OK}>
                    이행 비용이 상대 이익 {V}을 넘으면 파기가 나음
                  </text>

                  {d !== V && (
                    <g>
                      <rect x={toX(lossLow)} y={92} width={toX(lossHigh) - toX(lossLow)} height={14} fill={WARN} fillOpacity={0.5} stroke={WARN} strokeWidth={1} strokeDasharray="3 3" />
                      <text x={toX(lossLow) + 4} y={103} fontSize={8} fontWeight={700} fill={WARN}>
                        어긋나는 구간 {lossLow}~{lossHigh}
                      </text>
                    </g>
                  )}

                  <line x1={X0} y1={124} x2={X0 + SPAN} y2={124} stroke={MUTED} strokeWidth={1} />
                  {[0, 50, 100, 150, 200].map((tick) => (
                    <g key={tick}>
                      <line x1={toX(tick)} y1={120} x2={toX(tick)} y2={128} stroke={MUTED} strokeWidth={1} />
                      <text x={toX(tick)} y={140} textAnchor="middle" fontSize={8} fill={MUTED}>
                        {tick}
                      </text>
                    </g>
                  ))}
                  <text x={X0 + SPAN} y={154} textAnchor="end" fontSize={8} fill={MUTED}>
                    이행 비용
                  </text>

                  <circle cx={toX(c)} cy={124} r={4.5} fill={ACCENT} />
                  <text x={toX(c)} y={116} textAnchor="middle" fontSize={8.5} fontWeight={700} fill={ACCENT}>
                    사례 {c}
                  </text>

                  <text x={X0} y={172} fontSize={9.5} fontWeight={700} fill={aligned ? OK : WARN}>
                    {breaches ? "어기는 쪽은 파기를 고릅니다" : "어기는 쪽은 이행을 고릅니다"} ·{" "}
                    {shouldBreach ? "사회적으로도 파기가 낫습니다" : "사회적으로는 이행이 낫습니다"}
                  </text>
                  <text x={X0} y={190} fontSize={9} fontWeight={700} fill={aligned ? OK : WARN}>
                    {aligned
                      ? "두 판단이 일치합니다"
                      : `어긋납니다 · 사라지는 값 ${Math.abs(c - V)}`}
                  </text>
                </g>
              ) : (
                <g>
                  <text x={40} y={30} fontSize={9} fontWeight={700} fill={MUTED}>
                    배상액을 어디에 두느냐에 따라
                  </text>
                  {[
                    { label: `배상 ${DAMAGES[1]} · 상대 이익보다 작음`, result: "안 해도 될 파기가 일어남", color: WARN },
                    { label: `배상 ${DAMAGES[0]} · 상대 이익과 같음`, result: "두 경계가 정확히 겹침", color: OK },
                    { label: `배상 ${DAMAGES[2]} · 상대 이익보다 큼`, result: "해야 할 파기가 막힘", color: WARN },
                  ].map((row, i) => (
                    <g key={row.label}>
                      <rect x={40} y={44 + i * 34} width={180} height={26} rx={4} fill={row.color} fillOpacity={0.1} stroke={row.color} strokeWidth={1} />
                      <text x={130} y={61 + i * 34} textAnchor="middle" fontSize={9} fontWeight={700} fill={row.color}>
                        {row.label}
                      </text>
                      <text x={236} y={61 + i * 34} fontSize={9.5} fontWeight={700} fill={row.color}>
                        {row.result}
                      </text>
                    </g>
                  ))}
                  <text x={40} y={168} fontSize={9.5} fontWeight={700} fill={ACCENT}>
                    어긋난 구간의 폭 = 배상액과 상대 이익의 차이
                  </text>
                  <text x={40} y={186} fontSize={9} fill={MUTED}>
                    배상을 상대의 이익에 맞추면 그 폭이 0이 됩니다
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
