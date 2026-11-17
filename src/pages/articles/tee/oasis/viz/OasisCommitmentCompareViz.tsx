import SceneShell from "./OasisSceneShell";

/**
 * 본문 대응: #identity-key의 C=H(r‖R_in‖R_out‖H(M)) 식과 해석
 * "R_out만 같아도 M이 다르면 다른 C → discrepancy/backup 경로".
 * 칸에 적은 짧은 hex 값은 비교를 보이기 위한 가정값입니다.
 */
const FIELDS = [
  { key: "r", gloss: "round" },
  { key: "R_in", gloss: "실행 전 root" },
  { key: "R_out", gloss: "실행 후 root" },
  { key: "H(M)", gloss: "messages digest" },
] as const;

const A_VALUES = ["41", "a3…", "9f…", "5d…"] as const;
const B_SAME = ["41", "a3…", "9f…", "5d…"] as const;
const B_DIFF_M = ["41", "a3…", "9f…", "b2…"] as const;

const SCENES = [
  { label: "네 칸을 이어 붙여 한 번 hash", summary: "C = H(r‖R_in‖R_out‖H(M))", note: "r·R_in·R_out과, consensus로 보낼 messages M의 digest H(M)을 이어 붙여 다시 hash한 값이 commitment C입니다." },
  { label: "두 executor가 모든 칸이 같다", summary: "C 같음 → 같은 결과로 비교", note: "같은 round·input root에서 R_out과 M이 모두 같으면 C도 같습니다. 이 C가 executor 결과 비교와 roothash acceptance에 쓰입니다." },
  { label: "R_out은 같고 M만 다르다", summary: "C 다름 → discrepancy 경로", note: "State root가 같아도 M이 다르면 H(M)과 C가 달라집니다. 같은 commitment로 승인하지 않고 backup/discrepancy 경로로 보냅니다." },
] as const;

const ACCENT = "#2563eb";
const MUTED = "#94a3b8";
const TEXT = "#475569";
const FAIL = "#dc2626";
const CELL_X = [8, 70, 132, 194] as const;
const CELL_W = 56;
const C_X = 282;
const C_W = 70;

function Row({ label, y, values, diffIndex, cValue, tone }: { label: string; y: number; values: readonly string[]; diffIndex: number | null; cValue: string; tone: string }) {
  return (
    <g>
      <text x={8} y={y - 8} fontSize={10} fontWeight={700} fill={TEXT}>{label}</text>
      {values.map((value, i) => {
        const diff = diffIndex === i;
        return (
          <g key={FIELDS[i].key}>
            <rect x={CELL_X[i]} y={y} width={CELL_W} height={34} rx={5} fill={diff ? FAIL : "none"} fillOpacity={diff ? 0.08 : 0} stroke={diff ? FAIL : MUTED} strokeWidth={diff ? 1.25 : 1} />
            <text x={CELL_X[i] + CELL_W / 2} y={y + 14} textAnchor="middle" fontSize={9} fill={TEXT}>{FIELDS[i].key}</text>
            <text x={CELL_X[i] + CELL_W / 2} y={y + 28} textAnchor="middle" fontSize={11} fontWeight={700} fill={diff ? FAIL : TEXT} fontFamily="ui-monospace, monospace">{value}</text>
          </g>
        );
      })}
      {[67, 129, 191].map((gx) => (
        <text key={gx} x={gx} y={y + 21} textAnchor="middle" fontSize={10} fontWeight={700} fill={TEXT}>‖</text>
      ))}
      <line x1={252} y1={y + 17} x2={C_X - 4} y2={y + 17} stroke={tone} strokeWidth={1.25} />
      <path d={`M${C_X - 10} ${y + 13} L${C_X - 3} ${y + 17} L${C_X - 10} ${y + 21} Z`} fill={tone} />
      <text x={266} y={y + 11} textAnchor="middle" fontSize={8.5} fill={TEXT}>H</text>
      <rect x={C_X} y={y} width={C_W} height={34} rx={5} fill={tone} fillOpacity={0.1} stroke={tone} strokeWidth={1.25} />
      <text x={C_X + C_W / 2} y={y + 14} textAnchor="middle" fontSize={9} fill={TEXT}>C</text>
      <text x={C_X + C_W / 2} y={y + 28} textAnchor="middle" fontSize={11} fontWeight={700} fill={tone} fontFamily="ui-monospace, monospace">{cValue}</text>
    </g>
  );
}

export default function OasisCommitmentCompareViz() {
  return (
    <SceneShell
      eyebrow="Executor commitment 비교"
      title="R_out이 같아도 messages가 다르면 C가 갈라집니다"
      description="한 줄이 executor 하나의 commitment입니다. 글의 단순화된 C를 따르며 실제 encoding·signature·committee threshold는 protocol을 따릅니다. 칸 안의 짧은 hex 값은 비교용입니다(가정)."
      ariaLabel="두 executor의 r, R_in, R_out, H(M)과 commitment C 비교"
      scenes={SCENES}
      render={(active) => {
        const showB = active >= 1;
        const diff = active === 2;
        const bValues = diff ? B_DIFF_M : B_SAME;
        return (
          <svg viewBox="0 0 360 200" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <Row label="executor A" y={26} values={A_VALUES} diffIndex={null} cValue="7c…" tone={ACCENT} />
            {FIELDS.map((field, i) => (
              <text key={field.key} x={CELL_X[i] + CELL_W / 2} y={74} textAnchor="middle" fontSize={8.5} fill={TEXT}>{field.gloss}</text>
            ))}
            {active === 0 && (
              <g>
                <rect x={194} y={92} width={56} height={30} rx={5} fill="none" stroke={MUTED} strokeWidth={1} strokeDasharray="3 3" />
                <text x={222} y={111} textAnchor="middle" fontSize={10} fill={TEXT}>M</text>
                <line x1={222} y1={92} x2={222} y2={82} stroke={MUTED} strokeWidth={1} />
                <text x={186} y={111} textAnchor="end" fontSize={9} fill={TEXT}>안쪽 hash: M → H(M)</text>
              </g>
            )}
            {showB && (
              <Row label="executor B" y={110} values={bValues} diffIndex={diff ? 3 : null} cValue={diff ? "e4…" : "7c…"} tone={diff ? FAIL : ACCENT} />
            )}
            {showB && (
              <text x={C_X + C_W / 2} y={170} textAnchor="middle" fontSize={12} fontWeight={700} fill={diff ? FAIL : ACCENT}>{diff ? "C ≠ C" : "C = C"}</text>
            )}
            {showB && (
              <text x={C_X + C_W / 2} y={190} textAnchor="middle" fontSize={10} fontWeight={700} fill={diff ? FAIL : ACCENT}>{diff ? "discrepancy" : "같은 결과"}</text>
            )}
            {diff && (
              <text x={8} y={170} fontSize={10} fill={TEXT}>r · R_in · R_out은 A와 같음</text>
            )}
          </svg>
        );
      }}
    />
  );
}
