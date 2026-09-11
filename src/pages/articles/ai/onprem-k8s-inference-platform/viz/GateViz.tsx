import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: PlatformGate.tsx — 직접 돌리기 전에 답해야 하는 네 질문 */
const SCENES = ["복제본 선택", "복제본의 모양", "총량", "넘겨받은 항목"] as const;
const NOTES = [
  "요청을 어느 복제본으로 보낼지 누가 정하고 그 결정에 어떤 값이 들어가는지 답할 수 있어야 합니다.",
  "복제본 하나가 파드 몇 개인지, 그중 하나가 죽으면 무엇이 일어나는지가 정해져 있어야 합니다.",
  "부하가 늘 때 어떤 모델이 자리를 내주고 다시 뜨는 데 얼마나 걸리는지가 정해져 있어야 합니다.",
  "게이트웨이가 하던 일 중 새 주인이 없는 항목이 남아 있는지 목록으로 확인해야 합니다.",
] as const;

const Q1 = "#6366f1";
const Q2 = "#10b981";
const Q3 = "#f59e0b";
const Q4 = "#8b5cf6";
const BAD = "#ef4444";
const MUTED = "#94a3b8";

const ROWS = [
  { n: "선택", q: "어느 복제본으로 보낼지 누가 정하는가", bad: "앞단 프록시가 순서대로", c: Q1 },
  { n: "모양", q: "복제본 하나가 파드 몇 개인가", bad: "기본 배포 추상에 그대로", c: Q2 },
  { n: "총량", q: "부하가 늘면 어떤 모델이 자리를 내주는가", bad: "정해 둔 적 없음", c: Q3 },
  { n: "인계", q: "주인이 지정되지 않은 항목이 있는가", bad: "사용량 집계가 빠짐", c: Q4 },
];

export default function GateViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="판정"
      title="네 질문에 답할 수 있으면 옮겨도 됩니다"
      description="각 질문과 흔히 나오는 나쁜 답을 함께 둡니다."
      note="네 항목은 이 글이 정리한 확인 틀이며 특정 제품의 점검 목록이 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="온프레미스 추론 인프라 확인 항목"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            <text x={24} y={20} fontSize={9} fill={MUTED}>
              옮기기 전에 답해야 하는 것들
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
                  <text x={92} y={58 + i * 38} fontSize={8} fontWeight={active ? 700 : 400} fill={active ? BAD : MUTED}>
                    흔한 나쁜 답 · {r.bad}
                  </text>
                </g>
              );
            })}
            <text x={24} y={192} fontSize={8} fontWeight={700} fill={MUTED}>
              한 줄이라도 답이 없으면 절감한 만큼을 운영으로 되돌려주게 됩니다.
            </text>
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
