import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: SeedControl.tsx — 단조 감소, 그리고 시드 대조군이 뒤집음 */
const SCENES = ["깊이는 직접 뽑음", "단조 감소", "시드 대조군", "구분되지 않음"] as const;
const NOTES = [
  "깊이 추정기를 쓰면 그 추정기가 두 번째 모델이 되어 측정하려는 누수를 스스로 만듭니다.",
  "강도를 올릴수록 유사도가 내려갑니다. 앞의 절벽과 달리 진짜 레버로 보였습니다.",
  "시드를 고정한 것이 검증되지 않은 가정이었습니다. 반대로 돌려 봅니다.",
  "형태를 바꿔 얻은 분리가 난수를 바꿔 얻는 것과 같은 크기입니다.",
] as const;

const RAW = "#10b981";
const EST = "#ef4444";
const SWEEP = "#6366f1";
const CTRL = "#f59e0b";
const MUTED = "#94a3b8";

const SW = [
  { s: "0.60", m: 0.676, min: 0.594, diff: 0 },
  { s: "0.85", m: 0.376, min: 0.259, diff: 2 },
  { s: "1.00", m: 0.229, min: 0.122, diff: 5 },
];
const CMP = [
  { n: "얼굴형 4개 · 시드 고정", v: 0.376, c: SWEEP },
  { n: "시드 4개 · 얼굴형 A 고정", v: 0.346, c: CTRL },
  { n: "시드 4개 · 얼굴형 C 고정", v: 0.3, c: CTRL },
];

export default function ControlViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="대조군"
      title="고정해 둔 변수가 결론을 만들고 있었습니다"
      description="성공처럼 보이던 스윕을 대조군 하나가 뒤집습니다."
      note="쌍별 평균이며 강도 0.85에서 비교했습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="제어 강도 스윕과 시드 대조군"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step === 0 && (
              <g>
                <rect x={24} y={48} width={200} height={60} fill={EST} fillOpacity={0.1} stroke={EST} strokeWidth={1.25} />
                <text x={124} y={68} textAnchor="middle" fontSize={9} fontWeight={700} fill={EST}>
                  렌더에 깊이 추정기
                </text>
                <text x={124} y={86} textAnchor="middle" fontSize={8} fill={EST}>
                  "얼굴이란 이렇게 생겼다"는
                </text>
                <text x={124} y={100} textAnchor="middle" fontSize={8} fill={EST}>
                  의견을 가진 두 번째 모델
                </text>
                <rect x={256} y={48} width={200} height={60} fill={RAW} fillOpacity={0.12} stroke={RAW} strokeWidth={1.25} />
                <text x={356} y={68} textAnchor="middle" fontSize={9} fontWeight={700} fill={RAW}>
                  깊이 버퍼에서 직접
                </text>
                <text x={356} y={86} textAnchor="middle" fontSize={8} fill={RAW}>
                  윤곽도 픽셀이 아니라
                </text>
                <text x={356} y={100} textAnchor="middle" fontSize={8} fill={RAW}>
                  깊이 불연속에서
                </text>
                <text x={24} y={144} fontSize={9} fontWeight={700} fill={RAW}>
                  추정기를 쓰면 측정하려는 누수를 스스로 만들게 됩니다.
                </text>
                <text x={24} y={166} fontSize={8} fill={MUTED}>
                  조명 경계가 아니라 실제 기하만 제어 신호에 담기도록 했습니다.
                </text>
              </g>
            )}
            {step === 1 && (
              <g>
                <text x={24} y={22} fontSize={9} fill={MUTED}>
                  제어 강도별 쌍 평균 / 최솟값 / 다른 인물 판정
                </text>
                {SW.map((r, i) => (
                  <g key={r.s}>
                    <text x={84} y={54 + i * 40} textAnchor="end" fontSize={9} fontWeight={700} fill={SWEEP}>
                      {r.s}
                    </text>
                    <rect x={94} y={42 + i * 40} width={r.m * 280} height={15} fill={SWEEP} fillOpacity={0.3} stroke={SWEEP} strokeWidth={1} />
                    <text x={94 + r.m * 280 + 6} y={54 + i * 40} fontSize={9} fontWeight={700} fill={SWEEP}>
                      {r.m.toFixed(3)}
                    </text>
                    <text x={94} y={70 + i * 40} fontSize={8} fill={MUTED}>
                      최솟값 {r.min.toFixed(3)} · 다른 인물 {r.diff} / 6쌍
                    </text>
                  </g>
                ))}
                <text x={24} y={182} fontSize={9} fontWeight={700} fill={SWEEP}>
                  단조 감소입니다. 여기서 멈췄다면 성공이라고 썼을 것입니다.
                </text>
              </g>
            )}
            {step >= 2 && (
              <g>
                <text x={24} y={22} fontSize={9} fill={MUTED}>
                  강도 0.85 · 무엇을 바꿨을 때의 분리인가
                </text>
                {CMP.map((r, i) => {
                  const on = step === 3 || i === 0;
                  return (
                    <g key={r.n}>
                      <text x={180} y={56 + i * 38} textAnchor="end" fontSize={9} fontWeight={700} fill={on ? r.c : MUTED}>
                        {r.n}
                      </text>
                      <rect x={190} y={44 + i * 38} width={r.v * 440} height={16} fill={r.c} fillOpacity={on ? 0.3 : 0.08} stroke={on ? r.c : MUTED} strokeWidth={1} />
                      <text x={190 + r.v * 440 + 6} y={57 + i * 38} fontSize={9} fontWeight={700} fill={on ? r.c : MUTED}>
                        {r.v.toFixed(3)}
                      </text>
                    </g>
                  );
                })}
                {step === 2 && (
                  <text x={24} y={176} fontSize={8} fill={MUTED}>
                    얼굴형이 유일한 변수처럼 보이게 만든 것이 바로 그 시드 고정이었습니다.
                  </text>
                )}
                {step === 3 && (
                  <g>
                    <text x={24} y={172} fontSize={9} fontWeight={700} fill={CTRL}>
                      세 값이 구분되지 않습니다. 형태 지표도 4.4% 대 4.8%·4.5%입니다.
                    </text>
                    <text x={24} y={192} fontSize={8} fill={MUTED}>
                      형태를 바꿔 얻은 것이 난수를 바꿔 얻는 것과 같다면 그건 형태 제어가 아닙니다.
                    </text>
                  </g>
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
