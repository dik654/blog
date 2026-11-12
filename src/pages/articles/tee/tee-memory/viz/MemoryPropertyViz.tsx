import SceneShell from "./SceneShell";

/**
 * 본문 대응: #encryption-integrity — 주소 tweak으로 같은 P가 위치마다 다른 C가 되는 것(기밀성 쪽),
 * 허가받지 않은 변경을 탐지·차단하는 것(무결성), 예전의 유효한 block을 되돌리는 공격을 막는 것(최신성)은 별개다.
 * 칸 무늬는 암호문을 흉내 낸 그림용 가정이며 실제 bit 값이 아니다.
 */
type Row = { label: string; bits: readonly number[]; tone: "plain" | "tampered" | "old" | "new"; verdict: string };

const C_A = [1, 0, 1, 1, 0, 0, 1, 0, 1, 1] as const;
const C_B = [0, 1, 1, 0, 1, 0, 0, 1, 1, 0] as const;
const C_A_FLIPPED = [1, 0, 0, 1, 0, 1, 1, 0, 1, 1] as const;
const C_A_NEW = [0, 0, 1, 0, 1, 1, 0, 1, 0, 1] as const;
const FLIPPED = new Set([2, 5]);

const SCENES = [
  {
    label: "주소 tweak",
    summary: "같은 P → C_a ≠ C_b",
    property: 0,
    rows: [
      { label: "주소 a", bits: C_A, tone: "plain", verdict: "C_a" },
      { label: "주소 b", bits: C_B, tone: "plain", verdict: "C_b" },
    ],
    note: "같은 plaintext P를 주소 a와 b에 쓰면 tweak T(a)와 T(b)가 달라 두 암호문이 달라집니다. DRAM을 읽는 쪽은 평문도, 두 칸이 같은 값이라는 사실도 바로 보지 못합니다.",
  },
  {
    label: "변조",
    summary: "바뀐 bit → 탐지·차단",
    property: 1,
    rows: [
      { label: "주소 a 원래", bits: C_A, tone: "plain", verdict: "C_a" },
      { label: "주소 a 변조", bits: C_A_FLIPPED, tone: "tampered", verdict: "탐지·차단" },
    ],
    note: "공격자가 암호문 일부를 바꾸는 경우입니다. 암호화는 평문을 숨길 뿐이고, 허가받지 않은 변경을 탐지하거나 차단하는 일은 무결성 구조가 맡습니다.",
  },
  {
    label: "예전 block 되돌리기",
    summary: "한때 유효했던 C_a → 최신성 검사",
    property: 2,
    rows: [
      { label: "시점 1 · a", bits: C_A, tone: "old", verdict: "복사해 둠" },
      { label: "시점 2 · a", bits: C_A_NEW, tone: "new", verdict: "새 값 C′_a" },
      { label: "시점 3 · a", bits: C_A, tone: "old", verdict: "되돌림" },
    ],
    note: "시점 3의 C_a는 시점 1에 정상적으로 만들어진 암호문입니다. 이렇게 예전의 유효한 block을 현재 상태로 되돌리는 공격은 최신성 검사가 막습니다. Encryption만으로 replay 방어를 결론내리지 않습니다.",
  },
] as const satisfies readonly { label: string; summary: string; property: number; rows: readonly Row[]; note: string }[];

const PROPERTIES = [
  ["기밀성", "평문 관찰을 어렵게"],
  ["무결성", "허가받지 않은 변경 탐지·차단"],
  ["최신성", "예전 유효 block 되돌리기 차단"],
] as const;

const ROW_Y = [26, 70, 114] as const;
const CELL = 10;
const CELLS_X = 184;
const TONE: Record<Row["tone"], string> = { plain: "#2563eb", tampered: "#2563eb", old: "#7c3aed", new: "#0f766e" };

export default function MemoryPropertyViz() {
  return (
    <SceneShell
      eyebrow="세 가지 성질"
      title="암호문을 숨기는 일, 변경을 잡는 일, 예전 값을 막는 일은 따로 있습니다"
      description="왼쪽은 CPU 안의 평문 P, 오른쪽 칸 줄은 DRAM에 놓인 암호문 block입니다. 회색 선은 CPU가 암호화해 쓴 block이고, 선 없이 빨간 글씨인 줄은 공격자가 바꾸거나 되돌린 block입니다. 칸 무늬는 암호문을 흉내 낸 그림이며 실제 bit 값이 아닙니다."
      ariaLabel="주소 tweak, 변조 탐지, 예전 block replay를 막는 성질 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const rows = scene.rows as readonly Row[];
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 340 152" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <rect x={6} y={44} width={68} height={58} rx={8} fill="#f8fafc" stroke="#64748b" strokeWidth={1} />
              <text x={40} y={66} textAnchor="middle" fontSize={10} fill="#64748b">CPU 안</text>
              <text x={40} y={86} textAnchor="middle" fontSize={13} fontWeight={700} fill="#334155">{active === 2 ? "P, P′" : "P"}</text>
              <rect x={86} y={52} width={44} height={42} rx={6} fill="#ffffff" stroke="#334155" strokeWidth={1} />
              <text x={108} y={70} textAnchor="middle" fontSize={10} fontWeight={700} fill="#334155">E_K</text>
              <text x={108} y={84} textAnchor="middle" fontSize={9} fill="#64748b">+ T(주소)</text>
              <line x1={74} x2={86} y1={73} y2={73} stroke="#64748b" strokeWidth={1} />
              {ROW_Y.map((y, i) => {
                const row = rows[i];
                if (!row) return null;
                const color = TONE[row.tone];
                const alert = row.tone === "tampered" || (row.tone === "old" && i === 2);
                return (
                  <g key={y}>
                    {!alert && <line x1={130} x2={CELLS_X - 4} y1={73} y2={y + 12} stroke="#94a3b8" strokeWidth={1} />}
                    <text x={CELLS_X} y={y - 3} fontSize={9} fill="#64748b">{row.label}</text>
                    {row.bits.map((bit, j) => (
                      <rect
                        key={j}
                        x={CELLS_X + j * CELL}
                        y={y + 2}
                        width={CELL - 2}
                        height={CELL + 6}
                        rx={2}
                        fill={bit ? color : "#e2e8f0"}
                        stroke={row.tone === "tampered" && FLIPPED.has(j) ? "#dc2626" : "none"}
                        strokeWidth={1.25}
                      />
                    ))}
                    <text x={CELLS_X + 10 * CELL + 2} y={y + 15} fontSize={9} fontWeight={700} fill={alert ? "#dc2626" : color}>
                      {row.verdict}
                    </text>
                  </g>
                );
              })}
            </svg>
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
              {PROPERTIES.map(([name, body], i) => (
                <div key={name} className={`rounded-lg border px-2 py-2 ${i === scene.property ? "border-primary text-foreground" : "border-border/60 text-muted-foreground opacity-60"}`}>
                  <p className="font-bold">{name}</p>
                  <p className="mt-1 leading-5">{body}</p>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
