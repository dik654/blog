import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: StyleScale.tsx — 그림체가 수치 스케일을 바꾸고, 더하기는 가드가 필요 */
const SCENES = ["네 그림체", "수치 스케일", "더하기의 가드", "세 갈래"] as const;
const NOTES = [
  "색 변경은 네 그림체 전부에서 동작하고, 각 그림이 자기 자신으로 남습니다.",
  "같은 색 변경이 3D에서 35, 애니에서 63입니다. 모델이 더 바꾼 것이 아닙니다.",
  "얼굴 전체 마스크에 흉터를 더하자 인물이 바뀌었습니다. 동사가 아니라 마스크가 틀렸습니다.",
  "하나는 일반화됐고, 하나는 가드가 필요했으며, 하나는 그림체를 불문하고 손이 더 갑니다.",
] as const;

const OK = "#10b981";
const WARN = "#f59e0b";
const BAD = "#ef4444";
const MUTED = "#94a3b8";

const STYLES = [
  { n: "3D 렌더", v: 35.0 },
  { n: "사진", v: 35.7 },
  { n: "애니", v: 63.4 },
  { n: "유화", v: 33.1 },
];

export default function ScaleViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="일반화"
      title="한 그림체에서 세운 표를 다른 그림체에서 다시 재 봅니다"
      description="확인된 것과 반박된 것을 나눕니다."
      note="수치는 같은 그림체 안에서만 비교할 수 있습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="그림체별 일반화 검증"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step <= 1 && (
              <g>
                <text x={24} y={24} fontSize={9} fill={MUTED}>
                  같은 인물 · 같은 요청(초록 띠를 진홍으로) · 네 그림체
                </text>
                {STYLES.map((s, i) => {
                  const hot = step === 1 && s.n === "애니";
                  const c = hot ? WARN : OK;
                  return (
                    <g key={s.n}>
                      <rect x={24} y={40 + i * 30} width={92} height={24} fill={c} fillOpacity={0.12} stroke={c} strokeWidth={1.25} />
                      <text x={70} y={56 + i * 30} textAnchor="middle" fontSize={9} fontWeight={700} fill={c}>
                        {s.n}
                      </text>
                      {step === 0 ? (
                        <text x={128} y={56 + i * 30} fontSize={8} fill={OK}>
                          {["형태 유지", "형태 유지", "셀 셰이딩 유지", "붓질 유지"][i]} — 각 그림이 자기 자신으로 남음
                        </text>
                      ) : (
                        <g>
                          <rect x={128} y={44 + i * 30} width={(s.v / 70) * 230} height={16} fill={c} fillOpacity={0.28} stroke={c} strokeWidth={1} />
                          <text x={128 + (s.v / 70) * 230 + 6} y={56 + i * 30} fontSize={8} fontWeight={hot ? 700 : 400} fill={c}>
                            {s.v.toFixed(1)}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
                {step === 0 && (
                  <text x={24} y={186} fontSize={8} fontWeight={700} fill={OK}>
                    색 변경은 그림체를 타지 않습니다. 선택 규칙이 일반화됩니다.
                  </text>
                )}
                {step === 1 && (
                  <g>
                    <text x={24} y={176} fontSize={8} fontWeight={700} fill={WARN}>
                      평면 색 그림은 넓은 면적이 한꺼번에 바뀌어 평균 변화가 구조적으로 커집니다.
                    </text>
                    <text x={24} y={192} fontSize={8} fill={BAD}>
                      "8 미만은 무동작, 28 초과는 과함" 같은 절대 임계값은 그림체 불변이 아닙니다.
                    </text>
                  </g>
                )}
              </g>
            )}
            {step === 2 && (
              <g>
                <text x={24} y={26} fontSize={9} fill={MUTED}>
                  분할 모델이 준 "얼굴" 마스크는 얼굴 전체입니다
                </text>
                <rect x={24} y={44} width={200} height={64} fill={BAD} fillOpacity={0.1} stroke={BAD} strokeWidth={1.25} />
                <text x={124} y={64} textAnchor="middle" fontSize={9} fontWeight={700} fill={BAD}>
                  마스크 = 얼굴 전체
                </text>
                <text x={124} y={82} textAnchor="middle" fontSize={8} fill={BAD}>
                  사진에서 여성이 남성이 됨
                </text>
                <text x={124} y={98} textAnchor="middle" fontSize={8} fill={BAD}>
                  애니에서 눈매와 표정이 함께 바뀜
                </text>
                <rect x={256} y={44} width={200} height={64} fill={OK} fillOpacity={0.1} stroke={OK} strokeWidth={1.25} />
                <text x={356} y={64} textAnchor="middle" fontSize={9} fontWeight={700} fill={OK}>
                  가드 · 연산 전에 거절
                </text>
                <text x={356} y={82} textAnchor="middle" fontSize={8} fill={OK}>
                  얼굴이 있고 마스크가 크롭의 1/4 초과
                </text>
                <text x={356} y={98} textAnchor="middle" fontSize={8} fill={OK}>
                  부위만 좁게 잡으라고 안내
                </text>
                <text x={24} y={140} fontSize={9} fontWeight={700} fill={MUTED}>
                  동사가 틀린 것이 아니라 마스크가 틀린 것이었습니다.
                </text>
                <text x={24} y={164} fontSize={8} fill={MUTED}>
                  이미 바뀐 인물은 뒤에서 되돌릴 수 없으므로 모델을 부르기 전에 막습니다.
                </text>
              </g>
            )}
            {step === 3 && (
              <g>
                {[
                  { n: "색 변경", r: "네 그림체 전부 일반화", c: OK },
                  { n: "더하기", r: "가드를 추가해 해결", c: WARN },
                  { n: "물건 교체", r: "그림체 불문 아티팩트 잔존", c: BAD },
                ].map((r, i) => (
                  <g key={r.n}>
                    <rect x={24} y={44 + i * 40} width={120} height={30} fill={r.c} fillOpacity={0.12} stroke={r.c} strokeWidth={1.25} />
                    <text x={84} y={64 + i * 40} textAnchor="middle" fontSize={9} fontWeight={700} fill={r.c}>
                      {r.n}
                    </text>
                    <text x={160} y={64 + i * 40} fontSize={9} fill={r.c}>
                      {r.r}
                    </text>
                  </g>
                ))}
                <text x={24} y={184} fontSize={8} fontWeight={700} fill={MUTED}>
                  다른 그림체에서 검증하지 않았다면 세 결론 중 둘을 놓쳤을 것입니다.
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
