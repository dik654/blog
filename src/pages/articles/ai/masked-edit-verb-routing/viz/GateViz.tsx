import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: RoutingGate.tsx — 세 가지 배치와 시간 비용 */
const SCENES = ["모델 고정", "에이전트가 선택", "표가 선택", "시간 비용"] as const;
const NOTES = [
  "여섯 동작 중 넷이 나빠집니다. 한 모델이 모든 동작을 잘하지 않기 때문입니다.",
  "에이전트는 이 측정을 모르므로 최근에 본 이름을 고릅니다. 표를 버리는 선택입니다.",
  "호출하는 쪽은 동작만 말하고 모델과 마스크 확장값은 표가 정합니다.",
  "모델을 바꾸면 가중치를 다시 올립니다. 콜드 실행 시간의 절반 이상이 그 값입니다.",
] as const;

const BAD = "#ef4444";
const MID = "#f59e0b";
const OK = "#10b981";
const LOAD = "#8b5cf6";
const MUTED = "#94a3b8";

/** 실측 초 — 2026-09-11, 모델을 내린 직후 / 연속 실행 */
const T = [
  { m: "LaMa", cold: 2.0, warm: 0.5 },
  { m: "illustrious", cold: 17.9, warm: 8.0 },
  { m: "klein", cold: 23.3, warm: 8.5 },
  { m: "zimage", cold: 25.0, warm: 10.8 },
  { m: "krea2", cold: 26.2, warm: 13.9 },
  { m: "flux1dev", cold: 47.9, warm: 26.1 },
  { m: "kontext", cold: 55.1, warm: 26.1 },
];

export default function GateViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="판정"
      title="선택을 어디에 둘 것인가"
      description="세 가지 배치와 그 각각이 치르는 비용입니다."
      note="시간은 한 장비의 실측이며 같은 시드 재실행은 캐시가 답하므로 제외했습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="모델 선택의 배치와 시간 비용"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step <= 2 && (
              <g>
                <text x={24} y={26} fontSize={9} fill={MUTED}>
                  사용자: "벨트를 진한 빨간 가죽으로"
                </text>
                <rect x={24} y={44} width={120} height={34} fill={MUTED} fillOpacity={0.06} stroke={MUTED} strokeWidth={1} />
                <text x={84} y={65} textAnchor="middle" fontSize={9} fill={MUTED}>
                  요청
                </text>
                <line x1={144} y1={61} x2={180} y2={61} stroke={MUTED} strokeWidth={1} />
                <rect
                  x={180}
                  y={44}
                  width={150}
                  height={34}
                  fill={step === 2 ? OK : step === 1 ? MID : BAD}
                  fillOpacity={0.14}
                  stroke={step === 2 ? OK : step === 1 ? MID : BAD}
                  strokeWidth={1.25}
                />
                <text x={255} y={65} textAnchor="middle" fontSize={9} fontWeight={700} fill={step === 2 ? OK : step === 1 ? MID : BAD}>
                  {step === 0 ? "고정된 한 모델" : step === 1 ? "에이전트가 이름 선택" : "동작 → 표 → 모델"}
                </text>
                <line x1={330} y1={61} x2={366} y2={61} stroke={MUTED} strokeWidth={1} />
                <rect x={366} y={44} width={90} height={34} fill={step === 2 ? OK : BAD} fillOpacity={0.1} stroke={step === 2 ? OK : BAD} strokeWidth={1} />
                <text x={411} y={65} textAnchor="middle" fontSize={9} fontWeight={700} fill={step === 2 ? OK : BAD}>
                  {step === 2 ? "적합" : "부적합"}
                </text>

                {step === 0 && (
                  <g>
                    <text x={24} y={110} fontSize={9} fontWeight={700} fill={BAD}>
                      여섯 동작 중 넷이 나빠집니다
                    </text>
                    <text x={24} y={130} fontSize={8} fill={MUTED}>
                      보수형을 고정하면 더하기와 재질 변경이 무동작이 되고,
                    </text>
                    <text x={24} y={146} fontSize={8} fill={MUTED}>
                      과잉형을 고정하면 색 변경에서 형태까지 재구성합니다.
                    </text>
                  </g>
                )}
                {step === 1 && (
                  <g>
                    <text x={24} y={110} fontSize={9} fontWeight={700} fill={MID}>
                      49회 측정을 모르는 채로 고릅니다
                    </text>
                    <text x={24} y={130} fontSize={8} fill={MUTED}>
                      최근 맥락에 등장한 이름이나 유명한 이름으로 끌립니다.
                    </text>
                    <text x={24} y={146} fontSize={8} fill={MUTED}>
                      측정을 해 놓고 쓰지 않는 배치입니다.
                    </text>
                  </g>
                )}
                {step === 2 && (
                  <g>
                    <text x={24} y={110} fontSize={9} fontWeight={700} fill={OK}>
                      호출하는 쪽은 동작만 말합니다
                    </text>
                    <text x={24} y={130} fontSize={8} fill={OK}>
                      마스크 확장값도 동작에서 따라옵니다 — 교체 96, 지우기 0.
                    </text>
                    <text x={24} y={150} fontSize={8} fill={MUTED}>
                      실제 요청 일곱 건에서 선택된 모델이 매번 표의 예측과 같았습니다.
                    </text>
                    <text x={24} y={170} fontSize={8} fill={MUTED}>
                      다섯 건 예측대로, 한 건은 실패 지점이 숫자로 특정, 한 건은 연산 전 거절.
                    </text>
                  </g>
                )}
              </g>
            )}
            {step === 3 && (
              <g>
                <text x={24} y={20} fontSize={9} fill={MUTED}>
                  모델을 내린 직후(콜드) 대 연속 실행(웜) · 초
                </text>
                {T.map((t, i) => (
                  <g key={t.m}>
                    <text x={76} y={40 + i * 22} textAnchor="end" fontSize={8} fill={MUTED}>
                      {t.m}
                    </text>
                    <rect x={84} y={30 + i * 22} width={(t.cold / 60) * 300} height={13} fill={LOAD} fillOpacity={0.22} stroke={LOAD} strokeWidth={1} />
                    <rect x={84} y={30 + i * 22} width={(t.warm / 60) * 300} height={13} fill={OK} fillOpacity={0.35} stroke={OK} strokeWidth={1} />
                    <text x={84 + (t.cold / 60) * 300 + 6} y={40 + i * 22} fontSize={7} fill={MUTED}>
                      {t.warm} → {t.cold}
                    </text>
                  </g>
                ))}
                <text x={24} y={192} fontSize={8} fontWeight={700} fill={LOAD}>
                  보라색 구간이 가중치 적재입니다. 콜드 시간의 절반 이상을 차지합니다.
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
