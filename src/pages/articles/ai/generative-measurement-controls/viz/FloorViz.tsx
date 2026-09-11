import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: RoundtripFloor.tsx — 왕복 바닥값이 침범 순위를 통째로 설명 */
const SCENES = ["기록한 순위", "바닥값 측정", "차감", "바닥값도 이미지에 의존"] as const;
const NOTES = [
  "마스크 밖 변화량으로 모델의 절제를 평가했습니다. 0.6부터 2.9까지 다섯 배 가까이 벌어집니다.",
  "샘플링도 프롬프트도 마스크도 없이 인코딩하고 디코딩만 하면 그 값이 바닥입니다.",
  "차감하면 전 모델 0.00~0.15로 사실상 같습니다. 순위는 오토인코더 선택이었습니다.",
  "같은 오토인코더가 이미지마다 다른 바닥을 냅니다. 다른 그림의 바닥값을 빼면 안 됩니다.",
] as const;

const RANK = "#6366f1";
const FLOOR = "#f59e0b";
const REAL = "#10b981";
const WARN = "#ef4444";
const MUTED = "#94a3b8";

/** 실측 — 2026-09-11, view_front_ref.png 기준 */
const MODELS = [
  { n: "qwen_edit", ae: "qwen", rec: 0.6, floor: 0.6 },
  { n: "krea2", ae: "qwen", rec: 0.7, floor: 0.6 },
  { n: "klein9b", ae: "flux2", rec: 1.0, floor: 0.94 },
  { n: "illustrious", ae: "sdxl", rec: 2.0, floor: 2.11 },
  { n: "kontext", ae: "flux", rec: 2.8, floor: 2.75 },
  { n: "flux1dev", ae: "flux", rec: 2.9, floor: 2.75 },
];
const BAR = (v: number) => (v / 3.2) * 140;

export default function FloorViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="바닥값"
      title="아무것도 바꾸지 않았을 때의 값을 먼저 잽니다"
      description="기록한 침범 순위와 오토인코더 왕복만 한 값을 나란히 놓습니다."
      note="실측값이며 단위는 /255, 소스는 표가 실제로 쓴 전신 프레임입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="오토인코더 왕복 바닥값"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step <= 2 && (
              <g>
                <text x={24} y={22} fontSize={9} fill={MUTED}>
                  {step === 0 ? "마스크 밖 변화량 (/255)" : step === 1 ? "기록값과 왕복만 한 값" : "차감 후 실제 누출"}
                </text>
                {MODELS.map((m, i) => (
                  <g key={m.n}>
                    <text x={24} y={44 + i * 26} fontSize={8} fontWeight={700} fill={step === 2 ? REAL : RANK}>
                      {m.n}
                    </text>
                    <text x={92} y={44 + i * 26} fontSize={7} fill={MUTED}>
                      {m.ae}
                    </text>
                    <rect x={130} y={36 + i * 26} width={BAR(m.rec)} height={9} fill={RANK} fillOpacity={0.3} stroke={RANK} strokeWidth={1} />
                    <text x={130 + BAR(m.rec) + 5} y={44 + i * 26} fontSize={7} fill={RANK}>
                      {m.rec.toFixed(1)}
                    </text>
                    {step >= 1 && (
                      <g>
                        <rect x={130} y={46 + i * 26} width={BAR(m.floor)} height={7} fill={FLOOR} fillOpacity={0.35} stroke={FLOOR} strokeWidth={1} />
                        <text x={130 + BAR(m.floor) + 5} y={53 + i * 26} fontSize={7} fill={FLOOR}>
                          {m.floor.toFixed(2)}
                        </text>
                      </g>
                    )}
                    {step === 2 && (
                      <text x={330} y={48 + i * 26} fontSize={8} fontWeight={700} fill={REAL}>
                        실제 누출 {(m.rec - m.floor).toFixed(2)}
                      </text>
                    )}
                  </g>
                ))}
                <text x={24} y={196} fontSize={8} fontWeight={700} fill={step === 2 ? REAL : step === 1 ? FLOOR : RANK}>
                  {step === 0
                    ? "같은 오토인코더를 쓰는 모델끼리 값이 붙어 있는 것을 진작 이상하게 봤어야 했습니다."
                    : step === 1
                      ? "위 막대가 기록값, 아래 막대가 왕복만 한 바닥값입니다."
                      : "일곱 모델 전부 마스크를 사실상 완벽하게 지키고 있었습니다."}
                </text>
              </g>
            )}
            {step === 3 && (
              <g>
                <text x={24} y={24} fontSize={9} fill={MUTED}>
                  같은 오토인코더, 다른 소스 이미지 (/255)
                </text>
                {[
                  { s: "애니", flux: 1.01, qwen: 0.49, flux2: 1.08 },
                  { s: "사진", flux: 2.56, qwen: 1.12, flux2: 1.09 },
                  { s: "유화", flux: 2.81, qwen: 0.53, flux2: 1.11 },
                  { s: "3D", flux: 2.88, qwen: 0.49, flux2: 0.89 },
                ].map((r, i) => (
                  <g key={r.s}>
                    <text x={24} y={50 + i * 28} fontSize={8} fontWeight={700} fill={MUTED}>
                      {r.s}
                    </text>
                    {[r.flux, r.qwen, r.flux2].map((v, j) => (
                      <g key={j}>
                        <rect x={70 + j * 130} y={40 + i * 28} width={(v / 3) * 90} height={12} fill={j === 0 ? WARN : FLOOR} fillOpacity={0.28} stroke={j === 0 ? WARN : FLOOR} strokeWidth={1} />
                        <text x={70 + j * 130 + (v / 3) * 90 + 5} y={50 + i * 28} fontSize={7} fill={j === 0 ? WARN : FLOOR}>
                          {v.toFixed(2)}
                        </text>
                      </g>
                    ))}
                  </g>
                ))}
                <text x={70} y={32} fontSize={7} fill={WARN}>
                  flux
                </text>
                <text x={200} y={32} fontSize={7} fill={FLOOR}>
                  qwen
                </text>
                <text x={330} y={32} fontSize={7} fill={FLOOR}>
                  flux2
                </text>
                <text x={24} y={170} fontSize={9} fontWeight={700} fill={WARN}>
                  같은 flux 오토인코더가 애니 1.01, 3D 2.88입니다.
                </text>
                <text x={24} y={190} fontSize={8} fill={MUTED}>
                  그래서 첫 측정을 폐기하고 표가 실제로 쓴 소스에서 다시 쟀습니다.
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
