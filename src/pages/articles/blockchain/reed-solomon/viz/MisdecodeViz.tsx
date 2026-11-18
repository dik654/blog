import SceneShell from "./SceneShell";

/**
 * 본문 대응: #misdecode — 보낸 [2,5,1,4](2+3x), 받은 [2,6,3,4], 다른 정상 목록 [2,6,3,0](2+4x).
 * 받은 목록은 보낸 목록과 위치 1·2 두 곳, 다른 정상 목록과 위치 3 한 곳이 다르다.
 * 두 정상 목록끼리는 위치 1·2·3 세 곳이 달라 최소 거리 3과 맞는다.
 */
const SENT = [2, 5, 1, 4] as const;
const RECEIVED = [2, 6, 3, 4] as const;
const OTHER = [2, 6, 3, 0] as const;

const diff = (a: readonly number[], b: readonly number[]) =>
  a.reduce<number[]>((acc, value, i) => (value === b[i] ? acc : [...acc, i]), []);

const SENT_DIFF = diff(SENT, RECEIVED);
const OTHER_DIFF = diff(OTHER, RECEIVED);

const SCENES = [
  {
    label: "보낸 목록",
    summary: "2 + 3x → [2, 5, 1, 4]",
    rows: 1,
    note: "원본 2·3에서 만든 정상 목록입니다. 정상 목록은 1차 이하 규칙 하나를 네 위치에서 계산한 목록을 말합니다.",
  },
  {
    label: "두 값이 바뀌어 도착",
    summary: "[2, 6, 3, 4] · 보낸 목록과 2곳 다름",
    rows: 2,
    note: "위치 1의 5가 6으로, 위치 2의 1이 3으로 바뀌었습니다. 받는 쪽은 어느 위치가 바뀌었는지 모릅니다.",
  },
  {
    label: "다른 정상 목록과 비교",
    summary: "2 + 4x → [2, 6, 3, 0] · 1곳 다름",
    rows: 3,
    note: "다른 원본 2·4의 규칙 2+4x로 만든 목록도 정상 목록입니다. 받은 목록과는 위치 3 한 곳만 다릅니다.",
  },
  {
    label: "오류 한 개를 고치는 복원기의 답",
    summary: "가까운 쪽 → 원본 2·4 반환",
    rows: 3,
    note: "오류 한 개를 고치는 복원기는 한 곳만 고치면 되는 2+4x를 찾아 정상적으로 2·4를 반환할 수 있습니다. 받은 목록만으로는 2·3에서 두 오류가 났는지, 2·4에서 한 오류가 났는지 알 수 없습니다.",
  },
] as const;

const ROWS = [
  { name: "보낸 목록 (2+3x)", values: SENT, marks: SENT_DIFF, mark: "#dc2626" },
  { name: "받은 목록", values: RECEIVED, marks: [] as number[], mark: "#334155" },
  { name: "다른 정상 목록 (2+4x)", values: OTHER, marks: OTHER_DIFF, mark: "#d97706" },
] as const;

const W = 320;
const AX0 = 30;
const AX1 = 290;
const ax = (d: number) => AX0 + (d / 3) * (AX1 - AX0);

export default function MisdecodeViz() {
  return (
    <SceneShell
      eyebrow="잘못된 성공"
      title="받은 목록이 다른 정상 목록에 더 가까울 수 있습니다"
      description="칸은 위치 0·1·2·3의 값이고, 테두리를 친 칸이 받은 목록과 값이 다른 위치입니다. 아래 줄은 다른 위치의 개수를 거리로 놓은 것입니다. 모든 계산은 7로 나눈 나머지입니다."
      ariaLabel="보낸 목록, 받은 목록, 다른 정상 목록을 위치별로 비교하고 받은 목록이 어느 쪽에 더 가까운지 보여 주는 그림"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const final = active === 3;
        return (
          <div className="min-w-0">
            <div className="space-y-3">
              {ROWS.map((row, r) => {
                const shown = r < scene.rows;
                const marked = new Set<number>(r === 1 || !shown || active < 1 ? [] : row.marks);
                return (
                  <div key={row.name} className={`grid grid-cols-[minmax(0,1fr)_repeat(4,2.5rem)] items-center gap-1.5 sm:grid-cols-[11rem_repeat(4,2.75rem)] ${shown ? "" : "opacity-20"}`}>
                    <span className={`text-xs leading-4 sm:text-sm ${r === 1 ? "font-bold" : "text-muted-foreground"}`}>{row.name}</span>
                    {row.values.map((value, i) => (
                      <span
                        key={i}
                        className={`flex h-9 items-center justify-center rounded-md border font-mono text-sm font-bold ${marked.has(i) ? "border-2" : "border-border bg-background"}`}
                        style={marked.has(i) ? { borderColor: row.mark, color: row.mark } : undefined}
                      >
                        {shown ? value : "·"}
                      </span>
                    ))}
                  </div>
                );
              })}
              <div className="grid grid-cols-[minmax(0,1fr)_repeat(4,2.5rem)] gap-1.5 text-center text-[11px] text-muted-foreground sm:grid-cols-[11rem_repeat(4,2.75rem)]">
                <span />
                {[0, 1, 2, 3].map((i) => (
                  <span key={i}>위치 {i}</span>
                ))}
              </div>
            </div>
            <svg viewBox={`0 0 ${W} 74`} className="mx-auto mt-4 h-auto w-full max-w-[460px]" role="img" aria-label="받은 목록에서 각 정상 목록까지의 거리">
              <line x1={AX0} x2={AX1} y1={36} y2={36} stroke="#cbd5e1" strokeWidth={1} />
              {active >= 1 && (
                <>
                  <line x1={ax(0)} x2={ax(2)} y1={36} y2={36} stroke="#dc2626" strokeWidth={1.25} />
                  <text x={(ax(0) + ax(2)) / 2} y={28} textAnchor="middle" fontSize={11} fill="#b91c1c">{SENT_DIFF.length}곳</text>
                </>
              )}
              {active >= 2 && (
                <>
                  <line x1={ax(2)} x2={ax(3)} y1={36} y2={36} stroke="#d97706" strokeWidth={1.25} />
                  <text x={(ax(2) + ax(3)) / 2} y={28} textAnchor="middle" fontSize={11} fill="#b45309">{OTHER_DIFF.length}곳</text>
                </>
              )}
              <circle cx={ax(0)} cy={36} r={6} fill="#2563eb" />
              <text x={ax(0)} y={60} textAnchor="middle" fontSize={11} fill="#1d4ed8">2+3x</text>
              <circle cx={ax(2)} cy={36} r={6} fill={active >= 1 ? "#334155" : "#e2e8f0"} />
              <text x={ax(2)} y={60} textAnchor="middle" fontSize={11} fill={active >= 1 ? "#334155" : "#cbd5e1"}>받은 목록</text>
              <circle cx={ax(3)} cy={36} r={6} fill={active >= 2 ? "#d97706" : "#e2e8f0"} stroke={final ? "#d97706" : "none"} strokeWidth={1} />
              {final && <circle cx={ax(3)} cy={36} r={10} fill="none" stroke="#d97706" strokeWidth={1.25} />}
              <text x={ax(3)} y={60} textAnchor="end" fontSize={11} fill={active >= 2 ? "#b45309" : "#cbd5e1"}>2+4x</text>
              {final && (
                <text x={ax(3) - 14} y={14} textAnchor="end" fontSize={11} fontWeight={700} fill="#b45309">복원기가 고르는 쪽</text>
              )}
            </svg>
          </div>
        );
      }}
    />
  );
}
