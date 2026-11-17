import SceneShell from "./SceneShell";

/**
 * 본문 대응: #locking "왜 이렇게 복잡한가요?" — 전체 투표권 100, 정족수 = 3W > 200 → 67 이상.
 * 결정된 A의 precommit 67과 충돌 블록 B의 prevote 67을 겹침이 가장 작게 놓으면 0~67, 33~100.
 * 겹침 = 67 + 67 − 100 = 34. Byzantine 투표권 < 1/3 → 최대 33. 34 − 33 = 1 이상은 정직한 투표권.
 */
const X0 = 12;
const W = 336;
const xOf = (value: number) => X0 + (value / 100) * W;
const A_END = 67;
const B_START = 33;
const BYZ_START = B_START;
const BYZ_END = 66;
const ROW_A = 30;
const ROW_B = 82;
const ROW_H = 26;
const OVERLAP_Y = 138;

const SCENES = [
  { label: "A의 2차 투표", summary: "precommit(A) ≥ 67", note: "전체 투표권이 100이면 3×67=201>200이라 67부터 정족수입니다. 블록 A가 결정됐다면 A에 2차 투표한 투표권이 적어도 67입니다." },
  { label: "B의 1차 투표", summary: "67 + 67 − 100 = 34", note: "같은 높이의 다른 블록 B가 1차 투표 정족수를 얻으려면 역시 67 이상이 필요합니다. 두 묶음을 최대한 떨어뜨려 놓아도 100 안에서 34만큼은 겹칩니다." },
  { label: "Byzantine 최대치", summary: "34 − 33 = 1 이상 정직", note: "Byzantine 검증자는 규칙을 어기고 양쪽에 서명할 수 있는 검증자입니다. 그 투표권은 전체의 3분의 1 미만, 곧 최대 33이라고 가정합니다. 33을 전부 겹침에 넣어도 정직한 투표권이 적어도 1 남습니다." },
  { label: "A에 잠긴 몫", summary: "B 정족수가 막힘", note: "겹침의 정직한 검증자는 A에 2차 투표했으므로 A에 잠겨 있습니다. 더 높은 라운드의 정당한 PoLC 없이는 B에 1차 투표하지 않으므로, B가 겹침까지 채워 67을 모으는 길이 막힙니다." },
] as const;

export default function QuorumOverlapViz() {
  return (
    <SceneShell
      eyebrow="두 정족수의 겹침"
      title="3분의 2를 넘는 두 묶음은 반드시 정직한 투표권을 함께 품습니다"
      description="가로 막대 전체가 전체 투표권 100입니다. 두 투표 묶음은 겹침이 가장 작아지는 위치에 놓았습니다."
      note="100과 67은 본문의 정수 비교를 그대로 쓴 설명용 값입니다. 실제 정족수는 그 높이의 검증자 집합으로 계산합니다."
      ariaLabel="결정된 블록의 2차 투표 정족수와 충돌 블록의 1차 투표 정족수가 겹치는 크기"
      scenes={SCENES}
      render={(active) => {
        const showB = active >= 1;
        const showByz = active >= 2;
        const locked = active === 3;
        return (
          <svg viewBox="0 0 360 196" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={X0} y={ROW_A - 8} fontSize={13} fill="#2563eb" fontWeight={700}>precommit(A) 0~67</text>
            <rect x={xOf(0) + 0.5} y={ROW_A} width={xOf(100) - xOf(0) - 1} height={ROW_H} rx={3} fill="#f8fafc" stroke="#e2e8f0" strokeWidth={1} />
            <rect x={xOf(0) + 0.5} y={ROW_A} width={xOf(A_END) - xOf(0) - 1} height={ROW_H} rx={3} fill="#dbeafe" stroke="#2563eb" strokeWidth={1} />

            <g opacity={showB ? 1 : 0.15}>
              <text x={xOf(100)} y={ROW_B - 8} textAnchor="end" fontSize={13} fill="#d97706" fontWeight={700}>
                {locked ? "prevote(B) 정족수 불가" : "prevote(B) 33~100"}
              </text>
              <rect x={xOf(0) + 0.5} y={ROW_B} width={xOf(100) - xOf(0) - 1} height={ROW_H} rx={3} fill="#f8fafc" stroke="#e2e8f0" strokeWidth={1} />
              <rect x={xOf(B_START) + 0.5} y={ROW_B} width={xOf(100) - xOf(B_START) - 1} height={ROW_H} rx={3} fill={locked ? "#ffffff" : "#fef3c7"} stroke="#d97706" strokeWidth={1} strokeDasharray={locked ? "4 3" : undefined} />
            </g>

            <g opacity={showB ? 1 : 0}>
              <line x1={xOf(B_START)} x2={xOf(B_START)} y1={ROW_A} y2={OVERLAP_Y + 18} stroke="#64748b" strokeWidth={1} strokeDasharray="2 3" />
              <line x1={xOf(A_END)} x2={xOf(A_END)} y1={ROW_A} y2={OVERLAP_Y + 18} stroke="#64748b" strokeWidth={1} strokeDasharray="2 3" />
              <rect x={xOf(B_START) + 0.5} y={OVERLAP_Y} width={xOf(A_END) - xOf(B_START) - 1} height={20} rx={2} fill="#e2e8f0" stroke="#64748b" strokeWidth={1} />
              {showByz && (
                <>
                  <rect x={xOf(BYZ_START) + 0.5} y={OVERLAP_Y} width={xOf(BYZ_END) - xOf(BYZ_START) - 1} height={20} rx={2} fill="#fecaca" stroke="#dc2626" strokeWidth={1} />
                  <rect x={xOf(BYZ_END) + 0.5} y={OVERLAP_Y} width={xOf(A_END) - xOf(BYZ_END) - 1} height={20} rx={1} fill="#16a34a" />
                </>
              )}
              <text x={(xOf(B_START) + xOf(A_END)) / 2} y={OVERLAP_Y + 15} textAnchor="middle" fontSize={13} fontWeight={700} fill={showByz ? "#991b1b" : "#334155"}>
                {showByz ? "Byzantine ≤ 33" : "겹침 34"}
              </text>
              <text x={xOf(A_END) + 6} y={OVERLAP_Y + 15} fontSize={12} fontWeight={700} fill="#15803d">
                {showByz ? (locked ? "← 정직 ≥1, A 잠금" : "← 정직 ≥1") : ""}
              </text>
              <text x={xOf(B_START)} y={OVERLAP_Y + 36} textAnchor="middle" fontSize={12} fill="#64748b">33</text>
              <text x={xOf(A_END)} y={OVERLAP_Y + 36} textAnchor="middle" fontSize={12} fill="#64748b">67</text>
            </g>
          </svg>
        );
      }}
    />
  );
}
