import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: TokenBudget.tsx — 픽셀에서 잠재 칸, 다시 토큰으로 */
const SCENES = ["픽셀", "잠재 칸", "토큰", "두 경우 비교"] as const;
const NOTES = [
  "화면에서 보이는 크기입니다. 전신 프레임의 얼굴은 한 변 95픽셀입니다.",
  "오토인코더가 여덟 배 줄이면 한 변 약 12칸이 남습니다.",
  "다시 패치로 쪼개면 한 변에 남는 토큰은 한 자리 수가 됩니다.",
  "한 변이 세 배가 되면 면적은 열 배 이상 벌어집니다. 남길 원본의 양이 다릅니다.",
] as const;

const PIX = "#6366f1";
const LAT = "#8b5cf6";
const TOK = "#f59e0b";
const OK = "#10b981";
const MUTED = "#94a3b8";

export default function TokenViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  const stages = [
    { n: "픽셀", v: "95", unit: "한 변", c: PIX },
    { n: "잠재 칸", v: "≈12", unit: "한 변", c: LAT },
    { n: "토큰", v: "≈6", unit: "한 변", c: TOK },
  ];
  return (
    <VizFrame
      eyebrow="예산"
      title="화면 픽셀이 아니라 잠재 칸이 실제 예산입니다"
      description="같은 얼굴이 단계마다 얼마나 줄어드는지 봅니다."
      note="축소 배율과 패치 크기는 구현마다 달라 여기 값은 관계를 보여 주는 예시입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="잠재 공간 토큰 예산"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step <= 2 && (
              <g>
                <text x={24} y={24} fontSize={9} fill={MUTED}>
                  전신 1MP 프레임의 얼굴 한 변
                </text>
                {stages.map((s, i) => {
                  const on = i <= step;
                  const size = [72, 40, 22][i];
                  return (
                    <g key={s.n}>
                      <rect x={40 + i * 150} y={80 - size / 2} width={size} height={size} fill={s.c} fillOpacity={on ? 0.25 : 0.05} stroke={on ? s.c : MUTED} strokeWidth={on ? 1.25 : 1} />
                      <text x={40 + i * 150 + size / 2} y={132} textAnchor="middle" fontSize={9} fontWeight={700} fill={on ? s.c : MUTED}>
                        {s.n}
                      </text>
                      <text x={40 + i * 150 + size / 2} y={148} textAnchor="middle" fontSize={9} fill={on ? s.c : MUTED}>
                        {s.v}
                      </text>
                      {i < 2 && (
                        <g>
                          <line x1={40 + i * 150 + size + 12} y1={80} x2={40 + (i + 1) * 150 - 12} y2={80} stroke={MUTED} strokeWidth={1} />
                          <text x={40 + i * 150 + size + 30} y={72} fontSize={8} fill={MUTED}>
                            {i === 0 ? "÷ 8" : "÷ 2"}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
                {step === 2 && (
                  <text x={24} y={180} fontSize={9} fontWeight={700} fill={TOK}>
                    남길 원본 자체가 몇 칸뿐이면 노이즈 비율을 낮춰도 얼굴을 특정하기에 부족합니다.
                  </text>
                )}
              </g>
            )}
            {step === 3 && (
              <g>
                <text x={24} y={24} fontSize={9} fill={MUTED}>
                  한 변 토큰 수와 면적 비교
                </text>
                {[
                  { n: "전신 프레임 · 95px", side: 6, c: "#ef4444" },
                  { n: "얼굴 패널 · 327px", side: 20, c: OK },
                ].map((r, i) => (
                  <g key={r.n}>
                    <text x={24} y={52 + i * 66} fontSize={9} fontWeight={700} fill={r.c}>
                      {r.n}
                    </text>
                    {Array.from({ length: Math.min(r.side, 20) }).map((_, gx) =>
                      Array.from({ length: Math.min(r.side, 20) }).map((__, gy) => (
                        <rect
                          key={`${gx}-${gy}`}
                          x={24 + gx * 2.4}
                          y={58 + i * 66 + gy * 2.4}
                          width={2.0}
                          height={2.0}
                          fill={r.c}
                          fillOpacity={0.5}
                        />
                      )),
                    )}
                    <text x={98} y={76 + i * 66} fontSize={9} fill={r.c}>
                      한 변 약 {r.side}토큰 · 면적 {r.side * r.side}칸
                    </text>
                  </g>
                ))}
                <text x={24} y={192} fontSize={8} fontWeight={700} fill={OK}>
                  한 변이 세 배면 면적은 열 배 이상입니다. 프레임을 키우는 것과 대상을 키우는 것은 다릅니다.
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
