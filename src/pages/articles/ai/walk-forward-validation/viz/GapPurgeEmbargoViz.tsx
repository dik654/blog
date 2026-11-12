import SceneShell from "./SceneShell";

/**
 * 본문 대응: #gap-purge — gap은 경계 근처에 고정 간격을 두고, purge는 학습 행의 정보 구간이
 * 평가 구간과 실제로 겹치는지 보며, embargo는 평가 직후 구간을 후속 학습에서 뺀다.
 * 행 위치·길이와 각 구간의 폭은 모두 설명을 위한 가정이다.
 */
const W = 360;
const H = 206;
const LEFT = 30;
const RIGHT = 10;
const TOP = 30;
const ROW_H = 21;
const x = (t: number) => LEFT + (t / 100) * (W - LEFT - RIGHT);

const TEST: readonly [number, number] = [60, 75];
const GAP: readonly [number, number] = [52, 60];
const EMBARGO: readonly [number, number] = [75, 83];

interface Row {
  name: string;
  start: number;
  end: number;
  after: boolean;
}

const ROWS: readonly Row[] = [
  { name: "A", start: 10, end: 22, after: false },
  { name: "B", start: 28, end: 38, after: false },
  { name: "C", start: 40, end: 65, after: false },
  { name: "D", start: 45, end: 50, after: false },
  { name: "E", start: 54, end: 58, after: false },
  { name: "F", start: 77, end: 82, after: true },
  { name: "G", start: 88, end: 96, after: true },
];

type Mode = "gap" | "purge" | "embargo" | "past";

const SCENES: readonly { label: string; summary: string; mode: Mode; note: string }[] = [
  { label: "Gap", summary: "E 제외 · C는 평가와 겹친 채 남음", mode: "gap", note: "Gap은 경계 바로 앞에 정한 간격을 두고 그 안의 행을 뺍니다. 하지만 일찍 시작해 정보 구간이 긴 C는 간격 밖에서 출발했으므로 평가 구간과 겹친 채 남습니다." },
  { label: "Purge", summary: "겹치는 C 제외 · E는 겹치지 않음", mode: "purge", note: "Purge는 각 학습 행이 쓰는 정보 구간이 평가 구간과 실제로 겹치는지 봅니다. 겹치는 C를 빼고, 경계에 가까워도 겹치지 않는 E는 이 검사로는 빠지지 않습니다." },
  { label: "Embargo", summary: "평가 직후 F 제외", mode: "embargo", note: "평가 뒤 기간도 학습 후보가 되는 설계를 가정했습니다. Embargo는 평가 직후 일정 구간을 후속 학습에서 빼서, 평가 구간과 가까워 남는 의존성을 다룹니다. 흐리게 둔 평가 앞쪽 행은 이 장면에서 다루지 않습니다." },
  { label: "과거만 학습", summary: "평가 뒤 행이 후보가 아님", mode: "past", note: "과거만 학습하는 설계에서는 평가 뒤 행이 처음부터 학습 후보가 아닙니다. 같은 처방을 무조건 붙이기보다 어떤 정보가 공유되는지 먼저 확인합니다. 흐리게 둔 평가 앞쪽 행은 이 장면에서 다루지 않습니다." },
];

function status(row: Row, mode: Mode): "keep" | "drop" | "absent" {
  if (row.after) {
    if (mode !== "embargo") return "absent";
    return row.start < EMBARGO[1] ? "drop" : "keep";
  }
  if (mode === "gap") return row.start >= GAP[0] ? "drop" : "keep";
  if (mode === "purge") return row.end > TEST[0] ? "drop" : "keep";
  return "keep";
}

export default function GapPurgeEmbargoViz() {
  return (
    <SceneShell
      eyebrow="Gap · Purge · Embargo"
      title="간격을 두는 검사와 겹침을 보는 검사는 다른 행을 지웁니다"
      description="가로 막대 하나가 학습 후보 행이 쓰는 정보 구간이고, 파란 띠가 평가 구간입니다. 행의 위치와 길이, 각 구간의 폭은 모두 설명을 위한 가정입니다."
      ariaLabel="gap, purge, embargo가 각각 어떤 학습 행을 제외하는지 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const bottom = TOP + ROWS.length * ROW_H;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <rect x={x(TEST[0])} y={TOP - 6} width={x(TEST[1]) - x(TEST[0])} height={bottom - TOP + 6} fill="#dbeafe" />
            <text x={(x(TEST[0]) + x(TEST[1])) / 2} y={TOP - 10} textAnchor="middle" fontSize={13} fontWeight={700} fill="#1d4ed8">평가</text>
            {scene.mode === "gap" && (
              <>
                <rect x={x(GAP[0])} y={TOP - 6} width={x(GAP[1]) - x(GAP[0])} height={bottom - TOP + 6} fill="#fde68a" opacity={0.6} />
                <text x={(x(GAP[0]) + x(GAP[1])) / 2} y={TOP - 10} textAnchor="middle" fontSize={13} fontWeight={700} fill="#b45309">gap</text>
              </>
            )}
            {scene.mode === "embargo" && (
              <>
                <rect x={x(EMBARGO[0])} y={TOP - 6} width={x(EMBARGO[1]) - x(EMBARGO[0])} height={bottom - TOP + 6} fill="#fde68a" opacity={0.6} />
                <text x={x(EMBARGO[0]) + 2} y={TOP - 10} textAnchor="start" fontSize={13} fontWeight={700} fill="#b45309">embargo</text>
              </>
            )}
            {ROWS.map((row, index) => {
              const s = status(row, scene.mode);
              const y = TOP + index * ROW_H + ROW_H / 2;
              const color = s === "drop" ? "#dc2626" : "#475569";
              return (
                <g key={row.name} opacity={s === "absent" ? 0.22 : (scene.mode === "embargo" || scene.mode === "past") && !row.after ? 0.4 : 1}>
                  <text x={LEFT - 8} y={y + 4} textAnchor="end" fontSize={14} fontWeight={700} fill="#334155">{row.name}</text>
                  <rect
                    x={x(row.start)}
                    y={y - 4}
                    width={x(row.end) - x(row.start)}
                    height={8}
                    rx={2}
                    fill={s === "drop" ? "none" : color}
                    stroke={color}
                    strokeWidth={1}
                    strokeDasharray={s === "drop" ? "3 2" : undefined}
                  />
                  {s === "drop" && (
                    <text x={row.end > 90 ? x(row.start) - 4 : x(row.end) + 4} y={y + 4} textAnchor={row.end > 90 ? "end" : "start"} fontSize={13} fontWeight={700} fill="#dc2626">제외</text>
                  )}
                  {s === "absent" && (
                    <text x={row.end > 90 ? x(row.start) - 4 : x(row.end) + 4} y={y + 4} textAnchor={row.end > 90 ? "end" : "start"} fontSize={13} fill="#475569">후보 아님</text>
                  )}
                </g>
              );
            })}
            <line x1={LEFT} x2={W - RIGHT} y1={bottom + 4} y2={bottom + 4} stroke="#94a3b8" strokeWidth={1} />
            <text x={LEFT} y={bottom + 18} fontSize={13} fill="#64748b">과거</text>
            <text x={W - RIGHT} y={bottom + 18} textAnchor="end" fontSize={13} fill="#64748b">시간 →</text>
          </svg>
        );
      }}
    />
  );
}
