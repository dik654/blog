import SceneShell from "./SceneShell";

/**
 * 본문 대응: #fp-montgomery — w=8(radix 256)에서 506=[250,1]과 3=[3,0]을 곱한다.
 * column 0: 250×3=750 → z0=238, carry 2. column 1: 1×3 + 250×0 + 2 = 5 → z1=5, carry 0.
 * 결과 [238,5] = 238 + 5×256 = 1518 = 506×3. carry를 버리면 [238,3] = 1006.
 */
const RADIX = 256;
const A = [250, 1] as const;
const B = [3, 0] as const;
interface Term {
  name: string;
  i: number;
  j: number;
}
const COLS: readonly { k: number; terms: readonly Term[] }[] = [
  { k: 0, terms: [{ name: "a₀b₀", i: 0, j: 0 }] },
  { k: 1, terms: [{ name: "a₁b₀", i: 1, j: 0 }, { name: "a₀b₁", i: 0, j: 1 }] },
  { k: 2, terms: [{ name: "a₁b₁", i: 1, j: 1 }] },
];
const partial = (i: number, j: number) => (A as readonly number[])[i] * (B as readonly number[])[j];
const colSum = COLS.map((col) => col.terms.reduce<number>((sum, t) => sum + partial(t.i, t.j), 0));
const T = colSum.reduce<number[]>((acc, s, k) => [...acc, s + (k === 0 ? 0 : Math.floor(acc[k - 1] / RADIX))], []);
const CARRY_IN = T.map((_, k) => (k === 0 ? 0 : Math.floor(T[k - 1] / RADIX)));
const Z = T.map((t) => t % RADIX);
const Z_NO_CARRY = colSum.map((s) => s % RADIX);
const value = (limbs: readonly number[]) => limbs.reduce<number>((sum, l, k) => sum + l * RADIX ** k, 0);

const CX: readonly number[] = [64, 180, 296];
const COL_W = 100;

const SCENES = [
  {
    label: "부분곱을 column에 모읍니다",
    summary: "750 | 3 + 0 | 0",
    note: "a의 i번째 limb와 b의 j번째 limb를 곱한 부분곱은 i+j가 같은 column k에 모입니다. 네 부분곱은 동시에 만들 수 있지만 각 column의 최종 limb는 아직 정해지지 않았습니다.",
  },
  {
    label: "column 0",
    summary: "750 → limb 238, carry 2",
    note: "t₀=750은 한 limb(0~255)에 들어가지 않습니다. 낮은 8 bit인 750 mod 256=238만 남기고 ⌊750/256⌋=2를 다음 column으로 넘깁니다.",
  },
  {
    label: "column 1",
    summary: "2 + 3 + 0 = 5 → limb 5",
    note: "column 1은 자기 부분곱 3과 0에 column 0의 carry 2를 더해야 t₁=5가 확정됩니다. 앞 column이 끝나기 전에는 이 limb를 확정할 수 없습니다.",
  },
  {
    label: "결과",
    summary: `[238, 5] = ${value(Z)} = 506×3`,
    note: "column 2는 0이고 넘길 carry도 없습니다. 결과 limbs [238, 5]는 238 + 5×256 = 1518로 506×3과 같습니다.",
  },
  {
    label: "carry를 버리고 따로 계산하면",
    summary: `[238, 3] = ${value(Z_NO_CARRY)} ≠ 1518`,
    note: "column마다 독립적으로 낮은 8 bit만 남기고 carry를 다음 column에 넘기지 않으면 column 1이 3에 머뭅니다. 결과 238 + 3×256 = 1006은 틀린 값입니다. 본문이 carry chain을 무시한 lane-parallel add는 틀린다고 한 이유입니다.",
  },
] as const;

export default function CarryChainViz() {
  return (
    <SceneShell
      eyebrow="Limb 곱셈의 carry"
      title="부분곱은 한꺼번에 만들어도 limb는 앞 column의 carry를 받아야 정해집니다"
      description="limb는 큰 정수를 radix 2^w로 나눈 한 자리입니다. 여기서는 본문 예처럼 w=8이라 한 limb가 0~255이고, column k는 자리값 256^k에 쌓이는 부분곱 묶음입니다. 506=[250, 1]과 3=[3, 0]을 곱합니다."
      ariaLabel="506 곱하기 3을 radix 256 limb로 계산할 때 carry가 column을 따라 흐르는 과정"
      scenes={SCENES}
      render={(active) => {
        const noCarry = active === 4;
        const done = noCarry ? 3 : active === 0 ? 0 : active === 3 ? 3 : active;
        return (
          <svg viewBox="0 0 360 232" className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {COLS.map((col, k) => {
              const x = CX[k];
              const settled = k < done;
              const focus = !noCarry && active > 0 && active < 3 && k === active - 1;
              const tShown = noCarry ? colSum[k] : T[k];
              const zShown = noCarry ? Z_NO_CARRY[k] : Z[k];
              const carryIn = noCarry ? 0 : CARRY_IN[k];
              return (
                <g key={col.k}>
                  <rect x={x - COL_W / 2 + 4} y={8} width={COL_W - 8} height={176} rx={8} fill="none" stroke={focus ? "#2563eb" : "#cbd5e1"} strokeWidth={1} />
                  <text x={x} y={26} textAnchor="middle" fontSize={11} fontWeight={700} fill="#334155">column {col.k}</text>
                  <text x={x} y={40} textAnchor="middle" fontSize={10} fill="#64748b">자리값 {k === 0 ? "1" : k === 1 ? "256" : "256²"}</text>
                  {col.terms.map((t, ti) => (
                    <text key={t.name} x={x} y={62 + ti * 16} textAnchor="middle" fontSize={10.5} fill="#334155">
                      {t.name} {(A as readonly number[])[t.i]}×{(B as readonly number[])[t.j]}={partial(t.i, t.j)}
                    </text>
                  ))}
                  <text x={x} y={110} textAnchor="middle" fontSize={10.5} fill={k > 0 && settled && carryIn > 0 ? "#d97706" : "#64748b"}>
                    carry 받음 {k === 0 ? "—" : settled ? `+${carryIn}` : "?"}
                  </text>
                  <text x={x} y={132} textAnchor="middle" fontSize={11} fontWeight={700} fill={settled ? "#334155" : "#94a3b8"}>
                    t{k === 0 ? "₀" : k === 1 ? "₁" : "₂"} = {settled ? tShown : "?"}
                  </text>
                  <rect x={x - 30} y={144} width={60} height={28} rx={6} fill={settled ? (noCarry && k === 1 ? "#fee2e2" : "#dbeafe") : "none"} stroke={settled ? (noCarry && k === 1 ? "#dc2626" : "#2563eb") : "#cbd5e1"} strokeWidth={1} strokeDasharray={settled ? undefined : "3 3"} />
                  <text x={x} y={163} textAnchor="middle" fontSize={12} fontWeight={700} fill={settled ? (noCarry && k === 1 ? "#b91c1c" : "#1d4ed8") : "#94a3b8"}>
                    {settled ? zShown : "?"}
                  </text>
                  {k < 2 && settled && CARRY_IN[k + 1] > 0 && (
                    <g>
                      <line x1={x + 26} x2={CX[k + 1] - 36} y1={128} y2={113} stroke={noCarry ? "#dc2626" : "#d97706"} strokeWidth={1} strokeDasharray={noCarry ? "3 3" : undefined} />
                      {noCarry && (
                        <text x={(x + CX[k + 1]) / 2} y={121} textAnchor="middle" fontSize={12} fontWeight={700} fill="#dc2626">✕</text>
                      )}
                    </g>
                  )}
                </g>
              );
            })}
            <text x={14} y={205} fontSize={10.5} fill="#64748b">출력 limb</text>
            <text x={14} y={224} fontSize={11} fontWeight={700} fill={noCarry ? "#b91c1c" : "#334155"}>
              {done === 3 ? (noCarry ? "238 + 3×256 = 1006 (틀림)" : "238 + 5×256 + 0 = 1518") : "아직 확정 안 됨"}
            </text>
          </svg>
        );
      }}
    />
  );
}
