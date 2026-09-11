import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: ServiceGap.tsx — 기본 서비스의 맹점과 선택기 확장점 */
const SCENES = ["요청 수로 나누면", "부하는 안 고르다", "선택 확장점", "지표의 신선도"] as const;
const NOTES = [
  "기본 서비스는 준비 상태인 파드 목록만 보고 연결을 나눕니다. 셋 다 두 개씩 받습니다.",
  "요청 하나의 비용이 수십 배씩 다르므로 요청 수가 같아도 실제 부하는 크게 벌어집니다.",
  "묶음을 자원으로 선언하고 어느 엔드포인트로 보낼지는 별도 선택기가 모델 서버 지표를 보고 정합니다.",
  "지표는 긁는 주기만큼 지난 값입니다. 그 사이 보낸 요청을 따로 세지 않으면 한곳으로 몰립니다.",
] as const;

const SVC = "#94a3b8";
const BAD = "#ef4444";
const EPP = "#6366f1";
const OK = "#10b981";
const STALE = "#f59e0b";
const MUTED = "#94a3b8";

/** 각 복제본이 받은 요청 수는 같지만 토큰으로 환산한 부하는 다릅니다 */
const REPLICAS = [
  { n: "복제본 1", reqs: 2, load: 0.95, note: "긴 입력 2건" },
  { n: "복제본 2", reqs: 2, load: 0.35, note: "짧은 요청 2건" },
  { n: "복제본 3", reqs: 2, load: 0.15, note: "거의 끝난 2건" },
];

export default function EndpointViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="확장점"
      title="분배 규칙을 바꾸기 전에 지표가 들어갈 자리를 만듭니다"
      description="기본 서비스가 못 보는 것과 선택기가 보는 것을 비교합니다."
      note="부하 막대는 구조를 보여 주기 위한 예시이며 실제 측정값이 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="엔드포인트 선택 확장점"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step <= 1 && (
              <g>
                <rect x={24} y={76} width={86} height={30} fill={SVC} fillOpacity={0.08} stroke={SVC} strokeWidth={1} />
                <text x={67} y={95} textAnchor="middle" fontSize={9} fill={SVC}>
                  기본 서비스
                </text>
                <text x={24} y={62} fontSize={8} fill={MUTED}>
                  준비 상태 목록만 봄
                </text>
                {REPLICAS.map((r, i) => (
                  <g key={r.n}>
                    <line x1={110} y1={91} x2={168} y2={54 + i * 42} stroke={SVC} strokeWidth={1} />
                    <rect x={168} y={40 + i * 42} width={96} height={28} fill={step === 1 ? BAD : SVC} fillOpacity={0.1} stroke={step === 1 ? BAD : SVC} strokeWidth={1} />
                    <text x={216} y={58 + i * 42} textAnchor="middle" fontSize={9} fontWeight={700} fill={step === 1 ? BAD : SVC}>
                      {r.n}
                    </text>
                    <text x={272} y={51 + i * 42} fontSize={8} fill={MUTED}>
                      요청 {r.reqs}건
                    </text>
                    {step === 1 && (
                      <g>
                        <rect x={272} y={56 + i * 42} width={r.load * 130} height={10} fill={BAD} fillOpacity={0.25} stroke={BAD} strokeWidth={1} />
                        <text x={272 + r.load * 130 + 6} y={65 + i * 42} fontSize={7} fill={BAD}>
                          {r.note}
                        </text>
                      </g>
                    )}
                  </g>
                ))}
                <text x={24} y={182} fontSize={8} fill={step === 1 ? BAD : MUTED}>
                  {step === 1
                    ? "요청 수는 2·2·2로 같은데 실제 부하는 거의 여섯 배까지 벌어집니다."
                    : "고르는 기준은 연결 수준이라 그 파드가 지금 무엇을 하는지는 보지 않습니다."}
                </text>
              </g>
            )}
            {step === 2 && (
              <g>
                <rect x={24} y={76} width={80} height={30} fill={MUTED} fillOpacity={0.06} stroke={MUTED} strokeWidth={1} />
                <text x={64} y={95} textAnchor="middle" fontSize={9} fill={MUTED}>
                  프록시
                </text>
                <line x1={104} y1={91} x2={140} y2={91} stroke={MUTED} strokeWidth={1} />
                <rect x={140} y={72} width={110} height={38} fill={EPP} fillOpacity={0.14} stroke={EPP} strokeWidth={1.25} />
                <text x={195} y={88} textAnchor="middle" fontSize={9} fontWeight={700} fill={EPP}>
                  엔드포인트 선택기
                </text>
                <text x={195} y={102} textAnchor="middle" fontSize={8} fill={EPP}>
                  확장 지점
                </text>
                <rect x={296} y={36} width={160} height={116} fill={OK} fillOpacity={0.05} stroke={OK} strokeWidth={1} strokeDasharray="4 3" />
                <text x={376} y={30} textAnchor="middle" fontSize={9} fontWeight={700} fill={OK}>
                  모델 엔드포인트 묶음
                </text>
                {REPLICAS.map((r, i) => (
                  <g key={r.n}>
                    <rect x={308} y={46 + i * 36} width={136} height={26} fill={OK} fillOpacity={0.12} stroke={OK} strokeWidth={1} />
                    <text x={376} y={63 + i * 36} textAnchor="middle" fontSize={8} fontWeight={700} fill={OK}>
                      {r.n}
                    </text>
                    <path d={`M 308 ${59 + i * 36} L 250 ${82 + (i - 1) * 4}`} fill="none" stroke={EPP} strokeWidth={1} strokeDasharray="3 2" />
                  </g>
                ))}
                <text x={24} y={158} fontSize={8} fontWeight={700} fill={EPP}>
                  선택기가 보는 값 · 대기 중인 요청 수 · 캐시 사용 상황 · 적재된 어댑터
                </text>
                <text x={24} y={176} fontSize={8} fill={MUTED}>
                  값이 모델 서버에서 오므로 프록시가 추측할 필요가 없습니다.
                </text>
                <text x={24} y={192} fontSize={8} fill={BAD}>
                  대신 선택기가 모든 요청 경로에 들어가 그 지연과 가용성이 그대로 반영됩니다.
                </text>
              </g>
            )}
            {step === 3 && (
              <g>
                <line x1={40} y1={100} x2={456} y2={100} stroke={MUTED} strokeWidth={1} />
                <text x={40} y={118} fontSize={8} fill={MUTED}>
                  지표를 긁은 시각
                </text>
                <text x={456} y={118} textAnchor="end" fontSize={8} fill={MUTED}>
                  다음에 긁을 시각
                </text>
                <line x1={40} y1={92} x2={40} y2={108} stroke={STALE} strokeWidth={1.25} />
                <line x1={456} y1={92} x2={456} y2={108} stroke={STALE} strokeWidth={1.25} />
                {[0, 1, 2, 3, 4].map((i) => (
                  <g key={i}>
                    <line x1={110 + i * 70} y1={100} x2={110 + i * 70} y2={70} stroke={BAD} strokeWidth={1} strokeDasharray="2 2" />
                    <circle cx={110 + i * 70} cy={66} r={4} fill={BAD} fillOpacity={0.3} stroke={BAD} strokeWidth={1} />
                  </g>
                ))}
                <text x={110} y={52} fontSize={8} fontWeight={700} fill={BAD}>
                  이 구간에 도착한 요청은 옛 지표를 보고 같은 곳으로 갑니다
                </text>
                <text x={40} y={152} fontSize={8} fill={MUTED}>
                  주기를 줄이면 모델 서버에 부담이 되고, 늘리면 더 지난 값으로 고르게 됩니다.
                </text>
                <text x={40} y={170} fontSize={8} fill={OK}>
                  구현들은 보낸 직후의 요청을 따로 세어 이 구간을 보정합니다.
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
