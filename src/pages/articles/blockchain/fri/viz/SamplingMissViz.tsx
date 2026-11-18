import SceneShell from "./SceneShell";

/**
 * 본문 대응: #soundness — 16칸 중 4칸이 틀린 거짓 표를 고정하고 위치를 뽑는 단순 검사.
 * 한 번 놓칠 확률 12/16, 독립 세 번 (12/16)³ = 27/64, 같은 위치 세 번은 12/16 그대로.
 * 틀린 칸의 자리와 뽑힌 자리는 그림을 위한 가정이다. FRI 전체 건전성 정리가 아니다.
 */
const N = 16;
const BAD = new Set([3, 7, 10, 14]); // 위치는 가정, 개수 4는 본문
const MISS_ONE = (N - BAD.size) / N; // 12/16
const INDEPENDENT = [1, 2, 3].map((k) => MISS_ONE ** k); // 0.75, 0.5625, 0.421875
const PICKS: readonly (readonly number[])[] = [[5], [5, 12, 1], [5, 5, 5]]; // 가정

const SCENES = [
  { label: "틀린 칸 4개를 먼저 고정", summary: "한 번 놓칠 확률 12/16", note: "거짓 표는 뽑기 전에 정해져 있습니다. 한 번 뽑은 위치가 맞는 칸 12개 중 하나이면 틀린 칸을 놓칩니다." },
  { label: "독립적으로 세 번", summary: "(12/16)³ = 27/64", note: "세 번을 서로 독립적으로 뽑으면 세 번 모두 맞는 칸에 떨어져야 놓칩니다. 12/16을 세 번 곱해 27/64, 약 0.42입니다. 막대가 한 번 뽑을 때마다 줄어듭니다." },
  { label: "같은 위치를 세 번", summary: "여전히 12/16", note: "같은 위치를 세 번 열면 처음 한 번에서 결과가 정해집니다. 놓칠 확률은 12/16에서 줄지 않습니다. 이 계산은 고정된 오류 집합의 표본추출 예이며 FRI 전체 건전성 정리가 아닙니다." },
] as const;

const W = 360;
const CELL = 19;
const GAP = 2.5;
const X0 = (W - (N * CELL + (N - 1) * GAP)) / 2;
const CELL_Y = 22;
const BAR_X = 96;
const BAR_W = W - BAR_X - 50;
const BAR_Y0 = 86;
const BAR_H = 14;
const BAR_STEP = 26;
const H = BAR_Y0 + 3 * BAR_STEP + 6;

const fmt = (v: number) => v.toFixed(2);

export default function SamplingMissViz() {
  return (
    <SceneShell
      eyebrow="몇 번 뽑으면 들키는가"
      title="독립적으로 뽑아야 놓칠 확률이 곱해집니다"
      description="칸 하나가 표의 한 위치이고, 빨간 칸이 틀린 값입니다. 틀린 칸과 뽑힌 칸의 자리는 그림을 위한 가정이며 개수 4/16은 본문 숫자입니다. 막대는 틀린 칸을 한 번도 못 뽑을 확률(0~1)입니다."
      ariaLabel="16칸 중 4칸이 틀린 표에서 세 번 독립 검사와 같은 위치 반복 검사의 놓칠 확률"
      scenes={SCENES}
      render={(active) => {
        const picks = PICKS[active];
        const counts = picks.reduce<Record<number, number>>((acc, p) => ({ ...acc, [p]: (acc[p] ?? 0) + 1 }), {});
        const bars = active === 0 ? [MISS_ONE] : active === 1 ? INDEPENDENT : [MISS_ONE, MISS_ONE, MISS_ONE];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {Array.from({ length: N }, (_, i) => {
              const pos = i + 1;
              const bad = BAD.has(pos);
              const picked = counts[pos] ?? 0;
              const x = X0 + i * (CELL + GAP);
              return (
                <g key={pos}>
                  <rect x={x} y={CELL_Y} width={CELL} height={CELL} rx={3} fill={bad ? "#fee2e2" : "#ffffff"} stroke={picked ? "#2563eb" : bad ? "#dc2626" : "#cbd5e1"} strokeWidth={picked ? 1.25 : 1} />
                  {bad && <text x={x + CELL / 2} y={CELL_Y + 13} textAnchor="middle" fontSize={10} fontWeight={700} fill="#dc2626">×</text>}
                  {picked > 0 && (
                    <text x={x + CELL / 2} y={CELL_Y - 6} textAnchor="middle" fontSize={10} fontWeight={700} fill="#2563eb">{picked > 1 ? `${picked}번` : "뽑음"}</text>
                  )}
                  {(pos === 1 || pos === N) && <text x={x + CELL / 2} y={CELL_Y + CELL + 12} textAnchor="middle" fontSize={9} fill="#64748b">{pos}</text>}
                </g>
              );
            })}
            {[0, 1, 2].map((k) => {
              const v = bars[k];
              const y = BAR_Y0 + k * BAR_STEP;
              return (
                <g key={k}>
                  <text x={BAR_X - 8} y={y + 11} textAnchor="end" fontSize={11} fill={v === undefined ? "#cbd5e1" : "#475569"}>{`${k + 1}번 뽑은 뒤`}</text>
                  <rect x={BAR_X} y={y} width={BAR_W} height={BAR_H} rx={2} fill="#f1f5f9" />
                  {v !== undefined && <rect x={BAR_X} y={y} width={BAR_W * v} height={BAR_H} rx={2} fill={active === 1 ? "#2563eb" : "#64748b"} />}
                  <text x={BAR_X + BAR_W + 6} y={y + 11} fontSize={11} fontWeight={700} fill={v === undefined ? "#cbd5e1" : "#0f172a"}>{v === undefined ? "−" : fmt(v)}</text>
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
