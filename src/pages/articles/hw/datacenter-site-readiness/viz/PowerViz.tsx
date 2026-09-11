import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: PowerSizing.tsx — 명판·지속·피크와 이중화 */
const SCENES = ["명판 용량", "지속 부하", "피크", "이중 급전"] as const;
const NOTES = [
  "섀시가 최대로 끌 수 있는 값입니다. 회로 설계에 그대로 쓰면 과잉이 됩니다.",
  "대표 워크로드에서 실제로 지속되는 값입니다. 회로 사이징의 출발점입니다.",
  "여러 장이 동시에 최대 부하로 올라가면 순간적으로 명판에 가까워집니다.",
  "각 경로가 전체를 혼자 감당할 수 있어야 한쪽이 끊겨도 살아남습니다.",
] as const;

const NAME = "#94a3b8";
const CONT = "#6366f1";
const PEAK = "#f59e0b";
const BAD = "#ef4444";
const OKC = "#10b981";

export default function PowerViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="전력 사이징"
      title="어느 값으로 회로를 잡느냐가 갈립니다"
      description="같은 섀시의 세 가지 전력 값과 이중 급전 구성을 봅니다."
      note="여유율과 회로 산정 기준은 지역 전기 규정을 따르며 그림은 구조만 보여 줍니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="전력 사이징과 이중 급전"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step < 3 ? (
              <g>
                {[
                  { n: "명판 용량", v: 1.0, c: NAME, on: true },
                  { n: "지속 부하", v: 0.55, c: CONT, on: step >= 1 },
                  { n: "피크", v: 0.92, c: PEAK, on: step >= 2 },
                ].map((r, i) => (
                  <g key={r.n}>
                    <text x={24} y={62 + i * 42} fontSize={9} fontWeight={700} fill={r.on ? r.c : NAME}>
                      {r.n}
                    </text>
                    <rect x={130} y={48 + i * 42} width={300} height={22} fill="none" stroke={NAME} strokeWidth={0.5} />
                    <rect
                      x={130}
                      y={48 + i * 42}
                      width={r.v * 300}
                      height={22}
                      fill={r.c}
                      fillOpacity={r.on ? 0.3 : 0.06}
                      stroke={r.on ? r.c : NAME}
                      strokeWidth={1}
                    />
                  </g>
                ))}
                <text x={24} y={182} fontSize={9} fill={step === 1 ? CONT : step === 2 ? PEAK : NAME}>
                  {step === 0 && "이 값으로 회로를 잡으면 과잉 설계가 됩니다"}
                  {step === 1 && "여기에 여유율을 곱한 값이 회로 용량의 출발점입니다"}
                  {step === 2 && "짧고 높은 피크가 반복되면 차단기 특성에 따라 트립될 수 있습니다"}
                </text>
              </g>
            ) : (
              <g>
                {[0, 1].map((i) => (
                  <g key={i}>
                    <rect x={40 + i * 230} y={44} width={170} height={34} fill={OKC} fillOpacity={0.12} stroke={OKC} strokeWidth={1.25} />
                    <text x={125 + i * 230} y={66} textAnchor="middle" fontSize={9} fontWeight={700} fill={OKC}>
                      급전 경로 {String.fromCharCode(65 + i)}
                    </text>
                  </g>
                ))}
                <rect x={140} y={110} width={200} height={40} fill={CONT} fillOpacity={0.12} stroke={CONT} strokeWidth={1.25} />
                <text x={240} y={135} textAnchor="middle" fontSize={9} fontWeight={700} fill={CONT}>
                  랙 부하 100%
                </text>
                <line x1={125} y1={78} x2={200} y2={110} stroke={OKC} strokeWidth={1} />
                <line x1={355} y1={78} x2={280} y2={110} stroke={OKC} strokeWidth={1} />
                <text x={40} y={176} fontSize={9} fontWeight={700} fill={OKC}>
                  각 경로가 100%를 감당 → 한쪽 끊겨도 유지
                </text>
                <text x={40} y={192} fontSize={9} fontWeight={700} fill={BAD}>
                  각 경로를 50%로 잡으면 한쪽 상실 시 나머지가 200%를 받아 차단
                </text>
              </g>
            )}
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
