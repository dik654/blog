import StepSceneShell from "./StepSceneShell";

/**
 * 본문 대응: #schemes — a=(3,2,1,0), b=(1,4,16,0), 17로 나눈 나머지, 질문 x=2(가정), x⁻¹=9 (2×9=18≡1).
 * ⟨a,b⟩ = 3+8+16+0 = 27 ≡ 10.
 * a′ = 2·(3,2) + 9·(1,0) = (15,4); b′ = 9·(1,4) + 2·(16,0) = (41,36) ≡ (7,2).
 * ⟨a′,b′⟩ = 105+8 = 113 ≡ 11.
 * L = ⟨aL,bR⟩ = 48 ≡ 14, R = ⟨aR,bL⟩ = 1, 2⁻² ≡ 9² = 81 ≡ 13 → 10 + 4×14 + 13×1 = 79 ≡ 11.
 */
const A: readonly number[] = [3, 2, 1, 0];
const B: readonly number[] = [1, 4, 16, 0];

const W = 300;
const H = 132;
const CELL_W = 48;
const CELL_H = 28;
const A_Y = 30;
const B_Y = 92;
const cellX = (i: number) => 40 + i * 56 + (i >= 2 ? 16 : 0);
const mid = (i: number) => cellX(i) + CELL_W / 2;

const SCENES = [
  {
    label: "처음 내적",
    summary: "3 + 8 + 16 + 0 = 27 ≡ 10",
    lines: ["⟨a, b⟩ = 3×1 + 2×4 + 1×16 + 0×0", "= 27 ≡ 10  (f(4) = 10과 같은 값)"],
    note: "a는 계수, b는 4의 거듭제곱입니다. 같은 자리끼리 곱해 더하면 27이고 17로 나눈 나머지는 10입니다. 마지막 0은 길이를 4로 맞추는 패딩입니다.",
  },
  {
    label: "x = 2로 반씩 접기",
    summary: "a′ = (15, 4) · b′ = (7, 2)",
    lines: ["a′ = 2·(3, 2) + 9·(1, 0) = (15, 4)", "b′ = 9·(1, 4) + 2·(16, 0) = (41, 36) ≡ (7, 2)"],
    note: "a는 왼쪽 절반에 x=2, 오른쪽 절반에 x⁻¹=9를 곱해 더합니다(2×9=18≡1이라 9가 2의 역수). b는 반대로 왼쪽에 9, 오른쪽에 2를 곱합니다. 길이 4짜리 벡터가 길이 2가 됩니다.",
  },
  {
    label: "접은 벡터의 내적",
    summary: "113 ≡ 11 ≠ 10",
    lines: ["⟨a′, b′⟩ = 15×7 + 4×2 = 113", "≡ 11  (처음 값 10과 다름)"],
    note: "접은 벡터끼리 내적하면 113이고 17로 나눈 나머지는 11입니다. 처음 10과 같지 않으므로 벡터를 줄였다는 사실만으로는 원래 주장과 연결되지 않습니다.",
  },
  {
    label: "교차항으로 연결",
    summary: "10 + 4×14 + 13×1 = 79 ≡ 11",
    lines: ["실선 L = ⟨aL, bR⟩ = 3×16 + 2×0 = 48 ≡ 14", "점선 R = ⟨aR, bL⟩ = 1×1 + 0×4 = 1", "10 + 2²×14 + 2⁻²×1 ≡ 10 + 56 + 13 = 79 ≡ 11", "(2⁻² ≡ 9² = 81 ≡ 13)"],
    note: "서로 다른 절반끼리 곱한 교차 내적 L=14, R=1을 x²과 x⁻²로 더하면 처음 값 10에서 11이 정확히 나옵니다. 이 교차항을 군 자료로 묶는 것이 IPA의 일부이며, 숫자 산술만으로 증명이 되지는 않습니다.",
  },
] as const;

const C = { ink: "#334155", muted: "#94a3b8", left: "#2563eb", right: "#d97706", link: "#475569", cross: "#7c3aed" } as const;

function Vectors({ active }: { active: number }) {
  const dim = active === 2;
  const halfColor = (i: number) => (i < 2 ? C.left : C.right);
  const aMul = ["×2", "×9"];
  const bMul = ["×9", "×2"];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label="벡터 a와 b의 네 칸, 왼쪽 절반과 오른쪽 절반">
      <text x={(cellX(0) + cellX(1) + CELL_W) / 2} y={14} textAnchor="middle" fontSize={11} fill={C.left}>
        왼쪽 절반 (aL, bL)
      </text>
      <text x={(cellX(2) + cellX(3) + CELL_W) / 2} y={14} textAnchor="middle" fontSize={11} fill={C.right}>
        오른쪽 절반 (aR, bR)
      </text>
      <text x={12} y={A_Y + 19} fontSize={14} fontWeight={700} fill={C.ink}>a</text>
      <text x={12} y={B_Y + 19} fontSize={14} fontWeight={700} fill={C.ink}>b</text>
      {active === 0 &&
        A.map((value, i) => (
          <g key={`pair-${i}`}>
            <line x1={mid(i)} x2={mid(i)} y1={A_Y + CELL_H} y2={B_Y} stroke={C.link} strokeWidth={1} />
            <text x={mid(i) + 5} y={(A_Y + CELL_H + B_Y) / 2 + 4} fontSize={11} fill={C.link}>
              {value * B[i]}
            </text>
          </g>
        ))}
      {active === 3 &&
        [0, 1].map((i) => (
          <g key={`cross-${i}`}>
            <line x1={mid(i)} x2={mid(i + 2)} y1={A_Y + CELL_H} y2={B_Y} stroke={C.cross} strokeWidth={1.25} />
            <line x1={mid(i + 2)} x2={mid(i)} y1={A_Y + CELL_H} y2={B_Y} stroke={C.cross} strokeWidth={1} strokeDasharray="3 2" />
          </g>
        ))}
      {[0, 1].map((half) =>
        active === 1 ? (
          <g key={`mul-${half}`}>
            <text x={cellX(half * 2) + CELL_W + 4} y={A_Y - 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={halfColor(half * 2)}>
              {aMul[half]}
            </text>
            <text x={cellX(half * 2) + CELL_W + 4} y={B_Y + CELL_H + 13} textAnchor="middle" fontSize={12} fontWeight={700} fill={halfColor(half * 2)}>
              {bMul[half]}
            </text>
          </g>
        ) : null,
      )}
      {[A, B].map((vec, row) =>
        vec.map((value, i) => (
          <g key={`${row}-${i}`} opacity={dim ? 0.4 : 1}>
            <rect x={cellX(i)} y={row === 0 ? A_Y : B_Y} width={CELL_W} height={CELL_H} rx={6} fill="none" stroke={halfColor(i)} strokeWidth={1} />
            <text x={mid(i)} y={(row === 0 ? A_Y : B_Y) + 19} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.ink} fontFamily="ui-monospace, monospace">
              {value}
            </text>
          </g>
        )),
      )}
    </svg>
  );
}

function Panel({ active }: { active: number }) {
  const scene = (SCENES as readonly { lines: readonly string[] }[])[active];
  return (
    <div className="min-w-0">
      <Vectors active={active} />
      <div className="mt-3 space-y-1 rounded-md border border-border px-3 py-2 font-mono text-xs leading-6">
        {scene.lines.map((line) => (
          <p key={line} className="break-words">{line}</p>
        ))}
      </div>
    </div>
  );
}

export default function IpaFoldViz() {
  return (
    <StepSceneShell
      eyebrow="내적을 절반으로 접기"
      title="같은 값 10을 내적으로 쓰고 한 번 접으면"
      description="내적은 두 벡터에서 같은 자리끼리 곱해 더한 값입니다. 모든 계산은 17로 나눈 나머지에서 하며(≡), 질문 x=2는 본문의 가정입니다. 칸 색은 왼쪽 절반과 오른쪽 절반입니다."
      ariaLabel="벡터 a와 b의 내적 10, x=2로 접은 내적 11, 교차항 L과 R로 연결하는 네 장면"
      scenes={SCENES}
      render={(active) => <Panel active={active} />}
    />
  );
}
