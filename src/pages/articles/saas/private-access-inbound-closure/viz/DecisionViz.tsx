import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: PerRequestDecision.tsx — 위치 기반에서 요청 기반으로, 그리고 자격 증명 수명 */
const SCENES = ["위치로 판정", "요청으로 판정", "같은 사람, 다른 결과", "수명과 철회"] as const;
const NOTES = [
  "내부 주소에서 왔다는 사실이 통과 근거가 되면 그 구역에 들어온 모든 것이 통과합니다.",
  "판정에 신원과 기기 상태가 함께 들어갑니다. 접속 여부는 근거가 아니라 신호 하나로 내려갑니다.",
  "같은 사람이라도 관리되지 않는 기기로 요청하면 그 요청만 거절됩니다.",
  "판정 결과가 오래 살면 정교한 판정도 의미가 줄어듭니다. 짧은 수명이 철회를 실제로 작동시킵니다.",
] as const;

const LOC = "#ef4444";
const REQ = "#6366f1";
const OK = "#10b981";
const DENY = "#ef4444";
const TIME = "#f59e0b";
const MUTED = "#94a3b8";

export default function DecisionViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="통과 기준"
      title="판단 근거가 어디에서 왔는지에서 누가 무엇으로에 옮겨 갑니다"
      description="두 기준이 같은 요청에 주는 결과를 비교합니다."
      note="판정 신호의 구성과 가중치는 조직마다 다르며 이 글은 권고값을 제시하지 않습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="접근 판정 기준의 전환"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step === 0 && (
              <g>
                <text x={24} y={26} fontSize={9} fill={MUTED}>
                  통과 근거: 출발지 주소가 내부 대역인가
                </text>
                <rect x={24} y={44} width={180} height={90} fill={LOC} fillOpacity={0.06} stroke={LOC} strokeWidth={1} strokeDasharray="4 3" />
                <text x={114} y={60} textAnchor="middle" fontSize={9} fontWeight={700} fill={LOC}>
                  특권 구역
                </text>
                {["정상 사용자", "감염된 기기", "탈취된 계정"].map((t, i) => (
                  <g key={t}>
                    <rect x={38} y={68 + i * 22} width={152} height={18} fill={LOC} fillOpacity={0.14} stroke={LOC} strokeWidth={1} />
                    <text x={114} y={81 + i * 22} textAnchor="middle" fontSize={8} fill={LOC}>
                      {t}
                    </text>
                  </g>
                ))}
                <line x1={204} y1={89} x2={266} y2={89} stroke={LOC} strokeWidth={1.25} />
                <rect x={266} y={72} width={100} height={34} fill={OK} fillOpacity={0.1} stroke={OK} strokeWidth={1} />
                <text x={316} y={93} textAnchor="middle" fontSize={9} fontWeight={700} fill={OK}>
                  전부 통과
                </text>
                <text x={24} y={162} fontSize={8} fill={LOC}>
                  구역에 들어온 방법이 무엇이든 통과 근거는 같습니다.
                </text>
              </g>
            )}
            {step >= 1 && step <= 2 && (
              <g>
                <text x={24} y={26} fontSize={9} fill={MUTED}>
                  통과 근거: 누가 · 어떤 기기로 · 무엇에
                </text>
                {[
                  { n: "신원", v: "확인됨", ok: true },
                  { n: "기기", v: step === 2 ? "미관리 기기" : "관리 대상", ok: step !== 2 },
                  { n: "상태 점검", v: step === 2 ? "기록 없음" : "최근 통과", ok: step !== 2 },
                  { n: "요청 대상", v: "부여 목록 안", ok: true },
                ].map((s, i) => (
                  <g key={s.n}>
                    <rect x={24} y={44 + i * 30} width={80} height={24} fill={REQ} fillOpacity={0.1} stroke={REQ} strokeWidth={1} />
                    <text x={64} y={60 + i * 30} textAnchor="middle" fontSize={8} fontWeight={700} fill={REQ}>
                      {s.n}
                    </text>
                    <rect x={112} y={44 + i * 30} width={120} height={24} fill={s.ok ? OK : DENY} fillOpacity={0.12} stroke={s.ok ? OK : DENY} strokeWidth={1} />
                    <text x={172} y={60 + i * 30} textAnchor="middle" fontSize={8} fill={s.ok ? OK : DENY}>
                      {s.v}
                    </text>
                  </g>
                ))}
                <line x1={232} y1={98} x2={280} y2={98} stroke={MUTED} strokeWidth={1} />
                <rect x={280} y={78} width={110} height={40} fill={step === 2 ? DENY : OK} fillOpacity={0.14} stroke={step === 2 ? DENY : OK} strokeWidth={1.25} />
                <text x={335} y={96} textAnchor="middle" fontSize={9} fontWeight={700} fill={step === 2 ? DENY : OK}>
                  {step === 2 ? "이 요청 거절" : "이 요청 허용"}
                </text>
                <text x={335} y={110} textAnchor="middle" fontSize={8} fill={step === 2 ? DENY : OK}>
                  {step === 2 ? "같은 사람이어도" : "요청 단위로"}
                </text>
                <text x={24} y={176} fontSize={8} fill={MUTED}>
                  {step === 2
                    ? "판정이 요청 단위라 기기를 고치면 다음 요청부터 다시 통과합니다."
                    : "사설망 접속 여부는 근거가 아니라 참고 신호 하나로 내려갑니다."}
                </text>
              </g>
            )}
            {step === 3 && (
              <g>
                <text x={24} y={26} fontSize={9} fill={MUTED}>
                  판정이 통과한 뒤 발급되는 자격 증명의 수명
                </text>
                <rect x={24} y={44} width={100} height={26} fill={MUTED} fillOpacity={0.08} stroke={MUTED} strokeWidth={1} />
                <text x={74} y={61} textAnchor="middle" fontSize={9} fill={MUTED}>
                  긴 수명
                </text>
                <rect x={132} y={44} width={324} height={26} fill={DENY} fillOpacity={0.16} stroke={DENY} strokeWidth={1} />
                <text x={294} y={61} textAnchor="middle" fontSize={8} fontWeight={700} fill={DENY}>
                  기기 상태가 나빠지거나 사람이 떠나도 계속 통과
                </text>
                <rect x={24} y={82} width={100} height={26} fill={MUTED} fillOpacity={0.08} stroke={MUTED} strokeWidth={1} />
                <text x={74} y={99} textAnchor="middle" fontSize={9} fill={MUTED}>
                  짧은 수명
                </text>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <rect key={i} x={132 + i * 54} width={48} y={82} height={26} fill={TIME} fillOpacity={0.16} stroke={TIME} strokeWidth={1} />
                ))}
                <text x={294} y={126} textAnchor="middle" fontSize={8} fontWeight={700} fill={TIME}>
                  만료될 때마다 다시 판정을 받습니다
                </text>
                <text x={24} y={152} fontSize={8} fill={OK}>
                  철회는 취소를 전파하는 대신 다음 갱신을 거절하기만 하면 됩니다.
                </text>
                <text x={24} y={172} fontSize={8} fill={DENY}>
                  대신 갱신 경로가 가용성의 일부가 되고, 수명이 짧을수록 영향이 빨리 도달합니다.
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
