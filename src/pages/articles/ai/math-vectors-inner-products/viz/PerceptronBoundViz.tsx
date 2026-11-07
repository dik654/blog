import SceneShell from "./SceneShell";

/**
 * 본문 대응: #applications — R=5, γ=1. 전진 하한 Mγ, 길이 상한 R√M. M=25에서 25=25.
 * M=16: 16≤20, M=36: 36>30. γ=0이면 하한이 0에 머물러 만나지 않는다.
 */
const SCENES = [
  { label: "전진의 하한", summary: "w·w* ≥ M×γ", note: "수정 한 번마다 정답 방향 성분이 여유 γ 이상 늘어납니다. M번 뒤의 전진량은 이 직선 위쪽에 있습니다." },
  { label: "길이의 상한", summary: "‖w‖ ≤ R√M", note: "수정 한 번에 길이의 제곱은 R²=25 이하로 늘어납니다. 그래서 전체 길이는 제곱근 곡선 아래에 머물고 직선보다 느리게 큽니다." },
  { label: "허용되는 구간", summary: "M=16: 16 ≤ 20", note: "방향 성분은 전체 길이를 넘지 못합니다. M=16에서는 전진 하한 16이 길이 상한 20보다 작아 두 조건이 함께 성립할 수 있습니다." },
  { label: "두 선이 만나는 곳", summary: "M=25: 25 = 5×√25", note: "M이 25이면 두 값이 모두 25입니다. 이 전제에서 수정 횟수의 상한은 (R/γ)²=25입니다. 실제 횟수가 반드시 25라는 뜻은 아니며 더 작을 수 있습니다." },
  { label: "그 너머", summary: "M=36: 36 > 30", note: "M=36이면 전진은 36 이상이어야 하는데 전체 길이는 30 이하입니다. 방향 성분이 전체 길이를 넘어야 하므로 이런 M은 전제 아래에서 나올 수 없습니다." },
  { label: "γ=0이면", summary: "하한 0 → 교점 없음", note: "여유가 0이면 하한 직선이 바닥에 눕고 M=0 뒤로는 곡선과 만나지 않습니다. 이 논증으로는 유한한 상한을 얻지 못합니다." },
] as const;

const W = 360;
const H = 212;
const L = 34;
const R = 346;
const T = 16;
const B = 176;
const MAX_M = 40;
const MAX_Y = 40;
const sx = (m: number) => L + (m / MAX_M) * (R - L);
const sy = (value: number) => B - (value / MAX_Y) * (B - T);
const MS = Array.from({ length: MAX_M + 1 }, (_, m) => m);
const ROOT = MS.map((m) => `${sx(m).toFixed(1)},${sy(5 * Math.sqrt(m)).toFixed(1)}`).join(" ");
const MARK = [null, null, 16, 25, 36, null] as const;

export default function PerceptronBoundViz() {
  return (
    <SceneShell
      eyebrow="수정 횟수의 상한"
      title="직선으로 크는 전진이 제곱근으로 크는 길이를 넘을 수 없어 M이 막힙니다"
      description="M은 수정 횟수, w는 현재 가중치, w*는 길이 1인 정답 방향, γ는 정답 경계에서 확보한 최소 여유, R은 입력 길이 상한입니다. R=5, γ=1로 그렸습니다(가정). 두 선은 실제 학습 값이 아니라 보장의 경계입니다."
      ariaLabel="수정 횟수 M에 따른 전진 하한과 길이 상한"
      scenes={SCENES}
      render={(active) => {
        const mark = MARK[active];
        const flat = active === 5;
        const showRoot = active >= 1;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {active === 4 && <rect x={sx(25)} y={T} width={sx(MAX_M) - sx(25)} height={B - T} fill="#dc2626" opacity={0.08} />}
            {[0, 20, 40].map((tick) => (
              <g key={tick}>
                <line x1={L} x2={R} y1={sy(tick)} y2={sy(tick)} stroke="#94a3b8" strokeWidth={1} opacity={tick === 0 ? 1 : 0.25} />
                <text x={L - 6} y={sy(tick) + 4} textAnchor="end" fontSize={11} fill="#64748b">{tick}</text>
              </g>
            ))}
            {[0, 10, 20, 25, 30, 40].map((tick) => (
              <text key={tick} x={sx(tick)} y={B + 16} textAnchor="middle" fontSize={11} fill="#64748b">{tick}</text>
            ))}
            <text x={R} y={H - 4} textAnchor="end" fontSize={11} fill="#64748b">수정 횟수 M</text>
            <line x1={L} x2={L} y1={T} y2={B} stroke="#94a3b8" strokeWidth={1} />
            {showRoot && <polyline points={ROOT} fill="none" stroke="#d97706" strokeWidth={1.25} />}
            {showRoot && <text x={sx(6)} y={sy(5 * Math.sqrt(6)) - 8} textAnchor="middle" fontSize={12} fontWeight={700} fill="#d97706">R√M</text>}
            {flat ? (
              <line x1={sx(0)} x2={sx(MAX_M)} y1={sy(0)} y2={sy(0)} stroke="#2563eb" strokeWidth={1.25} />
            ) : (
              <line x1={sx(0)} x2={sx(MAX_M)} y1={sy(0)} y2={sy(MAX_M)} stroke="#2563eb" strokeWidth={1.25} />
            )}
            <text x={flat ? sx(34) : sx(35)} y={flat ? sy(0) - 7 : sy(35) - 7} textAnchor="end" fontSize={12} fontWeight={700} fill="#2563eb">{flat ? "Mγ = 0" : "Mγ"}</text>
            {mark !== null && (
              <>
                <line x1={sx(mark)} x2={sx(mark)} y1={sy(Math.max(mark, 5 * Math.sqrt(mark)))} y2={B} stroke="#64748b" strokeWidth={1} strokeDasharray="3 3" />
                <circle cx={sx(mark)} cy={sy(mark)} r={4} fill="#2563eb" />
                <circle cx={sx(mark)} cy={sy(5 * Math.sqrt(mark))} r={4} fill="#d97706" />
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
