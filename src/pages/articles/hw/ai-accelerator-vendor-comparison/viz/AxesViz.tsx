import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: Overview.tsx — 네 축이 서로를 묶는 구조 */
const SCENES = ["메모리", "링크", "폼팩터", "소프트웨어"] as const;
const NOTES = [
  "용량은 나누지 않아도 되는 구간을, 대역폭은 생성 속도의 상한을 정합니다.",
  "나눠야 할 때 가속기 사이를 무엇으로 잇는지가 성능을 정합니다.",
  "링크 방식이 폼팩터를 정하고 폼팩터가 전력과 냉각을 정합니다.",
  "앞 세 축에서 유리해도 지금 스택이 돌지 않으면 그 차이는 실현되지 않습니다.",
] as const;

const MEM = "#6366f1";
const LINK = "#10b981";
const FORM = "#f59e0b";
const SW = "#8b5cf6";
const MUTED = "#94a3b8";
const AXES = [
  { n: "메모리", c: MEM, q: "한 장에 들어가는가" },
  { n: "링크", c: LINK, q: "나누면 얼마나 비싼가" },
  { n: "폼팩터", c: FORM, q: "전력·냉각을 감당하는가" },
  { n: "소프트웨어", c: SW, q: "지금 스택이 도는가" },
];

export default function AxesViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="비교의 축"
      title="네 축은 순서대로 서로를 묶습니다"
      description="앞 축의 결정이 뒤 축의 선택지를 좁힙니다."
      note="연산 성능 수치는 정밀도 정의와 측정 조건이 벤더마다 달라 이 축에 넣지 않았습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="가속기 비교의 네 축"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {AXES.map((a, i) => {
              const active = i <= step;
              return (
                <g key={a.n}>
                  <rect
                    x={16 + i * 116}
                    y={52}
                    width={100}
                    height={56}
                    fill={a.c}
                    fillOpacity={active ? 0.14 : 0.04}
                    stroke={active ? a.c : MUTED}
                    strokeWidth={i === step ? 1.25 : 1}
                  />
                  <text x={66 + i * 116} y={76} textAnchor="middle" fontSize={10} fontWeight={700} fill={active ? a.c : MUTED}>
                    {a.n}
                  </text>
                  <text x={66 + i * 116} y={94} textAnchor="middle" fontSize={8} fill={active ? a.c : MUTED}>
                    {a.q}
                  </text>
                  {i < 3 && <line x1={116 + i * 116} y1={80} x2={132 + i * 116} y2={80} stroke={active ? MUTED : "none"} strokeWidth={1} />}
                </g>
              );
            })}
            <text x={16} y={36} fontSize={9} fill={MUTED}>
              앞 축이 뒤 축의 선택지를 좁힙니다
            </text>
            <text x={16} y={140} fontSize={9} fontWeight={700} fill={AXES[step].c}>
              {["용량과 대역폭은 다른 질문에 답합니다", "전용 스위치 · 메시 · 표준 이더넷", "모듈 규격이 전력 상한을 정합니다", "문서가 아니라 실행으로 확인합니다"][step]}
            </text>
            <text x={16} y={176} fontSize={9} fill={MUTED}>
              스펙 숫자보다 축이 오래 갑니다
            </text>
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
