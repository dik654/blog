import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: RequestLayer.tsx — 규칙·한도·검증 세 가지 처분 */
const SCENES = ["패턴 규칙", "속도 한도", "검증 요구", "순서가 결과를 바꿉니다"] as const;
const NOTES = [
  "요청 모양이 알려진 공격 형태와 맞으면 그 자리에서 차단합니다. 판단이 빠르고 설명도 쉽습니다.",
  "모양이 정상이어도 같은 주체가 너무 자주 오면 막습니다. 셈의 단위를 무엇으로 잡느냐가 전부입니다.",
  "애매하면 거절도 통과도 아닌 숙제를 냅니다. 사람에게는 거의 공짜고 자동화에는 비용입니다.",
  "값싼 판단을 앞에 두면 비싼 판단이 처리할 양이 줄어듭니다.",
] as const;

const RULE = "#6366f1";
const LIMIT = "#f59e0b";
const CHALLENGE = "#8b5cf6";
const PASS = "#10b981";
const MUTED = "#94a3b8";

const STAGES = [
  { n: "패턴 규칙", c: RULE, d: "요청 모양 대조", out: "차단" },
  { n: "속도 한도", c: LIMIT, d: "주체별 횟수 셈", out: "지연·차단" },
  { n: "검증 요구", c: CHALLENGE, d: "클라이언트에 숙제", out: "통과·이탈" },
];

export default function RequestViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="요청 층"
      title="세 가지 처분이 순서대로 놓입니다"
      description="차단·지연·검증은 각각 비용과 오판의 모양이 다릅니다."
      note="통과 비율은 구조를 보여 주기 위한 예시 값이며 실제 트래픽 분포가 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="요청 층 처분 순서"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 190" className="mt-4 w-full max-w-2xl">
            <text x={24} y={30} fontSize={9} fill={MUTED}>
              도착한 요청
            </text>
            {STAGES.map((s, i) => {
              const active = step === 3 || i === step;
              const x = 24 + i * 148;
              return (
                <g key={s.n}>
                  <rect x={x} y={44} width={124} height={48} fill={s.c} fillOpacity={active ? 0.15 : 0.05} stroke={active ? s.c : MUTED} strokeWidth={active ? 1.25 : 1} />
                  <text x={x + 62} y={64} textAnchor="middle" fontSize={10} fontWeight={700} fill={active ? s.c : MUTED}>
                    {s.n}
                  </text>
                  <text x={x + 62} y={80} textAnchor="middle" fontSize={8} fill={active ? s.c : MUTED}>
                    {s.d}
                  </text>
                  <line x1={x + 62} y1={92} x2={x + 62} y2={112} stroke={active ? s.c : MUTED} strokeWidth={1} strokeDasharray="3 2" />
                  <text x={x + 62} y={124} textAnchor="middle" fontSize={8} fill={active ? s.c : MUTED}>
                    걸리면 {s.out}
                  </text>
                  {i < 2 && <line x1={x + 124} y1={68} x2={x + 148} y2={68} stroke={MUTED} strokeWidth={1} />}
                </g>
              );
            })}
            {step === 3 && (
              <g>
                <rect x={24} y={146} width={330} height={14} fill={MUTED} fillOpacity={0.12} stroke={MUTED} strokeWidth={1} />
                <rect x={24} y={146} width={200} height={14} fill={RULE} fillOpacity={0.22} stroke={RULE} strokeWidth={1} />
                <rect x={224} y={146} width={80} height={14} fill={LIMIT} fillOpacity={0.22} stroke={LIMIT} strokeWidth={1} />
                <rect x={304} y={146} width={30} height={14} fill={CHALLENGE} fillOpacity={0.22} stroke={CHALLENGE} strokeWidth={1} />
                <text x={362} y={157} fontSize={8} fill={PASS}>
                  남은 만큼만 통과
                </text>
                <text x={24} y={140} fontSize={8} fill={MUTED}>
                  앞 단계가 처리한 양 — 뒤로 갈수록 남는 양이 적어집니다
                </text>
              </g>
            )}
            <text x={456} y={30} textAnchor="end" fontSize={9} fontWeight={700} fill={PASS}>
              통과하면 오리진으로
            </text>
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
