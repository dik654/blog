import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: AccessGate.tsx — 표면·범위·기준 세 확인과 옮겨 간 신뢰 지점 */
const SCENES = ["표면 확인", "범위 확인", "기준 확인", "옮겨 간 신뢰 지점"] as const;
const NOTES = [
  "밖에서 직접 두드릴 수 있는 지점이 하나라도 남아 있으면 나머지 논의가 무의미합니다.",
  "통로가 닿는 안쪽 대상이 자원 단위로 좁혀져 있는지 확인합니다.",
  "좁혀진 범위 안에서 요청마다 판정이 일어나는지 확인합니다. 이것이 없으면 기준은 그대로입니다.",
  "방화벽 규칙이 사라진 자리의 새 비밀을 누가 어떻게 관리하는지 답할 수 있어야 합니다.",
] as const;

const OK = "#10b981";
const BAD = "#ef4444";
const WARN = "#f59e0b";
const SECRET = "#8b5cf6";
const MUTED = "#94a3b8";

const ROWS = [
  { n: "표면", q: "밖에서 직접 닿을 수 있는 지점이 남아 있는가", m: "열린 포트 · 공개된 주소", c: BAD },
  { n: "범위", q: "통로가 닿는 안쪽 대상이 무엇으로 제한되는가", m: "부여된 자원의 수", c: OK },
  { n: "기준", q: "그 범위 안에서 요청마다 판정이 일어나는가", m: "내부라는 이유로 통과하는 서비스 수", c: WARN },
  { n: "비밀", q: "커넥터 자격 증명은 어디에 있고 언제 교체되는가", m: "저장 위치 · 교체 주기", c: SECRET },
];

export default function GateViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="판정"
      title="방향을 뒤집었다는 사실은 첫 줄만 보장합니다"
      description="네 줄을 모두 답할 수 있어야 사설 접근이 성립합니다."
      note="네 항목은 이 글이 정리한 확인 틀이며 특정 제품의 점검 목록이 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="사설 접근 확인 항목"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            <text x={24} y={20} fontSize={9} fill={MUTED}>
              방향을 뒤집은 뒤에도 남는 질문들
            </text>
            {ROWS.map((r, i) => {
              const active = i === step;
              const c = active ? r.c : MUTED;
              return (
                <g key={r.n}>
                  <rect x={24} y={30 + i * 38} width={60} height={28} fill={c} fillOpacity={active ? 0.14 : 0.05} stroke={c} strokeWidth={active ? 1.25 : 1} />
                  <text x={54} y={49 + i * 38} textAnchor="middle" fontSize={9} fontWeight={700} fill={c}>
                    {r.n}
                  </text>
                  <text x={96} y={44 + i * 38} fontSize={8} fill={c}>
                    {r.q}
                  </text>
                  <text x={96} y={58 + i * 38} fontSize={8} fontWeight={active ? 700 : 400} fill={c}>
                    재는 값 · {r.m}
                  </text>
                </g>
              );
            })}
            <text x={24} y={192} fontSize={8} fontWeight={700} fill={step === 3 ? SECRET : MUTED}>
              {step === 3
                ? "없앤 위험만큼 새 위험이 들어왔는지 여기서 갈립니다."
                : "한 줄이라도 답하지 못하면 나머지 줄의 답은 힘을 잃습니다."}
            </text>
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
