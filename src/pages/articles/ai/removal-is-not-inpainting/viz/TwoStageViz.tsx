import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: TwoStageRejected.tsx — 세 게이트, 숫자를 뒤집은 그림, 미리 적어 둔 예측 */
const SCENES = ["세 가지 문", "최고점이 실패", "문이 닿지 않음", "미리 적어 둔 예측"] as const;
const NOTES = [
  "다시 그리기가 구멍을 채우지 못하게 막는 문을 셋으로 놓고 비교했습니다.",
  "가장 높은 마스크 안 변화량이 지운 물건을 되살린 결과였습니다.",
  "구멍 전체와 경계 띠의 결과가 소수점 첫째 자리까지 같습니다. 문이 결과에 닿지 않았습니다.",
  "실행 전에 적어 둔 예측이 그대로 맞았고, 그 덕분에 그럴듯한 오답을 쓰지 않았습니다.",
] as const;

const G1 = "#6366f1";
const G2 = "#8b5cf6";
const G3 = "#f59e0b";
const BAD = "#ef4444";
const OK = "#10b981";
const MUTED = "#94a3b8";

/** 실측 마스크 안 변화 (/255) — 단독 / 전체 refine / 경계 띠 */
const ROWS = [
  { n: "3D", solo: 39.4, full: 38.3, ring: 38.3, dd: 93.2 },
  { n: "사진", solo: 34.6, full: 33.0, ring: 33.0, dd: 38.9 },
  { n: "애니", solo: 61.8, full: 61.3, ring: 61.5, dd: 60.4 },
  { n: "유화", solo: 58.2, full: 56.0, ring: 56.1, dd: 51.3 },
];

export default function TwoStageViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="2단계 조합"
      title="전용 망으로 지우고 확산으로 다시 그리기"
      description="문을 셋으로 나눠 각각이 무엇을 막는지 비교했습니다."
      note="다시 그리기에 증류된 빠른 모델을 썼으므로 기각의 범위도 그 조건까지입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="2단계 조합의 게이트 비교"
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
                  전용 망이 비운 뒤, 다시 그리기가 무엇을 볼 수 있게 할 것인가
                </text>
                {[
                  { n: "구멍 전체", c: G1, d: "문 없음 — 원래 실패한 방식" },
                  { n: "경계 띠만", c: G2, d: "이음새만 열고 안쪽은 잠금" },
                  { n: "경계 띠 + 시작 시각", c: G3, d: "픽셀마다 다른 시점에 풀림" },
                ].map((g, i) => (
                  <g key={g.n}>
                    <rect x={24} y={44 + i * 42} width={150} height={32} fill={g.c} fillOpacity={0.14} stroke={g.c} strokeWidth={1.25} />
                    <text x={99} y={64 + i * 42} textAnchor="middle" fontSize={9} fontWeight={700} fill={g.c}>
                      {g.n}
                    </text>
                    <text x={190} y={64 + i * 42} fontSize={8} fill={g.c}>
                      {g.d}
                    </text>
                  </g>
                ))}
                <text x={24} y={184} fontSize={8} fill={MUTED}>
                  세 번째는 이론상 경계만 보고 안쪽은 구조적으로 건드릴 수 없어야 합니다.
                </text>
              </g>
            )}
            {step === 1 && (
              <g>
                <text x={24} y={26} fontSize={9} fill={MUTED}>
                  3D 그림체 · 세 번째 문 적용
                </text>
                <rect x={24} y={44} width={200} height={60} fill={G3} fillOpacity={0.14} stroke={G3} strokeWidth={1.25} />
                <text x={124} y={66} textAnchor="middle" fontSize={10} fontWeight={700} fill={G3}>
                  마스크 안 변화 93.2
                </text>
                <text x={124} y={86} textAnchor="middle" fontSize={8} fill={G3}>
                  전 팔 중 가장 높음 — 가장 철저히 지운 것처럼 읽힘
                </text>
                <line x1={230} y1={74} x2={256} y2={74} stroke={MUTED} strokeWidth={1} />
                <rect x={256} y={44} width={200} height={60} fill={BAD} fillOpacity={0.12} stroke={BAD} strokeWidth={1.25} />
                <text x={356} y={66} textAnchor="middle" fontSize={10} fontWeight={700} fill={BAD}>
                  확대해 보면
                </text>
                <text x={356} y={86} textAnchor="middle" fontSize={8} fill={BAD}>
                  흰 띠를 새로 만들어 붙였습니다
                </text>
                <text x={24} y={136} fontSize={9} fontWeight={700} fill={BAD}>
                  지운 물건을 되살린 결과가 최고점을 받았습니다.
                </text>
                <text x={24} y={158} fontSize={8} fill={MUTED}>
                  이 방식은 어디를 바꿀지는 강제하지만 무엇을 그릴지는 강제하지 않습니다.
                </text>
                <text x={24} y={176} fontSize={8} fill={MUTED}>
                  경계에서 시작한 생성이 안쪽으로 번질 여지를 사전지식이 채웠습니다.
                </text>
              </g>
            )}
            {step === 2 && (
              <g>
                <text x={24} y={20} fontSize={9} fill={MUTED}>
                  마스크 안 변화 (/255)
                </text>
                {ROWS.map((r, i) => (
                  <g key={r.n}>
                    <text x={66} y={62 + i * 30} textAnchor="end" fontSize={8} fontWeight={700} fill={MUTED}>
                      {r.n}
                    </text>
                    <text x={84} y={62 + i * 30} fontSize={9} fill={OK}>
                      {r.solo.toFixed(1)}
                    </text>
                    <text x={150} y={62 + i * 30} fontSize={9} fontWeight={700} fill={G1}>
                      {r.full.toFixed(1)}
                    </text>
                    <text x={216} y={62 + i * 30} fontSize={9} fontWeight={700} fill={G2}>
                      {r.ring.toFixed(1)}
                    </text>
                    <text x={280} y={62 + i * 30} fontSize={8} fill={Math.abs(r.full - r.ring) < 0.25 ? BAD : MUTED}>
                      차이 {Math.abs(r.full - r.ring).toFixed(1)}
                    </text>
                  </g>
                ))}
                <text x={84} y={38} fontSize={7} fill={OK}>
                  단독
                </text>
                <text x={150} y={38} fontSize={7} fill={G1}>
                  전체
                </text>
                <text x={216} y={38} fontSize={7} fill={G2}>
                  경계
                </text>
                <text x={24} y={176} fontSize={9} fontWeight={700} fill={BAD}>
                  문을 좁혔는데 결과가 소수점 첫째 자리까지 같습니다.
                </text>
                <text x={24} y={194} fontSize={8} fill={MUTED}>
                  그 문이 결과에 아무 영향을 주지 않았다는 뜻입니다.
                </text>
              </g>
            )}
            {step === 3 && (
              <g>
                <text x={24} y={26} fontSize={9} fill={MUTED}>
                  실행 전 스크립트 주석에 적어 둔 것
                </text>
                <rect x={24} y={42} width={432} height={72} fill={OK} fillOpacity={0.08} stroke={OK} strokeWidth={1.25} />
                <text x={40} y={62} fontSize={8} fill={OK}>
                  "이음새는 애초에 이 모델의 문제가 아니다. 눈에 보이는 약점은 구멍 안의
                </text>
                <text x={40} y={78} fontSize={8} fill={OK}>
                  뭉개진 질감이고, 이음새만 여는 문은 구조적으로 거기 닿을 수 없다.
                </text>
                <text x={40} y={94} fontSize={8} fill={OK}>
                  숫자가 좋아지는데 질감이 그대로면, 정직한 해석은 고장나지 않은 것을 고쳤다는 것이다."
                </text>
                <text x={24} y={140} fontSize={9} fontWeight={700} fill={OK}>
                  그대로 됐습니다.
                </text>
                <text x={24} y={162} fontSize={8} fill={MUTED}>
                  바닥값을 빼면 다시 그리기의 마스크 밖 누출이 0.04~0.33으로 사실상 0이라,
                </text>
                <text x={24} y={178} fontSize={8} fill={MUTED}>
                  "경계 게이트가 침범을 줄였다"고 쓸 근거가 숫자에는 있었습니다.
                </text>
                <text x={24} y={196} fontSize={8} fontWeight={700} fill={BAD}>
                  열두 칸 전부 단독보다 나은 칸이 없고 시간은 2~8배가 됩니다.
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
