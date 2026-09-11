import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: StyleCoverage.tsx — 세 단계 검증과 각 단계가 준 답 */
const SCENES = ["1단계 · 답을 아는 입력", "2단계 · 교란된 비교", "3단계 · 교란 제거", "판정"] as const;
const NOTES = [
  "얼굴 픽셀을 건드리지 않는 편집을 통과시키면 1.00이 나와야 합니다. 네 스타일 모두 통과했습니다.",
  "얼굴을 다시 그린 편집을 재니 사진만 크게 떨어집니다. 그런데 변화량 자체가 달라 비교가 성립하지 않습니다.",
  "같은 여섯 인물을 네 스타일로 만들어 재니 애니는 압축이 아니라 탐지 자체가 0이었습니다.",
  "사진용 도구를 유화와 3D 렌더에는 그대로 쓸 수 있고, 2D 애니에는 쓸 수 없습니다.",
] as const;

const OK = "#10b981";
const WARN = "#f59e0b";
const BAD = "#ef4444";
const MUTED = "#94a3b8";

const STYLES = ["사진", "유화", "3D 렌더", "2D 애니"];

export default function CoverageViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="적용 범위"
      title="검증 단계마다 다른 답이 나왔습니다"
      description="앞의 두 단계에서 멈췄다면 각각 반대 결론을 냈을 것입니다."
      note="1·2단계 수치는 서로 다른 편집에서 나온 값이라 직접 비교하면 안 됩니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="계측기 스타일 적용 범위 검증"
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
                  얼굴 픽셀을 전혀 건드리지 않는 편집 — 1.00이 나와야 정상
                </text>
                {STYLES.map((s, i) => (
                  <g key={s}>
                    <rect x={24 + i * 114} y={44} width={102} height={56} fill={OK} fillOpacity={0.12} stroke={OK} strokeWidth={1.25} />
                    <text x={75 + i * 114} y={64} textAnchor="middle" fontSize={9} fontWeight={700} fill={OK}>
                      {s}
                    </text>
                    <text x={75 + i * 114} y={82} textAnchor="middle" fontSize={9} fill={OK}>
                      {["0.963", "0.996", "0.993", "0.974"][i]}
                    </text>
                    <text x={75 + i * 114} y={94} textAnchor="middle" fontSize={7} fill={MUTED}>
                      색 변경
                    </text>
                  </g>
                ))}
                <text x={24} y={132} fontSize={8} fill={MUTED}>
                  제거 편집에서도 1.000 · 1.000 · 0.984 · 1.000 으로 같은 결과였습니다.
                </text>
                <text x={24} y={156} fontSize={9} fontWeight={700} fill={OK}>
                  "스타일화된 얼굴에서 임베딩이 요동친다"는 첫 의심은 틀렸습니다.
                </text>
              </g>
            )}
            {step === 1 && (
              <g>
                <text x={24} y={26} fontSize={9} fill={MUTED}>
                  얼굴을 다시 그린 편집 — 값이 갈립니다
                </text>
                <rect x={24} y={44} width={200} height={60} fill={BAD} fillOpacity={0.1} stroke={BAD} strokeWidth={1.25} />
                <text x={124} y={64} textAnchor="middle" fontSize={9} fontWeight={700} fill={BAD}>
                  사진 0.25 ~ 0.37
                </text>
                <text x={124} y={82} textAnchor="middle" fontSize={8} fill={BAD}>
                  여자가 남자가 된 큰 변화
                </text>
                <text x={124} y={96} textAnchor="middle" fontSize={8} fill={MUTED}>
                  계측기가 크게 반응
                </text>
                <rect x={256} y={44} width={200} height={60} fill={WARN} fillOpacity={0.1} stroke={WARN} strokeWidth={1.25} />
                <text x={356} y={64} textAnchor="middle" fontSize={9} fontWeight={700} fill={WARN}>
                  애니 0.62 ~ 0.73
                </text>
                <text x={356} y={82} textAnchor="middle" fontSize={8} fill={WARN}>
                  눈매가 달라진 정도
                </text>
                <text x={356} y={96} textAnchor="middle" fontSize={8} fill={MUTED}>
                  계측기가 덜 반응
                </text>
                <text x={24} y={134} fontSize={9} fontWeight={700} fill={BAD}>
                  "애니에서는 계측기가 압축된다"로 읽고 싶어지는 표입니다.
                </text>
                <text x={24} y={156} fontSize={8} fill={MUTED}>
                  그런데 변화량 자체가 달랐으므로 계측기 차이인지 구분할 수 없습니다 — 비교가 성립하지 않습니다.
                </text>
              </g>
            )}
            {step >= 2 && (
              <g>
                <text x={24} y={26} fontSize={9} fill={MUTED}>
                  같은 여섯 인물을 네 스타일로 · 모든 쌍이 남남 쌍
                </text>
                {STYLES.map((s, i) => {
                  const dead = i === 3;
                  const c = dead ? BAD : OK;
                  return (
                    <g key={s}>
                      <rect x={24} y={40 + i * 30} width={90} height={24} fill={c} fillOpacity={0.12} stroke={c} strokeWidth={1.25} />
                      <text x={69} y={56 + i * 30} textAnchor="middle" fontSize={9} fontWeight={700} fill={c}>
                        {s}
                      </text>
                      <text x={126} y={50 + i * 30} fontSize={8} fill={c}>
                        탐지 {["6/6", "6/6", "6/6", "0/6"][i]}
                      </text>
                      <text x={196} y={50 + i * 30} fontSize={8} fill={c}>
                        {dead ? "측정 불가" : `쌍 평균 ${["0.132", "0.190", "0.176"][i]} · 최대 ${["0.351", "0.390", "0.302"][i]}`}
                      </text>
                      <text x={196} y={62 + i * 30} fontSize={8} fontWeight={700} fill={c}>
                        {dead ? "여섯 장 모두 얼굴을 찾지 못함" : "0.40 초과 0 / 15"}
                      </text>
                    </g>
                  );
                })}
                <text x={24} y={176} fontSize={9} fontWeight={700} fill={step === 3 ? OK : MUTED}>
                  {step === 3
                    ? "유화와 3D 렌더에는 사진용 도구를 그대로 써도 됩니다."
                    : "압축이 아니라 부재였습니다. 계산이 시작되지도 않았습니다."}
                </text>
                {step === 3 && (
                  <text x={24} y={192} fontSize={8} fill={BAD}>
                    그래서 2단계 표의 애니 숫자는 버렸습니다. 그때 값이 나온 건 눈이 사실적인 게임 아트였기 때문입니다.
                  </text>
                )}
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
