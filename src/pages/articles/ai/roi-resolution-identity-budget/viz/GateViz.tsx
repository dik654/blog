import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: ResolutionGate.tsx — 편집 전 확인 네 항목 */
const SCENES = ["대상 해상도", "노이즈 구간", "크롭 예산", "마스크 크기"] as const;
const NOTES = [
  "그 대상이 잠재 공간에서 충분한 칸을 받는지 먼저 봅니다. 프레임 크기가 아닙니다.",
  "모델 종류에 맞는 구간을 쓰고 있는지 확인합니다. 지시 편집기에서는 중간값이 무동작입니다.",
  "크롭이 모델의 픽셀 예산 안에 있는지 봅니다. 넘기면 대상이 오히려 작아집니다.",
  "동작에 맞는 크기인지 봅니다. 부위 편집은 좁게, 물건 교체는 넓게입니다.",
] as const;

const Q1 = "#6366f1";
const Q2 = "#f59e0b";
const Q3 = "#8b5cf6";
const Q4 = "#10b981";
const MUTED = "#94a3b8";

const ROWS = [
  { n: "대상", q: "그 대상이 몇 픽셀인가", m: "잠재 칸 수", c: Q1 },
  { n: "구간", q: "모델 종류에 맞는 노이즈 비율인가", m: "유효 창의 폭", c: Q2 },
  { n: "예산", q: "크롭이 모델 예산 안에 있는가", m: "리샘플 후 대상 크기", c: Q3 },
  { n: "마스크", q: "동작에 맞는 크기인가", m: "재생성 범위의 비율", c: Q4 },
];

export default function GateViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="판정"
      title="모델을 바꾸지 않고 답할 수 있는 네 가지"
      description="이 회차에서 결과를 가장 크게 바꾼 변경도 모델 교체가 아니었습니다."
      note="네 항목은 이 기록이 정리한 점검 틀이며 표준 절차가 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="해상도 점검 항목"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            <text x={24} y={20} fontSize={9} fill={MUTED}>
              설정을 조정하기 전에
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
                    보는 값 · {r.m}
                  </text>
                </g>
              );
            })}
            <text x={24} y={192} fontSize={8} fontWeight={700} fill={Q4}>
              마스크를 좁힌 것 하나로 정체성이 0.142에서 0.943이 됐습니다.
            </text>
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
