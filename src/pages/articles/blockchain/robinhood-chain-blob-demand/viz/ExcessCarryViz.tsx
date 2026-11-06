import SceneShell from "./SceneShell";

/**
 * 본문 대응: #robinhood-chain-concentration — 초과분 = max(0, 이전 초과분 + blob − 14).
 * 18·10·6·6 → 4·0·0·0. 하한 분기가 첫 블록에 성립하면 18×(21−14)/21 = 6.
 */
const TARGET = 14;
const AXIS = 21;

const ROWS = [
  { carry: 0, blobs: 18, after: 4 },
  { carry: 4, blobs: 10, after: 0 },
  { carry: 0, blobs: 6, after: 0 },
  { carry: 0, blobs: 6, after: 0 },
] as const;

const SCENES = [
  { label: "첫 블록 18개", summary: "max(0, 0+18−14) = 4", note: "시작 초과분을 0으로 두고 실행 비용에 연동된 하한 분기가 작동하지 않는다고 가정합니다. 목표 14를 넘은 4가 다음 블록으로 넘어갑니다." },
  { label: "둘째 블록 10개", summary: "max(0, 4+10−14) = 0", note: "넘어온 4와 이번 10을 더하면 정확히 14입니다. 앞 블록의 초과 4가 이번 블록의 부족 4로 상쇄됩니다." },
  { label: "셋째 블록 6개", summary: "max(0, 0+6−14) = 0", note: "6은 목표보다 8 적어 계산값이 −8이지만 max(0, …)가 0으로 막습니다. 모자란 8은 다음 블록으로 넘어가지 않습니다." },
  { label: "넷째 블록 6개", summary: "max(0, 0+6−14) = 0", note: "같은 계산으로 0입니다. 이 경로의 4는 초과량의 교육용 환산값이며, 실제 최소가격은 gas 단위 정수 함수와 활성 포크 설정값인 update fraction으로 계산하므로 곧바로 가격 4배라고 읽지 않습니다." },
  { label: "하한 분기가 성립하면", summary: "18×(21−14)÷21 = 6", note: "EIP-7918은 실행 base fee(거래 실행에 매기는 기본 수수료)에 비해 blob 가격이 낮으면 다른 증가식을 적용합니다. 같은 첫 18개에 그 조건이 성립하면 초과분은 18의 7/21인 6입니다(첫 줄 아래 칸). 이후 경로는 사용량만으로 확정되지 않아 물음표로 둡니다. 부모 블록의 실행·blob base fee와 활성 규칙이 더 필요합니다." },
] as const;

const pct = (value: number) => `${(value / AXIS) * 100}%`;

const BRANCH_EXCESS = (18 * (AXIS - TARGET)) / AXIS;

function Segment({ from, to, color, dashed = false, label }: { from: number; to: number; color: string; dashed?: boolean; label?: string }) {
  if (to <= from) return null;
  return (
    <div
      className={`absolute inset-y-0 flex items-center justify-center overflow-hidden whitespace-nowrap text-[11px] font-bold leading-none ${dashed ? "border border-dashed" : ""}`}
      style={{ left: pct(from), width: pct(to - from), backgroundColor: dashed ? "transparent" : color, borderColor: dashed ? color : undefined, color: dashed ? color : "#ffffff" }}
    >
      {label}
    </div>
  );
}

export default function ExcessCarryViz() {
  return (
    <SceneShell
      eyebrow="초과분 추적"
      title="일반 경로에서는 목표를 넘은 양만 다음 블록으로 넘어갑니다"
      description="넘어온 초과분과 이번 blob 개수를 이어 붙여 목표 14와 비교합니다. 18·10·6·6은 가정이고 단위는 blob 개수로 환산했습니다."
      ariaLabel="네 블록에서 초과분이 4, 0, 0, 0으로 변하는 계산과 하한 분기가 성립할 때의 6"
      scenes={SCENES}
      render={(active) => {
        const branch = active === 4;
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[2.5rem_minmax(0,1fr)_4rem] gap-2 text-xs">
              <span />
              <div className="relative h-5 min-w-0">
                <span className="absolute -translate-x-full pr-1 font-bold" style={{ left: pct(TARGET) }}>목표 14</span>
                <span className="absolute right-0 font-bold text-muted-foreground">상한 21</span>
              </div>
              <span className="text-right font-bold">다음으로</span>
            </div>
            <div className="mt-1 space-y-3">
              {ROWS.map((row, index) => {
                const shown = branch || index <= active;
                const load = row.carry + row.blobs;
                const result = branch ? (index === 0 ? "4 또는 6" : "?") : shown ? String(row.after) : "";
                return (
                  <div key={index} className={`grid grid-cols-[2.5rem_minmax(0,1fr)_4rem] items-center gap-2 text-xs ${branch && index > 0 ? "opacity-60" : ""}`}>
                    <span className="font-mono">{shown ? `${row.blobs}개` : `${index + 1}번`}</span>
                    <div className="relative h-8 min-w-0 rounded-sm bg-muted/50">
                      {branch && index === 0 ? (
                        <>
                          <div className="absolute inset-x-0 top-0 h-1/2">
                            <Segment from={0} to={TARGET} color="#64748b" />
                            <Segment from={TARGET} to={load} color="#dc2626" label="일반 4" />
                          </div>
                          <div className="absolute inset-x-0 bottom-0 h-1/2">
                            <Segment from={0} to={load - BRANCH_EXCESS} color="#64748b" />
                            <Segment from={load - BRANCH_EXCESS} to={load} color="#dc2626" dashed label="하한 6" />
                          </div>
                        </>
                      ) : shown && (
                        <>
                          <Segment from={0} to={branch ? 0 : row.carry} color="#d97706" />
                          <Segment from={branch ? 0 : row.carry} to={branch ? row.blobs : Math.min(load, TARGET)} color="#64748b" />
                          <Segment from={TARGET} to={load} color="#dc2626" />
                          {!branch && <Segment from={load} to={TARGET} color="#64748b" dashed />}
                        </>
                      )}
                      <div className="absolute inset-y-[-2px] w-px bg-foreground" style={{ left: pct(TARGET) }} />
                    </div>
                    <span className={`text-right font-mono font-bold ${result !== "0" && result !== "" ? "text-primary" : ""}`}>{result}</span>
                  </div>
                );
              })}
            </div>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {[["#d97706", "넘어온 초과분", false], ["#64748b", "이번 블록 blob", false], ["#dc2626", "목표를 넘은 부분", false], ["#64748b", "목표까지 모자란 부분(넘어가지 않음)", true]].map(([color, label, dashed]) => (
                <li key={label as string} className="flex items-center gap-1.5">
                  <span className={`inline-block h-2.5 w-2.5 rounded-sm ${dashed ? "border border-dashed" : ""}`} style={dashed ? { borderColor: color as string } : { backgroundColor: color as string }} />
                  {label as string}
                </li>
              ))}
              <li className={`flex items-center gap-1.5 ${branch ? "" : "invisible"}`}>
                <span className="inline-block h-2.5 w-2.5 rounded-sm border border-dashed" style={{ borderColor: "#dc2626" }} />
                하한 분기의 초과분(18의 7/21)
              </li>
            </ul>
          </div>
        );
      }}
    />
  );
}
