import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: Overview.tsx — 서버 쪽 숫자와 건물 쪽 숫자를 짝짓기 */
const SCENES = ["냉각", "전력", "하중", "내진"] as const;
const NOTES = [
  "서버가 요구하는 냉각 방식과 전산실이 제공할 수 있는 설비를 맞춥니다.",
  "섀시 지속 부하의 합과 랙당 회로 용량을 맞춥니다.",
  "랙 총 무게에서 나온 면하중·점하중과 바닥 허용치를 맞춥니다.",
  "랙 등급과 고정 방식을 지역 기준과 건물 설계에 맞춥니다.",
] as const;

const SRV = "#6366f1";
const BLD = "#f59e0b";
const OKC = "#10b981";
const MUTED = "#94a3b8";

const PAIRS = [
  { k: "냉각", s: "요구 냉각 방식", b: "전산실 설비" },
  { k: "전력", s: "섀시 지속 부하 합", b: "랙당 회로 용량" },
  { k: "하중", s: "랙 총 무게", b: "바닥 허용치" },
  { k: "내진", s: "랙 등급·고정 방식", b: "지역 기준·건물 설계" },
];

export default function ReadinessViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="현장 조건"
      title="서버 쪽 숫자와 건물 쪽 숫자를 한 표에 놓습니다"
      description="네 항목마다 확인 주체가 다르다는 점이 어긋남의 원인입니다."
      note="구체적인 허용치와 요구 등급은 지역 기준과 건물마다 다릅니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="현장 조건 확인 항목"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            <text x={30} y={30} fontSize={9} fontWeight={700} fill={SRV}>
              서버 쪽 숫자
            </text>
            <text x={300} y={30} fontSize={9} fontWeight={700} fill={BLD}>
              건물 쪽 숫자
            </text>
            {PAIRS.map((p, i) => {
              const active = i === step;
              const done = i < step;
              const y = 40 + i * 38;
              return (
                <g key={p.k}>
                  <rect x={30} y={y} width={170} height={28} fill={SRV} fillOpacity={active ? 0.16 : done ? 0.08 : 0.04} stroke={active ? SRV : MUTED} strokeWidth={active ? 1.25 : 1} />
                  <text x={40} y={y + 18} fontSize={9} fill={active ? SRV : MUTED}>
                    {p.s}
                  </text>
                  <line x1={200} y1={y + 14} x2={300} y2={y + 14} stroke={active ? OKC : MUTED} strokeWidth={active ? 1.25 : 1} strokeDasharray={active ? "0" : "3 2"} />
                  <rect x={300} y={y} width={150} height={28} fill={BLD} fillOpacity={active ? 0.16 : done ? 0.08 : 0.04} stroke={active ? BLD : MUTED} strokeWidth={active ? 1.25 : 1} />
                  <text x={310} y={y + 18} fontSize={9} fill={active ? BLD : MUTED}>
                    {p.b}
                  </text>
                </g>
              );
            })}
            <text x={30} y={192} fontSize={9} fill={MUTED}>
              확인 주체가 달라 두 숫자가 만나지 않으면 도착 후에야 드러납니다
            </text>
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
