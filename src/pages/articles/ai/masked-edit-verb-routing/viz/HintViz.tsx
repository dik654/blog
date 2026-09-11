import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: HandHint.tsx — 힌트 유무 A/B 실측과 원본 요약의 정정 */
const SCENES = ["두 번 돌리기", "실측 차이", "정정", "왜 차분인가"] as const;
const NOTES = [
  "같은 조건에서 힌트만 넣고 뺍니다. 두 값의 차이가 그 모델이 드로잉에서 가져간 양입니다.",
  "한 모델만 뚜렷합니다. 나머지는 그은 선을 지우고 자기 방식대로 다시 그립니다.",
  "원본 기록의 \"나머지 ±0.2\"는 틀렸습니다. 여섯 번째 모델이 +1.05였습니다.",
  "같은 조건 두 번의 차이라 공통 오염항이 상쇄됩니다. 절대값 비교가 무효인 표에서 이 열만 살아남습니다.",
] as const;

const HERO = "#10b981";
const MID = "#f59e0b";
const FLAT = "#94a3b8";
const MUTED = "#94a3b8";

/** 실측 (/255) — 2026-09-11 */
const D = [
  { m: "klein", plain: 10.26, hint: 12.13 },
  { m: "qwen", plain: 4.46, hint: 5.51 },
  { m: "zimage", plain: 9.51, hint: 9.67 },
  { m: "illus", plain: 8.7, hint: 8.86 },
  { m: "kontext", plain: 9.67, hint: 9.65 },
  { m: "flux1", plain: 9.23, hint: 9.23 },
  { m: "krea2", plain: 11.72, hint: 11.58 },
];

export default function HintViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="차분 측정"
      title="힌트만 넣고 뺀 두 실행의 차이"
      description="같은 모델을 두 번 돌려 드로잉이 기여한 양만 남깁니다."
      note="크기만 재는 값이라 그린 대로 나왔는지는 그림으로 따로 확인해야 합니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="손 힌트 기여도 측정"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step === 0 && (
              <g>
                <text x={24} y={30} fontSize={9} fill={MUTED}>
                  같은 모델 · 같은 소스 · 같은 마스크 · 같은 시드
                </text>
                <rect x={24} y={52} width={190} height={48} fill={FLAT} fillOpacity={0.08} stroke={FLAT} strokeWidth={1} />
                <text x={119} y={72} textAnchor="middle" fontSize={9} fontWeight={700} fill={FLAT}>
                  실행 A · 힌트 없음
                </text>
                <text x={119} y={90} textAnchor="middle" fontSize={8} fill={FLAT}>
                  말로만 흉터를 요구
                </text>
                <rect x={266} y={52} width={190} height={48} fill={HERO} fillOpacity={0.1} stroke={HERO} strokeWidth={1.25} />
                <text x={361} y={72} textAnchor="middle" fontSize={9} fontWeight={700} fill={HERO}>
                  실행 B · 힌트 있음
                </text>
                <text x={361} y={90} textAnchor="middle" fontSize={8} fill={HERO}>
                  뺨에 거친 선을 그어 줌
                </text>
                <text x={240} y={126} textAnchor="middle" fontSize={9} fontWeight={700} fill={MID}>
                  B − A = 그 모델이 드로잉에서 가져간 양
                </text>
                <text x={24} y={156} fontSize={8} fill={MUTED}>
                  두 실행에 공통으로 들어가는 오차는 빼면 사라집니다.
                </text>
              </g>
            )}
            {step >= 1 && (
              <g>
                <text x={24} y={20} fontSize={9} fill={MUTED}>
                  힌트 있음 − 없음 (/255)
                </text>
                {D.map((d, i) => {
                  const delta = d.hint - d.plain;
                  const hero = i === 0;
                  const second = i === 1;
                  const c = hero ? HERO : second && step >= 2 ? MID : FLAT;
                  const w = Math.abs(delta) * 90;
                  return (
                    <g key={d.m}>
                      <text x={70} y={42 + i * 22} textAnchor="end" fontSize={8} fontWeight={hero || (second && step >= 2) ? 700 : 400} fill={c}>
                        {d.m}
                      </text>
                      <line x1={200} y1={30 + i * 22} x2={200} y2={46 + i * 22} stroke={MUTED} strokeWidth={1} opacity={0.5} />
                      <rect x={delta >= 0 ? 200 : 200 - w} y={32 + i * 22} width={w} height={12} fill={c} fillOpacity={0.3} stroke={c} strokeWidth={1} />
                      <text x={delta >= 0 ? 200 + w + 6 : 200 - w - 6} y={42 + i * 22} textAnchor={delta >= 0 ? "start" : "end"} fontSize={8} fontWeight={hero || (second && step >= 2) ? 700 : 400} fill={c}>
                        {delta >= 0 ? "+" : ""}
                        {delta.toFixed(2)}
                      </text>
                      <text x={84} y={42 + i * 22} fontSize={7} fill={MUTED}>
                        {d.plain.toFixed(1)} → {d.hint.toFixed(1)}
                      </text>
                    </g>
                  );
                })}
                {step === 1 && (
                  <text x={24} y={192} fontSize={8} fontWeight={700} fill={HERO}>
                    klein만 +1.87로 뚜렷합니다. 그림에서도 그은 선이 흉터 모양을 따라갑니다.
                  </text>
                )}
                {step === 2 && (
                  <g>
                    <text x={24} y={186} fontSize={8} fontWeight={700} fill={MID}>
                      qwen이 +1.05 — 원본 기록의 "나머지 ±0.2"는 틀렸습니다.
                    </text>
                    <text x={24} y={200} fontSize={8} fill={MUTED}>
                      다만 4.46과 5.51은 둘 다 그 모델의 무동작 범위라 성격이 다릅니다.
                    </text>
                  </g>
                )}
                {step === 3 && (
                  <g>
                    <text x={24} y={186} fontSize={8} fontWeight={700} fill={HERO}>
                      공통 오염항이 상쇄되므로 이 열은 오토인코더 차이에 영향받지 않습니다.
                    </text>
                    <text x={24} y={200} fontSize={8} fill={MUTED}>
                      두 실행이 힌트 외에 완전히 같을 때만 성립합니다.
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
