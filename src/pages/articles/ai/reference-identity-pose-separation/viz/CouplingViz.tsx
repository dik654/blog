import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: ReferenceCoupling.tsx — 참조 효과, 자세 결합, 제거 실험 */
const SCENES = ["참조의 효과", "머리만 돕니다", "문구로는 안 됩니다", "참조를 빼 보면"] as const;
const NOTES = [
  "같은 회전 각도에서 참조 있음과 없음이 0.845 대 0.284입니다. 자세 교란이 없는 깨끗한 비교입니다.",
  "측면을 요구하면 머리는 60도까지 돌아가는데 어깨는 정면을 향합니다.",
  "인물 회전을 카메라 회전으로 바꿔도 각도가 소수점 한 자리까지 같습니다.",
  "참조 조건만 제거하자 몸이 실제로 돕니다. 붙잡고 있던 것이 무엇인지 확정됩니다.",
] as const;

const REF = "#10b981";
const NOREF = "#94a3b8";
const BAD = "#ef4444";
const MUTED = "#94a3b8";

/** 실측 — 참조 있음 / 없음 정체성 */
const ROWS = [
  { n: "얼굴 정면", a: 0.845, b: 0.284, yaw: 0 },
  { n: "얼굴 3/4", a: 0.644, b: 0.327, yaw: 47 },
  { n: "전신 3/4", a: 0.731, b: 0.227, yaw: 28 },
];

export default function CouplingViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="참조 조건"
      title="인물은 지켜지는데 자세도 함께 고정됩니다"
      description="효과와 대가를 같은 실행에서 봅니다."
      note="회전 각도는 결과 이미지에서 실측한 값입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="참조 조건의 효과와 자세 결합"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step === 0 && (
              <g>
                <text x={24} y={22} fontSize={9} fill={MUTED}>
                  정체성 · 참조 있음 대 없음
                </text>
                <text x={300} y={22} fontSize={8} fontWeight={700} fill={REF}>
                  있음
                </text>
                <text x={350} y={22} fontSize={8} fontWeight={700} fill={NOREF}>
                  없음
                </text>
                {ROWS.map((r, i) => (
                  <g key={r.n}>
                    <text x={96} y={52 + i * 38} textAnchor="end" fontSize={9} fontWeight={700} fill={MUTED}>
                      {r.n}
                    </text>
                    <rect x={106} y={40 + i * 38} width={r.a * 260} height={12} fill={REF} fillOpacity={0.3} stroke={REF} strokeWidth={1} />
                    <text x={106 + r.a * 260 + 6} y={50 + i * 38} fontSize={8} fontWeight={700} fill={REF}>
                      {r.a.toFixed(3)}
                    </text>
                    <rect x={106} y={54 + i * 38} width={r.b * 260} height={12} fill={NOREF} fillOpacity={0.25} stroke={NOREF} strokeWidth={1} />
                    <text x={106 + r.b * 260 + 6} y={64 + i * 38} fontSize={8} fill={NOREF}>
                      {r.b.toFixed(3)}
                    </text>
                  </g>
                ))}
                <text x={24} y={178} fontSize={8} fontWeight={700} fill={REF}>
                  얼굴 정면은 양쪽 회전각이 0도로 같아 자세 교란이 없습니다. 격차 0.56.
                </text>
              </g>
            )}
            {step === 1 && (
              <g>
                <text x={24} y={26} fontSize={9} fill={MUTED}>
                  "측면을 그려 줘"에 대한 실제 결과
                </text>
                <circle cx={140} cy={72} r={22} fill={BAD} fillOpacity={0.15} stroke={BAD} strokeWidth={1.25} />
                <line x1={140} y1={72} x2={159} y2={61} stroke={BAD} strokeWidth={1.25} />
                <text x={140} y={110} textAnchor="middle" fontSize={9} fontWeight={700} fill={BAD}>
                  머리 60도
                </text>
                <rect x={110} y={118} width={60} height={40} fill={MUTED} fillOpacity={0.1} stroke={MUTED} strokeWidth={1.25} />
                <text x={140} y={172} textAnchor="middle" fontSize={9} fontWeight={700} fill={MUTED}>
                  몸 0도
                </text>
                <text x={210} y={80} fontSize={9} fontWeight={700} fill={BAD}>
                  눈으로는 "측면인데 정면처럼 보인다"
                </text>
                <text x={210} y={100} fontSize={8} fill={MUTED}>
                  각도를 재 보니 머리만 도는 것이었습니다.
                </text>
                <text x={210} y={128} fontSize={8} fill={MUTED}>
                  정면·사분의삼·준측면까지는 나오지만
                </text>
                <text x={210} y={146} fontSize={8} fontWeight={700} fill={BAD}>
                  진짜 90도 측면은 나오지 않습니다.
                </text>
              </g>
            )}
            {step === 2 && (
              <g>
                <text x={24} y={26} fontSize={9} fill={MUTED}>
                  같은 요구를 다른 문장으로
                </text>
                {[
                  { p: "그녀가 돈다", a: 59.5, b: 28.3 },
                  { p: "카메라가 돈다", a: 59.9, b: 28.0 },
                ].map((r, i) => (
                  <g key={r.p}>
                    <rect x={24} y={44 + i * 46} width={160} height={34} fill={MUTED} fillOpacity={0.08} stroke={MUTED} strokeWidth={1} />
                    <text x={104} y={66 + i * 46} textAnchor="middle" fontSize={9} fontWeight={700} fill={MUTED}>
                      {r.p}
                    </text>
                    <text x={210} y={60 + i * 46} fontSize={9} fill={BAD}>
                      측면 {r.a.toFixed(1)}도
                    </text>
                    <text x={320} y={60 + i * 46} fontSize={9} fill={BAD}>
                      사분의삼 {r.b.toFixed(1)}도
                    </text>
                  </g>
                ))}
                <text x={24} y={158} fontSize={9} fontWeight={700} fill={BAD}>
                  차이가 측정 오차 수준입니다.
                </text>
                <text x={24} y={178} fontSize={8} fill={MUTED}>
                  문장의 문제가 아니라 조건이 자세를 붙잡고 있는 구조의 문제입니다.
                </text>
              </g>
            )}
            {step === 3 && (
              <g>
                <text x={24} y={26} fontSize={9} fill={MUTED}>
                  같은 프롬프트에서 참조 조건만 제거
                </text>
                <rect x={24} y={46} width={200} height={56} fill={BAD} fillOpacity={0.1} stroke={BAD} strokeWidth={1.25} />
                <text x={124} y={68} textAnchor="middle" fontSize={9} fontWeight={700} fill={BAD}>
                  참조 있음
                </text>
                <text x={124} y={88} textAnchor="middle" fontSize={8} fill={BAD}>
                  인물 유지 · 몸은 정면 고정
                </text>
                <rect x={256} y={46} width={200} height={56} fill={REF} fillOpacity={0.1} stroke={REF} strokeWidth={1.25} />
                <text x={356} y={68} textAnchor="middle" fontSize={9} fontWeight={700} fill={REF}>
                  참조 없음
                </text>
                <text x={356} y={88} textAnchor="middle" fontSize={8} fill={REF}>
                  몸이 실제로 돎 · 인물은 매번 달라짐
                </text>
                <text x={24} y={134} fontSize={9} fontWeight={700} fill={REF}>
                  몸을 붙잡고 있던 것이 참조 조건이라는 사실이 확정됩니다.
                </text>
                <text x={24} y={158} fontSize={8} fill={MUTED}>
                  둘 다 얻으려면 정체성을 잠재 조건이 아닌 다른 경로로 넣어야 합니다.
                </text>
                <text x={24} y={178} fontSize={8} fill={MUTED}>
                  의심되는 신호를 완전히 꺼 보는 것이 이 회차에서 세 번 답을 줬습니다.
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
