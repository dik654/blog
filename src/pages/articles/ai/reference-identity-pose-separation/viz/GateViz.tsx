import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: SeparationGate.tsx — 세 번의 오진과 같은 해결 절차 */
const SCENES = ["오진 1 · 문구", "오진 2 · 반대 손잡이", "오진 3 · 엉뚱한 신호", "같은 절차"] as const;
const NOTES = [
  "문구를 다듬었습니다. 회전 각도가 소수점 한 자리까지 같다는 측정이 나오고서야 접었습니다.",
  "정체성을 거는 구간을 조절하면서 반대쪽을 돌렸습니다. 접을 뻔했습니다.",
  "후면 얼굴의 원인을 정체성 편향으로 봤습니다. 꺼 봐도 같았습니다.",
  "세 번 모두 의심하는 신호를 완전히 꺼 보는 것이 답을 줬습니다.",
] as const;

const BAD = "#ef4444";
const OK = "#10b981";
const MUTED = "#94a3b8";

const CASES = [
  { n: "문구를 다듬음", real: "참조 조건이 자세를 붙잡고 있었음", ev: "회전각 59.5 → 59.9" },
  { n: "구간을 초반으로", real: "구조가 정해지는 것이 바로 초반", ev: "반대쪽에서 22.2 → 62.7" },
  { n: "정체성 편향 의심", real: "방향을 표현할 신호가 없었음", ev: "꺼도 후면 얼굴 그대로" },
];

export default function GateViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="판정"
      title="설정을 미세 조정하기 전에 신호를 꺼 봅니다"
      description="이 회차에서 시간을 가장 많이 쓴 세 지점이 모두 같은 모양이었습니다."
      note="세 사례는 이 회차의 기록이며 일반 절차로 제시하는 것은 마지막 장면의 방법입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="원인 진단 절차"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step <= 2 && (
              <g>
                <rect x={24} y={48} width={190} height={60} fill={BAD} fillOpacity={0.1} stroke={BAD} strokeWidth={1.25} />
                <text x={119} y={70} textAnchor="middle" fontSize={9} fontWeight={700} fill={BAD}>
                  처음 한 일
                </text>
                <text x={119} y={90} textAnchor="middle" fontSize={9} fill={BAD}>
                  {CASES[step].n}
                </text>
                <line x1={214} y1={78} x2={250} y2={78} stroke={MUTED} strokeWidth={1} />
                <rect x={250} y={48} width={206} height={60} fill={OK} fillOpacity={0.1} stroke={OK} strokeWidth={1.25} />
                <text x={353} y={70} textAnchor="middle" fontSize={9} fontWeight={700} fill={OK}>
                  실제 원인
                </text>
                <text x={353} y={90} textAnchor="middle" fontSize={8} fill={OK}>
                  {CASES[step].real}
                </text>
                <text x={24} y={140} fontSize={9} fontWeight={700} fill={MUTED}>
                  이것이 나오고서야 방향을 바꿨습니다
                </text>
                <text x={24} y={162} fontSize={9} fill={MUTED}>
                  {CASES[step].ev}
                </text>
              </g>
            )}
            {step === 3 && (
              <g>
                <text x={24} y={26} fontSize={9} fill={MUTED}>
                  세 번 모두 같은 절차가 답을 줬습니다
                </text>
                <rect x={24} y={44} width={432} height={40} fill={OK} fillOpacity={0.12} stroke={OK} strokeWidth={1.25} />
                <text x={240} y={68} textAnchor="middle" fontSize={10} fontWeight={700} fill={OK}>
                  의심하는 신호를 완전히 꺼 본다
                </text>
                {[
                  { a: "참조 조건을 뺌", b: "몸이 실제로 돌았음" },
                  { a: "정체성 주입을 끔", b: "후면 얼굴이 그대로였음" },
                ].map((r, i) => (
                  <g key={r.a}>
                    <rect x={24} y={100 + i * 36} width={170} height={28} fill={OK} fillOpacity={0.08} stroke={OK} strokeWidth={1} />
                    <text x={109} y={118 + i * 36} textAnchor="middle" fontSize={9} fontWeight={700} fill={OK}>
                      {r.a}
                    </text>
                    <text x={210} y={118 + i * 36} fontSize={9} fill={OK}>
                      → {r.b}
                    </text>
                  </g>
                ))}
                <text x={24} y={190} fontSize={8} fontWeight={700} fill={MUTED}>
                  꺼 봤는데 증상이 그대로면 그 신호는 원인이 아닙니다. 제거 실험 한 번이면 확정됩니다.
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
