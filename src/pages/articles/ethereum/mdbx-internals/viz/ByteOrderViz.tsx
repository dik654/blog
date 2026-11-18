import MdbxSceneShell from "./MdbxSceneShell";

/**
 * 본문 대응: #dupsort — 256을 little-endian 00 01, 2를 02 00으로 저장하고
 * lexicographic byte comparator로 비교하면 첫 byte 00 < 02에서 순서가 정해져
 * 256이 2보다 앞에 놓입니다. 사람이 기대한 숫자 순서는 2, 256입니다.
 * 256 = 1×256 + 0 → 낮은 자리 byte 00, 높은 자리 byte 01.
 * 2   = 0×256 + 2 → 낮은 자리 byte 02, 높은 자리 byte 00.
 */
const ROWS = [
  { value: 256, bytes: ["00", "01"], split: "1×256 + 0" },
  { value: 2, bytes: ["02", "00"], split: "0×256 + 2" },
] as const;

const SCENES = [
  {
    label: "숫자를 bytes로 씀",
    summary: "256 → 00 01 · 2 → 02 00",
    note: "Little-endian은 낮은 자리 byte를 먼저 씁니다. 256은 1×256 + 0이라 낮은 자리 00, 높은 자리 01이 되고, 2는 낮은 자리 02, 높은 자리 00이 됩니다. Byte 하나는 16진수 두 자리로 적었습니다.",
  },
  {
    label: "첫 byte부터 비교",
    summary: "00 < 02 → 여기서 결정",
    note: "Lexicographic byte comparator는 사전처럼 앞 byte부터 비교하고, 처음 달라지는 자리에서 순서를 정합니다. 첫 byte가 00과 02로 이미 달라서 둘째 byte는 보지 않습니다.",
  },
  {
    label: "두 순서가 갈림",
    summary: "bytes: 256, 2 · 숫자: 2, 256",
    note: "이 두 값에서는 저장 순서가 256, 2가 되어 사람이 기대한 2, 256과 뒤집힙니다. 같은 bytes라도 codec과 comparator 계약이 달라지면 point lookup과 iteration 결과가 달라질 수 있습니다.",
  },
] as const;

const W = 300;
const H = 150;
const CELL_X = [52, 102] as const;
const CELL_W = 44;
const ROW_Y = [26, 82] as const;
const CELL_H = 36;

export default function ByteOrderViz() {
  return (
    <MdbxSceneShell
      eyebrow="Codec과 comparator"
      title="Little-endian bytes를 사전순으로 비교하면 256이 2보다 앞섭니다"
      description="본문의 두 값 256과 2를 2 byte little-endian으로 저장하고 lexicographic byte comparator로 정렬하는 과정입니다. 칸 하나가 1 byte입니다."
      ariaLabel="256과 2를 little-endian bytes로 바꾸고 첫 byte부터 비교해 숫자 순서와 저장 순서가 갈리는 과정"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[400px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <text x={CELL_X[0] + CELL_W / 2} y={16} textAnchor="middle" fontSize={11} fill="#64748b">1번째</text>
          <text x={CELL_X[1] + CELL_W / 2} y={16} textAnchor="middle" fontSize={11} fill="#64748b">2번째</text>
          {ROWS.map((row, r) => (
            <g key={row.value}>
              <text x={8} y={ROW_Y[r] + CELL_H / 2 + 5} fontSize={15} fontWeight={700} fill="#334155">{row.value}</text>
              {row.bytes.map((byte, c) => {
                const focus = active >= 1 && c === 0;
                const skipped = active >= 1 && c === 1;
                return (
                  <g key={c}>
                    <rect
                      x={CELL_X[c]}
                      y={ROW_Y[r]}
                      width={CELL_W}
                      height={CELL_H}
                      rx={4}
                      fill="none"
                      stroke={focus ? "#2563eb" : "#94a3b8"}
                      strokeWidth={focus ? 1.25 : 1}
                      strokeDasharray={skipped ? "3 2" : undefined}
                    />
                    <text x={CELL_X[c] + CELL_W / 2} y={ROW_Y[r] + CELL_H / 2 + 5} textAnchor="middle" fontSize={14} fontWeight={700} fontFamily="ui-monospace, monospace" fill={skipped ? "#94a3b8" : focus ? "#2563eb" : "#334155"}>
                      {byte}
                    </text>
                  </g>
                );
              })}
              {active === 0 && (
                <text x={156} y={ROW_Y[r] + CELL_H / 2 + 5} fontSize={12} fill="#475569">= {row.split}</text>
              )}
            </g>
          ))}
          {active === 0 && (
            <>
              <text x={CELL_X[0] + CELL_W / 2} y={ROW_Y[1] + CELL_H + 18} textAnchor="middle" fontSize={11} fill="#64748b">낮은 자리</text>
              <text x={CELL_X[1] + CELL_W / 2} y={ROW_Y[1] + CELL_H + 18} textAnchor="middle" fontSize={11} fill="#64748b">높은 자리</text>
            </>
          )}
          {active === 1 && (
            <>
              <text x={CELL_X[0] + CELL_W / 2} y={ROW_Y[0] + CELL_H + 15} textAnchor="middle" fontSize={12} fontWeight={700} fill="#2563eb">00 &lt; 02</text>
              <text x={CELL_X[1] + CELL_W / 2} y={ROW_Y[1] + CELL_H + 18} textAnchor="middle" fontSize={11} fill="#94a3b8">보지 않음</text>
              <text x={156} y={ROW_Y[0] + CELL_H / 2 + 5} fontSize={11} fill="#475569">첫 byte가 다르면</text>
              <text x={156} y={ROW_Y[1] + CELL_H / 2 + 5} fontSize={11} fill="#475569">그 자리에서 순서 결정</text>
            </>
          )}
          {active === 2 && (
            <>
              <text x={156} y={ROW_Y[0] + 12} fontSize={11} fill="#2563eb" fontWeight={700}>저장된 bytes 순서</text>
              <text x={156} y={ROW_Y[0] + 30} fontSize={14} fontWeight={700} fill="#2563eb">256 → 2</text>
              <text x={156} y={ROW_Y[1] + 12} fontSize={11} fill="#475569" fontWeight={700}>사람이 기대한 숫자 순서</text>
              <text x={156} y={ROW_Y[1] + 30} fontSize={14} fontWeight={700} fill="#475569">2 → 256</text>
            </>
          )}
        </svg>
      )}
    />
  );
}
