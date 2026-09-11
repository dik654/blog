import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: ModelDisposition.tsx — 49셀 실측 마스크 안 변화량 */
const SCENES = ["실측 표", "보수형", "과잉형", "빈 칸"] as const;
const NOTES = [
  "입력·마스크·프롬프트·시드를 고정하고 49회 돌린 마스크 안 변화량입니다. 단위는 /255.",
  "여섯 중 넷에서 최저입니다. 재질 변경 20.8, 더하기 4.5 — 못 하는 것이 있습니다.",
  "요청을 가장 세게 반영합니다. 재질 변경 53.0, 교체 59.4로 실제로 바뀝니다.",
  "지우기는 일곱 모델이 23~26으로 비슷한데, 그 숫자가 지웠다는 뜻이 아닙니다.",
] as const;

const LOW = "#6366f1";
const MID = "#10b981";
const HIGH = "#f59e0b";
const DEAD = "#ef4444";
const MUTED = "#94a3b8";

const MODELS = ["qwen", "klein", "krea2", "zimage", "kontext", "flux1", "illus"];
/** 실측 마스크 안 변화량 (/255) — 2026-09-11 */
const M: Record<string, number[]> = {
  "색 변경": [28.4, 28.6, 33.7, 28.0, 41.4, 34.7, 27.7],
  "재질 변경": [20.8, 37.8, 53.0, 59.1, 36.3, 42.6, 38.5],
  "물건 교체": [55.5, 78.4, 16.4, 38.9, 59.4, 28.1, 67.7],
  지우기: [23.0, 25.7, 24.2, 24.0, 23.1, 23.9, 25.2],
  더하기: [4.5, 10.3, 11.7, 9.5, 9.7, 9.2, 8.7],
  사실감: [6.3, 16.8, 22.9, 14.9, 12.9, 13.1, 13.7],
};
const ROWS = Object.keys(M);
const col = (v: number) => (v < 8 ? DEAD : v < 25 ? LOW : v < 45 ? MID : HIGH);

export default function MatrixViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  const focusCol = step === 1 ? 0 : step === 2 ? 4 : -1;
  const focusRow = step === 3 ? 3 : -1;
  return (
    <VizFrame
      eyebrow="실측 표"
      title="줄을 보면 모델마다 일관된 성향이 보입니다"
      description="칸 하나가 아니라 세로줄과 가로줄이 말해 주는 것을 읽습니다."
      note="같은 소스·같은 그림체 안에서만 비교할 수 있는 값입니다. 다른 그림체의 값과 나란히 놓으면 안 됩니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="편집 동작과 모델의 실측 행렬"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {MODELS.map((m, ci) => (
              <text
                key={m}
                x={104 + ci * 52}
                y={22}
                textAnchor="middle"
                fontSize={8}
                fontWeight={ci === focusCol ? 700 : 400}
                fill={ci === focusCol ? (step === 1 ? LOW : HIGH) : MUTED}
              >
                {m}
              </text>
            ))}
            {ROWS.map((r, ri) => (
              <g key={r}>
                <text x={72} y={44 + ri * 25} textAnchor="end" fontSize={8} fontWeight={ri === focusRow ? 700 : 400} fill={ri === focusRow ? DEAD : MUTED}>
                  {r}
                </text>
                {M[r].map((v, ci) => {
                  const dim = (focusCol >= 0 && ci !== focusCol) || (focusRow >= 0 && ri !== focusRow);
                  const c = focusRow === ri ? DEAD : col(v);
                  return (
                    <g key={ci}>
                      <rect
                        x={80 + ci * 52}
                        y={30 + ri * 25}
                        width={46}
                        height={19}
                        fill={c}
                        fillOpacity={dim ? 0.04 : 0.16}
                        stroke={c}
                        strokeWidth={dim ? 0.5 : 1}
                      />
                      <text x={103 + ci * 52} y={43 + ri * 25} textAnchor="middle" fontSize={8} fontWeight={dim ? 400 : 700} fill={dim ? MUTED : c}>
                        {v.toFixed(1)}
                      </text>
                    </g>
                  );
                })}
              </g>
            ))}
            <text x={24} y={190} fontSize={8} fontWeight={700} fill={step === 3 ? DEAD : step === 1 ? LOW : step === 2 ? HIGH : MUTED}>
              {step === 0
                ? "색이 진할수록 크게 바꾼 것입니다. 8 미만은 무동작에 가깝습니다."
                : step === 1
                  ? "넷에서 최저, 색 변경은 0.61 차 2위. 다만 물건 교체 55.5는 예외입니다."
                  : step === 2
                    ? "재질 변경과 교체처럼 확실히 바뀌어야 하는 동작에 맞습니다."
                    : "일곱 개가 전부 비슷한 값을 내면서 전부 다른 물건을 그려 넣었습니다."}
            </text>
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
