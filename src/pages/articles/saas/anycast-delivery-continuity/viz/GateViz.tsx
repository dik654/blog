import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: ContinuityGate.tsx — 층별 확인 항목과 최종 판정 */
const SCENES = ["지점 층 확인", "서버 층 확인", "판정 층 확인", "변경 층 확인"] as const;
const NOTES = [
  "지점 하나를 뺐을 때 그 캐치먼트가 어디로 가고 그쪽에 여유가 있는지 실제로 재 봅니다.",
  "서버 한 대를 뺐을 때 기존 연결이 살아남는지, 몇 개가 자리를 옮기는지 세어 봅니다.",
  "설정에 적힌 주기와 실패 횟수를 감지 시간으로 환산해 장애 시간과 같은 단위로 놓습니다.",
  "설정이든 코드든 전역에 한 번에 닿는 경로가 남아 있으면 앞의 확인은 모두 무의미합니다.",
] as const;

const OK = "#10b981";
const BAD = "#ef4444";
const EDGE = "#6366f1";
const WARN = "#f59e0b";
const MUTED = "#94a3b8";

const ROWS = [
  { n: "지점 층", q: "한 지점을 빼면 캐치먼트가 어디로 가는가", m: "옆 지점의 여유 용량", c: EDGE },
  { n: "서버 층", q: "한 대를 빼면 기존 연결이 살아남는가", m: "자리를 옮긴 연결 수", c: OK },
  { n: "판정 층", q: "실제 고장을 몇 초 만에 잡는가", m: "주기 × 실패 허용 횟수", c: WARN },
  { n: "변경 층", q: "전역에 한 번에 닿는 경로가 있는가", m: "단계 비율과 되돌리기 시간", c: BAD },
];

export default function GateViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="판정"
      title="층마다 재는 값이 다르고, 하나라도 비면 주장에 그칩니다"
      description="네 층의 확인 질문과 각각 재야 하는 값을 정리합니다."
      note="네 항목은 이 글이 정리한 확인 틀이며 특정 제품의 점검 목록이 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="무중단 확인 항목"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {ROWS.map((r, i) => {
              const active = i === step;
              const c = active ? r.c : MUTED;
              return (
                <g key={r.n}>
                  <rect x={24} y={30 + i * 38} width={72} height={28} fill={c} fillOpacity={active ? 0.14 : 0.05} stroke={c} strokeWidth={active ? 1.25 : 1} />
                  <text x={60} y={49 + i * 38} textAnchor="middle" fontSize={9} fontWeight={700} fill={c}>
                    {r.n}
                  </text>
                  <text x={108} y={44 + i * 38} fontSize={8} fill={c}>
                    {r.q}
                  </text>
                  <text x={108} y={58 + i * 38} fontSize={8} fontWeight={active ? 700 : 400} fill={c}>
                    재는 값 · {r.m}
                  </text>
                </g>
              );
            })}
            <text x={24} y={20} fontSize={9} fill={MUTED}>
              구성도가 아니라 잰 값으로 판정합니다
            </text>
            <text x={24} y={192} fontSize={8} fontWeight={700} fill={step === 3 ? BAD : MUTED}>
              {step === 3
                ? "마지막 줄은 인프라 점검이 아니라 배포 파이프라인 점검입니다."
                : "네 줄을 모두 잰 뒤에야 옮기는 시간을 합산할 수 있습니다."}
            </text>
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
