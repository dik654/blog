import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: MeasurementGate.tsx — 새 계측기를 붙일 때의 네 질문 */
const SCENES = ["적용 범위", "임계값의 근거", "바닥값", "절대값이냐 차이냐"] as const;
const NOTES = [
  "학습 분포를 벗어난 입력에서는 실패가 낮은 점수처럼 보입니다. 탐지가 되는지부터 확인합니다.",
  "어디선가 본 기본값은 검증되지 않은 가정입니다. 허용할 오탐률을 먼저 정하고 거기서 값을 얻습니다.",
  "아무것도 하지 않았을 때 0이 아니라면 그 바닥을 재서 빼되, 같은 입력에서 잰 값으로만 뺍니다.",
  "같은 조건 두 번의 차이를 보는 지표는 오염에 면역이고, 한 번 잰 절대값은 취약합니다.",
] as const;

const Q1 = "#6366f1";
const Q2 = "#f59e0b";
const Q3 = "#10b981";
const Q4 = "#8b5cf6";
const MUTED = "#94a3b8";

const ROWS = [
  { n: "범위", q: "이 입력이 도구의 학습 분포 안에 있는가", m: "탐지 성공률", c: Q1 },
  { n: "임계", q: "임계값의 근거가 무엇인가", m: "남남 쌍의 오탐률", c: Q2 },
  { n: "바닥", q: "아무것도 안 했을 때 0이 나오는가", m: "무동작 통과 값", c: Q3 },
  { n: "형태", q: "절대값인가 두 실행의 차이인가", m: "오염 내성", c: Q4 },
];

export default function GateViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="판정"
      title="새 계측기를 붙일 때마다 같은 순서로 묻습니다"
      description="네 질문에 답하지 못하면 그 숫자는 아직 쓸 수 없습니다."
      note="네 항목은 이 기록이 정리한 점검 틀이며 표준 절차가 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="계측기 점검 항목"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            <text x={24} y={20} fontSize={9} fill={MUTED}>
              숫자를 결론에 쓰기 전에
            </text>
            {ROWS.map((r, i) => {
              const active = i === step;
              const c = active ? r.c : MUTED;
              return (
                <g key={r.n}>
                  <rect x={24} y={30 + i * 38} width={56} height={28} fill={c} fillOpacity={active ? 0.14 : 0.05} stroke={c} strokeWidth={active ? 1.25 : 1} />
                  <text x={52} y={49 + i * 38} textAnchor="middle" fontSize={9} fontWeight={700} fill={c}>
                    {r.n}
                  </text>
                  <text x={92} y={44 + i * 38} fontSize={8} fill={c}>
                    {r.q}
                  </text>
                  <text x={92} y={58 + i * 38} fontSize={8} fontWeight={active ? 700 : 400} fill={c}>
                    보는 값 · {r.m}
                  </text>
                </g>
              );
            })}
            <text x={24} y={192} fontSize={8} fontWeight={700} fill={MUTED}>
              이 프로젝트에서 지표가 틀린 것이 일곱 번이고, 매번 대조군이 없었습니다.
            </text>
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
