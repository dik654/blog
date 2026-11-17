import SceneShell from "./SceneShell";

/**
 * 본문 대응: #training 첫 문단 — raw timeline에 cutoff를 먼저 긋고, 결측 처리·scaler·feature selection은
 * 각 rolling fold의 train 구간으로만 fit한다. validation 첫 origin이 train 마지막 L step을 history로 쓰는 것은 정상.
 * L=6, H=3은 1절 값. 전체 20 step, 첫 cutoff 11, 다음 fold에서 3 step 이동은 설명용 가정.
 * fold 1: fit 1–11, 첫 origin 11 → input 6–11, target 12–14.
 * fold 2: fit 1–14, 첫 origin 14 → input 9–14, target 15–17.
 */
const N = 20;
const L = 6;
const H = 3;

const SCENES = [
  { label: "잘못된 순서", summary: "전체 20 step으로 scaler fit", cutoff: 11, fit: N, origin: null, note: "전체 시계열로 scaler를 fit하면 cutoff 뒤 validation 구간의 level이 train 변환에 이미 들어갑니다. 운영 시점에는 알 수 없는 미래 통계를 쓴 것입니다." },
  { label: "Fold 1", summary: "cutoff 11 · fit은 1–11만", cutoff: 11, fit: 11, origin: null, note: "먼저 raw timeline에 cutoff를 긋습니다. 결측 처리·scaler·feature selection은 cutoff 앞 train 구간으로만 fit하고, 그 고정된 값을 validation에 그대로 적용합니다." },
  { label: "첫 validation origin", summary: "input 6–11은 train 안 · 정상", cutoff: 11, fit: 11, origin: 11, note: "Validation의 첫 origin 11은 train 마지막 L=6 step(6–11)을 input history로 읽고, cutoff 뒤 12–14를 target으로 둡니다. 과거 값을 가져오는 것은 정상이고, 미래 구간의 통계를 미리 아는 것과는 다른 문제입니다." },
  { label: "Fold 2", summary: "cutoff 14 · 1–14로 다시 fit", cutoff: 14, fit: 14, origin: 14, note: "다음 fold는 cutoff를 14로 옮기고(가정) 1–14로 scaler 등을 다시 fit합니다. 첫 origin 14의 input은 9–14, target은 15–17입니다." },
] as const;

const W = 360;
const LEFT = 52;
const CELL = 14;
const GAP = 1.4;
const cx = (step: number) => LEFT + (step - 1) * (CELL + GAP);
const SVG_H = 132;

export default function RollingFoldViz() {
  return (
    <SceneShell
      eyebrow="Cutoff와 rolling fold"
      title="Fit은 cutoff 앞에서만 하고, 첫 validation origin은 cutoff 앞 과거를 input으로 읽습니다"
      description="칸 하나가 한 step입니다(전체 20 step은 가정). 세로선이 cutoff, 위 막대가 scaler 등을 fit하는 구간, 아래 줄이 한 forecast origin의 input(파랑, L=6)과 target(주황, H=3)입니다."
      ariaLabel="rolling fold에서 cutoff, fit 구간, 첫 validation origin의 input과 target 위치"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const wrong = active === 0;
        const steps = Array.from({ length: N }, (_, i) => i + 1);
        const cutX = cx(scene.cutoff) + CELL + GAP / 2;
        const origin: number | null = scene.origin;
        return (
          <svg viewBox={`0 0 ${W} ${SVG_H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={4} y={26} fontSize={11} fill="#475569">fit 구간</text>
            <rect x={cx(1)} y={18} width={cx(scene.fit) + CELL - cx(1)} height={10} rx={2} fill={wrong ? "#dc2626" : "#16a34a"} fillOpacity={0.75} />
            <text x={4} y={56} fontSize={11} fill="#475569">timeline</text>
            {steps.map((step) => (
              <g key={step}>
                <rect x={cx(step)} y={44} width={CELL} height={18} rx={2} fill="#64748b" fillOpacity={step <= scene.cutoff ? 0.45 : 0.12} />
                {(step === scene.cutoff || ((step === 1 || step % 5 === 0) && Math.abs(step - scene.cutoff) > 1)) && (
                  <text x={cx(step) + CELL / 2} y={76} textAnchor="middle" fontSize={11} fill="#64748b">{step}</text>
                )}
              </g>
            ))}
            <text x={cx(1)} y={12} fontSize={11} fill="#475569">train</text>
            <text x={cutX + 4} y={12} fontSize={11} fill="#475569">validation</text>
            <line x1={cutX} x2={cutX} y1={4} y2={122} stroke="#0f172a" strokeWidth={1.25} />
            <text x={4} y={104} fontSize={11} fill="#475569">origin</text>
            {origin === null ? (
              <rect x={cx(1)} y={92} width={cx(N) + CELL - cx(1)} height={18} rx={3} fill="none" stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" />
            ) : (
              steps.map((step) => {
                const isInput = step > origin - L && step <= origin;
                const isTarget = step > origin && step <= origin + H;
                if (!isInput && !isTarget) return null;
                return <rect key={step} x={cx(step)} y={92} width={CELL} height={18} rx={2} fill={isInput ? "#2563eb" : "#d97706"} fillOpacity={0.85} />;
              })
            )}
          </svg>
        );
      }}
    />
  );
}
