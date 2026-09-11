import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: TradeoffGate.tsx — 경로별 강도, 관측, 우회 점검 */
const SCENES = ["경로별 강도", "무엇을 볼 것인가", "우회 점검", "판정"] as const;
const NOTES = [
  "모든 경로에 같은 강도를 거는 순간 가장 민감한 경로가 기준이 되어 나머지가 과하게 막힙니다.",
  "차단 수가 아니라 정상 사용자가 막힌 비율을 봐야 강도를 조절할 수 있습니다.",
  "검사를 건너뛰는 길이 하나라도 남아 있으면 강도 논의는 의미가 없습니다.",
  "세 항목이 모두 서면 강도를 올려도 되고, 하나라도 비면 먼저 그것을 채웁니다.",
] as const;

const OK = "#10b981";
const WARN = "#f59e0b";
const BAD = "#ef4444";
const MUTED = "#94a3b8";

const ROUTES = [
  { n: "로그인·결제", s: "강함", c: BAD, w: 0.9 },
  { n: "검색·목록", s: "보통", c: WARN, w: 0.55 },
  { n: "정적 자산", s: "약함", c: OK, w: 0.2 },
];

const CHECKS = [
  "경로마다 강도를 따로 정했다",
  "정상 사용자가 막힌 비율을 본다",
  "오리진으로 가는 우회 경로가 없다",
];

export default function GateViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="판정"
      title="강도를 올리기 전에 세 가지가 서 있어야 합니다"
      description="경로 구분·관측 지표·우회 점검 순서로 확인합니다."
      note="강도 구분은 예시이며 실제 값은 각 경로의 피해 비용에 따라 달라집니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="방어 강도 판정 기준"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 190" className="mt-4 w-full max-w-2xl">
            {step === 0 && (
              <g>
                <text x={24} y={30} fontSize={9} fill={MUTED}>
                  경로별로 잃을 것이 다르므로 강도도 달라야 합니다
                </text>
                {ROUTES.map((r, i) => (
                  <g key={r.n}>
                    <rect x={24} y={48 + i * 40} width={120} height={28} fill={r.c} fillOpacity={0.1} stroke={r.c} strokeWidth={1} />
                    <text x={84} y={66 + i * 40} textAnchor="middle" fontSize={9} fontWeight={700} fill={r.c}>
                      {r.n}
                    </text>
                    <rect x={156} y={52 + i * 40} width={r.w * 240} height={20} fill={r.c} fillOpacity={0.22} stroke={r.c} strokeWidth={1} />
                    <text x={156 + r.w * 240 + 8} y={66 + i * 40} fontSize={9} fill={r.c}>
                      {r.s}
                    </text>
                  </g>
                ))}
                <text x={24} y={182} fontSize={8} fill={MUTED}>
                  같은 강도를 전부에 걸면 정적 자산까지 결제 수준으로 막힙니다.
                </text>
              </g>
            )}
            {step === 1 && (
              <g>
                <rect x={24} y={44} width={200} height={78} fill={BAD} fillOpacity={0.08} stroke={BAD} strokeWidth={1} />
                <text x={124} y={66} textAnchor="middle" fontSize={9} fontWeight={700} fill={BAD}>
                  보기 쉬운 숫자
                </text>
                <text x={124} y={84} textAnchor="middle" fontSize={8} fill={BAD}>
                  차단 건수 · 공격 그래프
                </text>
                <text x={124} y={102} textAnchor="middle" fontSize={8} fill={BAD}>
                  올려도 내려도 늘 그럴듯합니다
                </text>
                <rect x={256} y={44} width={200} height={78} fill={OK} fillOpacity={0.1} stroke={OK} strokeWidth={1.25} />
                <text x={356} y={66} textAnchor="middle" fontSize={9} fontWeight={700} fill={OK}>
                  봐야 하는 숫자
                </text>
                <text x={356} y={84} textAnchor="middle" fontSize={8} fill={OK}>
                  정상 사용자가 막힌 비율
                </text>
                <text x={356} y={102} textAnchor="middle" fontSize={8} fill={OK}>
                  강도를 올리면 즉시 움직입니다
                </text>
                <text x={24} y={148} fontSize={8} fill={MUTED}>
                  검증 통과율·결제 이탈률처럼 사람만 겪는 지표를 함께 둡니다.
                </text>
              </g>
            )}
            {step === 2 && (
              <g>
                <rect x={24} y={48} width={110} height={34} fill={OK} fillOpacity={0.1} stroke={OK} strokeWidth={1} />
                <text x={79} y={69} textAnchor="middle" fontSize={9} fontWeight={700} fill={OK}>
                  엣지 경로
                </text>
                <line x1={134} y1={65} x2={196} y2={65} stroke={OK} strokeWidth={1.25} />
                <rect x={196} y={48} width={110} height={34} fill={MUTED} fillOpacity={0.08} stroke={MUTED} strokeWidth={1} />
                <text x={251} y={69} textAnchor="middle" fontSize={9} fill={MUTED}>
                  오리진
                </text>
                <path d="M 79 48 L 79 22 L 251 22 L 251 48" fill="none" stroke={BAD} strokeWidth={1.25} strokeDasharray="4 3" />
                <text x={320} y={26} fontSize={9} fontWeight={700} fill={BAD}>
                  한 줄이라도 남으면
                </text>
                <text x={320} y={42} fontSize={9} fontWeight={700} fill={BAD}>
                  강도 논의는 무의미
                </text>
                <text x={24} y={112} fontSize={8} fill={MUTED}>
                  점검 항목: 오리진 직접 접속 · 옛 이름 기록 · 관리용 포트 · 부가 서비스 주소
                </text>
              </g>
            )}
            {step === 3 && (
              <g>
                {CHECKS.map((c, i) => (
                  <g key={c}>
                    <rect x={24} y={44 + i * 40} width={432} height={30} fill={OK} fillOpacity={0.08} stroke={OK} strokeWidth={1} />
                    <circle cx={44} cy={59 + i * 40} r={6} fill="none" stroke={OK} strokeWidth={1.25} />
                    <path d={`M 41 ${59 + i * 40} l 2.5 3 l 5 -6`} fill="none" stroke={OK} strokeWidth={1.25} />
                    <text x={62} y={63 + i * 40} fontSize={9} fill={OK}>
                      {c}
                    </text>
                  </g>
                ))}
                <text x={24} y={180} fontSize={9} fontWeight={700} fill={MUTED}>
                  하나라도 비면 강도를 올리는 대신 그 항목을 먼저 채웁니다.
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
