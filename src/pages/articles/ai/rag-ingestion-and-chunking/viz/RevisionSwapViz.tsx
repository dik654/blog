import SceneShell from "./SceneShell";

/**
 * 본문 대응: #pipeline — v16 → v17 교체 순서 세 가지에서 시간에 따라 무엇이 검색되는지 본다.
 * 먼저 지우기: v17 준비 전까지 검색 공백. 추가만: v16과 v17이 함께 검색됨.
 * staging 검증 → alias 교체 → 이전 revision 제외: 공백도 중복도 없음.
 * 가로축은 사건 순서만 나타내며 시간 간격은 임의다.
 */
const W = 360;
const L = 40;
const R = 352;
const T_START = 0.18; // v17 처리 시작
const T_READY = 0.62; // v17 chunk 준비 완료
const tx = (t: number) => L + t * (R - L);

interface Bar {
  from: number;
  to: number;
}
interface Scene {
  label: string;
  summary: string;
  v16: Bar;
  v17: Bar | null;
  gap?: Bar;
  both?: Bar;
  marks: readonly { t: number; text: string }[];
  note: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "이전 chunk를 먼저 지우면",
    summary: "v16 삭제 ~ v17 준비: 검색 공백",
    v16: { from: 0, to: T_START },
    v17: { from: T_READY, to: 1 },
    gap: { from: T_START, to: T_READY },
    marks: [
      { t: T_START, text: "v16 삭제·v17 처리 시작" },
      { t: T_READY, text: "v17 준비" },
    ],
    note: "v17 처리를 시작하면서 v16 chunk를 지우면, 새 chunk가 준비될 때까지 환불 규정을 묻는 질문이 이 규정의 chunk를 하나도 찾지 못하는 검색 공백이 생깁니다.",
  },
  {
    label: "새 chunk만 추가하면",
    summary: "v17 준비 뒤: v16과 v17이 함께",
    v16: { from: 0, to: 1 },
    v17: { from: T_READY, to: 1 },
    both: { from: T_READY, to: 1 },
    marks: [
      { t: T_START, text: "v17 처리 시작" },
      { t: T_READY, text: "v17 추가" },
    ],
    note: "지우지 않고 추가만 하면 공백은 없지만, v17이 들어온 뒤부터 v16과 v17이 함께 검색됩니다. v16에서 파생된 chunk는 더 이상 검색되면 안 된다는 처음의 요구가 깨집니다.",
  },
  {
    label: "검증 뒤 alias를 바꾸면",
    summary: "공백 0 · 중복 0",
    v16: { from: 0, to: T_READY },
    v17: { from: T_READY, to: 1 },
    marks: [
      { t: T_START, text: "staging에 v17 처리" },
      { t: T_READY, text: "manifest 검증 → alias 교체 → v16 제외" },
    ],
    note: "v17은 staging index에서 만들고 manifest를 검증합니다. 그동안 질문은 계속 v16을 찾습니다. 검증이 끝나면 active alias를 index-v42로 바꾸고 이전 revision을 검색에서 뺍니다.",
  },
];

const ROW_Y = { v16: 34, v17: 74 } as const;

export default function RevisionSwapViz() {
  return (
    <SceneShell
      eyebrow="증분 반영 순서"
      title="지우는 순서에 따라 공백이나 중복이 생깁니다"
      description="가로는 시간 순서, 두 줄은 각 revision의 chunk가 검색되는 기간입니다. 빨간 구간은 검색 공백, 주황 구간은 두 revision이 함께 검색되는 기간입니다."
      note="가로축은 사건의 순서만 나타내며 간격은 임의입니다. v16·v17·index-v42는 본문의 설명용 사례입니다."
      ariaLabel="revision 교체 순서별 검색 가능 기간"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox={`0 0 ${W} 150`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={0} y={ROW_Y.v16 + 5} fontSize={14} fontWeight={700} fill="#334155">v16</text>
            <text x={0} y={ROW_Y.v17 + 5} fontSize={14} fontWeight={700} fill="#334155">v17</text>
            <line x1={L} x2={R} y1={ROW_Y.v16} y2={ROW_Y.v16} stroke="#cbd5e1" strokeWidth={1} />
            <line x1={L} x2={R} y1={ROW_Y.v17} y2={ROW_Y.v17} stroke="#cbd5e1" strokeWidth={1} />
            {scene.gap && <rect x={tx(scene.gap.from)} y={18} width={tx(scene.gap.to) - tx(scene.gap.from)} height={72} fill="#dc2626" fillOpacity={0.12} />}
            {scene.both && <rect x={tx(scene.both.from)} y={18} width={tx(scene.both.to) - tx(scene.both.from)} height={72} fill="#d97706" fillOpacity={0.14} />}
            <rect x={tx(scene.v16.from)} y={ROW_Y.v16 - 8} width={tx(scene.v16.to) - tx(scene.v16.from)} height={16} rx={3} fill="#64748b" fillOpacity={0.75} />
            {scene.v17 && <rect x={tx(scene.v17.from)} y={ROW_Y.v17 - 8} width={tx(scene.v17.to) - tx(scene.v17.from)} height={16} rx={3} fill="#2563eb" fillOpacity={0.8} />}
            {scene.gap && (
              <text x={(tx(scene.gap.from) + tx(scene.gap.to)) / 2} y={ROW_Y.v17 + 4} textAnchor="middle" fontSize={13} fontWeight={700} fill="#b91c1c">검색 공백</text>
            )}
            {scene.both && (
              <text x={(tx(scene.both.from) + tx(scene.both.to)) / 2} y={14} textAnchor="middle" fontSize={13} fontWeight={700} fill="#b45309">둘 다 검색됨</text>
            )}
            {scene.marks.map((mark, index) => (
              <g key={mark.text}>
                <line x1={tx(mark.t)} x2={tx(mark.t)} y1={18} y2={104} stroke="#475569" strokeWidth={1} strokeDasharray="2 3" />
                <text x={index === 0 ? tx(mark.t) - 4 : tx(mark.t) + 4} y={index === 0 ? 118 : 136} textAnchor={index === 0 ? "start" : "end"} fontSize={12} fill="#475569">
                  {mark.text}
                </text>
              </g>
            ))}
          </svg>
        );
      }}
    />
  );
}
