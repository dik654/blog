import SceneShell from "./EcodSceneShell";

/**
 * 본문 대응: #implementation — PyOD 3.6.4 decision_function은 저장한 X_train과 새 입력을 합친 뒤 ECDF를 다시 계산한다.
 * X_train 거래액은 1절의 ₩12K·18K·24K·910K. 평가할 새 row ₩30K와 함께 들어오는 batch 값은 가정입니다.
 * A: [30] → 5개 중 ≥30은 2개(2/5) → −ln 0.4 = 0.92, ≤30은 4/5 → 0.22
 * B: [30, 40, 50] → 7개 중 ≥30은 4개(4/7) → 0.56, ≤30도 4/7 → 0.56
 * C: [30, 5, 6] → 7개 중 ≥30은 2개(2/7) → 1.25, ≤30은 6/7 → 0.15
 * 세 경우 모두 910이 평균보다 멀리 커서 skewness가 양수입니다. 이 열의 contribution은 max(U_L, U_R).
 */
const TRAIN = [12, 18, 24, 910] as const;
const TARGET = 30;

type Batch = { key: string; extra: readonly number[] };
const BATCHES: readonly Batch[] = [
  { key: "A", extra: [] },
  { key: "B", extra: [40, 50] },
  { key: "C", extra: [5, 6] },
];

function evaluate(b: Batch) {
  const all = [...TRAIN, TARGET, ...b.extra].sort((x, y) => x - y);
  const n = all.length;
  const ge = all.filter((v) => v >= TARGET).length;
  const le = all.filter((v) => v <= TARGET).length;
  const uR = -Math.log(ge / n);
  const uL = -Math.log(le / n);
  return { all, n, ge, le, uR, uL, u: Math.max(uR, uL) };
}

const RESULTS = BATCHES.map(evaluate);

const SCENES = [
  { label: "fit: X_train 저장", summary: "₩12K · 18K · 24K · 910K", note: "fit은 training 거래액 네 개를 저장합니다. 아직 새 row는 없습니다. 칸은 크기 순서만 나타내며 간격은 금액에 비례하지 않습니다. ECDF가 세는 것도 순서입니다." },
  { label: "batch A: ₩30K 혼자", summary: "≥₩30K 2/5 → 0.92", note: "(가정) 새 row ₩30K 하나만 넣으면 저장한 네 값과 합친 다섯 개에서 다시 셉니다. ₩30K 이상은 2개라 오른쪽 비율 2/5, −log로 0.92입니다. 왼쪽은 4/5라 0.22로 더 작습니다." },
  { label: "batch B: 더 큰 값과 함께", summary: "≥₩30K 4/7 → 0.56", note: "(가정) 같은 ₩30K를 ₩40K·₩50K와 같은 batch로 넣으면 일곱 개에서 셉니다. ₩30K 이상이 4개로 늘어 오른쪽 비율 4/7, contribution은 0.56으로 내려갑니다." },
  { label: "batch C: 더 작은 값과 함께", summary: "≥₩30K 2/7 → 1.25", note: "(가정) 이번에는 ₩5K·₩6K와 함께 넣습니다. ₩30K 이상은 여전히 2개지만 전체가 7개라 비율 2/7, contribution은 1.25로 올라갑니다. 같은 row가 batch 구성만으로 0.56에서 1.25 사이를 오갑니다." },
] as const;

const W = 360;
const H = 196;
const SLOT_W = 44;
const SLOT_GAP = 5;
const X0 = (W - (7 * SLOT_W + 6 * SLOT_GAP)) / 2;
const sx = (i: number) => X0 + i * (SLOT_W + SLOT_GAP);
const CELL_Y = 46;
const CELL_H = 30;

export default function BatchDependenceViz() {
  return (
    <SceneShell
      eyebrow="Batch-dependent score"
      title="같은 ₩30K row도 함께 넣은 batch에 따라 contribution이 달라집니다"
      description="거래액 한 feature만 봅니다. 회색 칸은 fit 때 저장한 training 값, 파란 칸은 평가할 새 row, 주황 칸은 같은 batch로 들어온 다른 새 row입니다. 새 row 값은 가정입니다."
      ariaLabel="PyOD decision_function이 저장한 training 값과 새 batch를 합쳐 ECDF를 다시 세는 과정"
      scenes={SCENES}
      render={(active) => {
        const r = active === 0 ? null : RESULTS[active - 1];
        const extras = active === 0 ? [] : BATCHES[active - 1].extra;
        const values: readonly number[] = r ? r.all : TRAIN;
        const geStart = r ? r.all.indexOf(TARGET) : -1;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={X0} y={CELL_Y + CELL_H + 16} fontSize={9} fill="#64748b">작은 값</text>
            <text x={sx(6) + SLOT_W} y={CELL_Y + CELL_H + 16} textAnchor="end" fontSize={9} fill="#64748b">큰 값 → (금액 비례 아님)</text>
            {Array.from({ length: 7 }, (_, i) => {
              const v = values[i];
              if (v === undefined) {
                return <rect key={i} x={sx(i)} y={CELL_Y} width={SLOT_W} height={CELL_H} rx={6} fill="none" stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" />;
              }
              const isTarget = r !== null && v === TARGET;
              const isExtra = extras.includes(v);
              const stroke = isTarget ? "#2563eb" : isExtra ? "#d97706" : "#64748b";
              const fill = isTarget ? "#dbeafe" : isExtra ? "#fef3c7" : "#f1f5f9";
              return (
                <g key={i}>
                  <rect x={sx(i)} y={CELL_Y} width={SLOT_W} height={CELL_H} rx={6} fill={fill} stroke={stroke} strokeWidth={isTarget ? 1.25 : 1} />
                  <text x={sx(i) + SLOT_W / 2} y={CELL_Y + 19} textAnchor="middle" fontSize={11} fontWeight={isTarget ? 700 : 500} fill="#0f172a">₩{v}K</text>
                </g>
              );
            })}
            {r && (
              <g>
                <line x1={sx(geStart)} x2={sx(r.n - 1) + SLOT_W} y1={CELL_Y - 10} y2={CELL_Y - 10} stroke="#2563eb" strokeWidth={1.25} />
                <line x1={sx(geStart)} x2={sx(geStart)} y1={CELL_Y - 10} y2={CELL_Y - 4} stroke="#2563eb" strokeWidth={1.25} />
                <line x1={sx(r.n - 1) + SLOT_W} x2={sx(r.n - 1) + SLOT_W} y1={CELL_Y - 10} y2={CELL_Y - 4} stroke="#2563eb" strokeWidth={1.25} />
                <text x={(sx(geStart) + sx(r.n - 1) + SLOT_W) / 2} y={CELL_Y - 16} textAnchor="middle" fontSize={10} fontWeight={700} fill="#2563eb">
                  ₩30K 이상 {r.ge}/{r.n}
                </text>
              </g>
            )}
            <text x={X0} y={120} fontSize={10} fontWeight={700} fill="#334155">₩30K row의 이 열 contribution max(U_L, U_R)</text>
            {BATCHES.map((b, i) => {
              const res = RESULTS[i];
              const y = 136 + i * 19;
              const shown = active >= i + 1;
              const len = (res.u / 1.4) * 200;
              return (
                <g key={b.key} opacity={shown ? 1 : 0.25}>
                  <text x={X0} y={y + 8} fontSize={10} fill="#475569">batch {b.key}</text>
                  <rect x={X0 + 54} y={y} width={200} height={10} fill="#f1f5f9" />
                  {shown && <rect x={X0 + 54} y={y} width={len} height={10} fill={active === i + 1 ? "#2563eb" : "#93c5fd"} />}
                  <text x={X0 + 262} y={y + 9} fontSize={11} fontWeight={700} fill="#0f172a">{shown ? res.u.toFixed(2) : "?"}</text>
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
