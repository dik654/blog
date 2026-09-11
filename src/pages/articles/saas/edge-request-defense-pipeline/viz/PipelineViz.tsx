import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: Overview.tsx — 층마다 쓸 수 있는 정보와 한 건당 비용 */
const SCENES = ["패킷 층", "연결 층", "요청 층", "비용과 정확도"] as const;
const NOTES = [
  "헤더 몇 필드만 보고 버립니다. 가장 싸고 가장 둔합니다.",
  "연결을 맺으며 클라이언트 소프트웨어의 특징을 얻습니다. 아직 요청 내용은 모릅니다.",
  "경로·헤더·본문을 다 봅니다. 가장 정확하지만 여기까지 온 비용이 이미 들었습니다.",
  "뒤로 갈수록 정확하고 비쌉니다. 값싼 층에서 최대한 걸러 내는 것이 설계 목표입니다.",
] as const;

const L1 = "#6366f1";
const L2 = "#8b5cf6";
const L3 = "#10b981";
const MUTED = "#94a3b8";

const LAYERS = [
  { n: "패킷 층", c: L1, info: "IP·포트·플래그", cost: 0.12 },
  { n: "연결 층", c: L2, info: "TLS 첫 메시지·프로토콜 협상", cost: 0.45 },
  { n: "요청 층", c: L3, info: "경로·헤더·본문", cost: 1.0 },
];

export default function PipelineViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="방어 계층"
      title="같은 요청이 층마다 다른 정보로 판단됩니다"
      description="앞 층일수록 아는 것이 적고 처리 비용이 쌉니다."
      note="비용 막대는 상대 비교를 위한 개념도이며 특정 제품의 측정값이 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="엣지 방어 계층 구조"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {LAYERS.map((l, i) => {
              const active = step === 3 ? true : i === step;
              return (
                <g key={l.n}>
                  <rect
                    x={24}
                    y={44 + i * 42}
                    width={150}
                    height={32}
                    fill={l.c}
                    fillOpacity={active ? 0.16 : 0.05}
                    stroke={active ? l.c : MUTED}
                    strokeWidth={active ? 1.25 : 1}
                  />
                  <text x={38} y={64 + i * 42} fontSize={10} fontWeight={700} fill={active ? l.c : MUTED}>
                    {l.n}
                  </text>
                  <text x={186} y={58 + i * 42} fontSize={8} fill={active ? l.c : MUTED}>
                    아는 것 · {l.info}
                  </text>
                  {step === 3 && (
                    <g>
                      <rect x={186} y={62 + i * 42} width={l.cost * 240} height={12} fill={l.c} fillOpacity={0.25} stroke={l.c} strokeWidth={1} />
                      <text x={186 + l.cost * 240 + 6} y={72 + i * 42} fontSize={8} fill={l.c}>
                        비용
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
            <line x1={99} y1={76} x2={99} y2={86} stroke={MUTED} strokeWidth={1} />
            <line x1={99} y1={118} x2={99} y2={128} stroke={MUTED} strokeWidth={1} />
            <rect x={24} y={170} width={150} height={24} fill="none" stroke={MUTED} strokeWidth={1} />
            <text x={99} y={186} textAnchor="middle" fontSize={9} fontWeight={700} fill={MUTED}>
              오리진
            </text>
            <text x={186} y={186} fontSize={9} fill={step === 3 ? L3 : MUTED}>
              {step === 3 ? "값싼 층에서 최대한 걸러 내는 것이 목표" : "여기까지 오면 이미 비용을 다 치렀습니다"}
            </text>
            <text x={24} y={34} fontSize={9} fill={MUTED}>
              요청 도착
            </text>
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
