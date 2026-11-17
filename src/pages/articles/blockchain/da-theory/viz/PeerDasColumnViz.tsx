import SceneShell from "./SceneShell";

/**
 * 본문 대응: #peerdas — blob 하나가 행 하나, 1차원 Reed–Solomon으로 가로 두 배, 같은 cell 번호를 세로로 모은 것이 data column,
 * ID로 정해지는 custody column 보관 + 다른 column은 peer에게 요청, 절반 이상의 column으로 각 행 복원, 세로 parity 없음.
 * blob 3개·원본 4칸·custody 열 1·5·요청 열 2·6은 설명용 가정. 실제 칸 수는 v1.6.1 Fulu 규격에 귀속.
 */
const ROWS = 3;
const SRC = 4;
const COLS = SRC * 2;
const CUSTODY: readonly number[] = [1, 5];
const REQUESTED: readonly number[] = [2, 6];
const HELD = [...CUSTODY, ...REQUESTED];

const SCENES = [
  { label: "blob 하나 = 행 하나", summary: `blob ${ROWS}개 → 행 ${ROWS}개`, note: "각 blob을 한 행으로 놓습니다. blob 3개와 행마다 원본 4칸은 설명용 크기입니다(가정)." },
  { label: "행마다 가로로 두 배", summary: `${SRC}칸 → ${COLS}칸`, note: "각 행을 따로 1차원 Reed–Solomon으로 확장해 가로 길이를 두 배로 만듭니다. 오른쪽 빈 칸이 행마다 계산한 복원용 cell입니다." },
  { label: "같은 번호를 세로로", summary: `data column ${COLS}개`, note: "여러 blob 행에서 같은 cell 번호를 세로로 모은 것이 data column입니다. 강조한 5번 열은 세 행의 5번 cell로 이루어집니다." },
  { label: "보관하고 요청하기", summary: "custody 열 + peer에게 요청", note: "노드는 자기 ID에서 정해지는 custody column을 보관하고, 블록마다 다른 column은 peer에게 요청합니다. 어느 열인지는 설명용입니다(가정)." },
  { label: "절반을 얻으면 행 복원", summary: `열 ${HELD.length}/${COLS} → 모든 행`, note: "전체 column의 절반 이상인 4개를 얻었으므로 각 행에서 서로 다른 네 cell을 갖게 됩니다. 각 행의 다항식을 보간해 확장 행 전체를 다시 만듭니다." },
  { label: "세로 parity는 없음", summary: `행은 그대로 ${ROWS}개`, note: "행을 쌓은 모습이 표처럼 보여도 세로 방향 parity 행을 추가하지 않습니다. 2차원 코드가 아니라 행마다 1차원 확장입니다." },
] as const;

export default function PeerDasColumnViz() {
  return (
    <SceneShell
      eyebrow="PeerDAS 배치"
      title="행은 가로로만 늘리고, 같은 번호의 칸을 열로 묶습니다"
      description="한 줄이 blob 하나, 칸 하나가 cell 하나입니다. 진한 칸은 원본, 옅은 칸은 행마다 계산한 복원용 cell입니다. 칸 수와 열 번호는 설명용입니다(가정)."
      ariaLabel="blob 행을 가로로 확장하고 같은 번호를 data column으로 묶어 절반의 열로 행을 복원하는 여섯 장면"
      scenes={SCENES}
      render={(active) => {
        const extended = active >= 1;
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[3rem_minmax(0,1fr)] gap-x-2 gap-y-1">
              <span />
              <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
                {Array.from({ length: COLS }, (_, col) => {
                  const tag = active === 3 || active === 4 ? (CUSTODY.includes(col) ? "보관" : REQUESTED.includes(col) ? "요청" : "") : "";
                  return (
                    <span key={col} className="text-center font-mono text-[9px] leading-4 text-muted-foreground">
                      {col}
                      <span className={`block text-[9px] font-bold ${tag === "보관" ? "text-[#2563eb]" : "text-[#b45309] dark:text-[#fbbf24]"}`}>{tag || " "}</span>
                    </span>
                  );
                })}
              </div>
              {Array.from({ length: ROWS + 1 }, (_, row) => {
                const parityRow = row === ROWS;
                return [
                  <span key={`l${row}`} className={`self-center text-[10px] font-semibold ${parityRow ? (active === 5 ? "text-[#b91c1c] dark:text-[#fca5a5]" : "text-transparent") : ""}`}>
                    {parityRow ? "세로 확장" : `blob ${row}`}
                  </span>,
                  <div key={`r${row}`} className="grid gap-1" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
                    {Array.from({ length: COLS }, (_, col) => {
                      if (parityRow) {
                        return <span key={col} className={`h-6 rounded-sm border border-dashed ${active === 5 ? "border-[#dc2626]/60" : "border-transparent"}`} />;
                      }
                      const isSrc = col < SRC;
                      const shown = isSrc || extended;
                      const colLit = active === 2 && col === 5;
                      const held = (active === 3 || active === 4) && HELD.includes(col);
                      const rebuilt = active === 4 && !HELD.includes(col);
                      const cls = !shown
                        ? "border-dashed border-border/50"
                        : colLit || held
                          ? CUSTODY.includes(col) || colLit
                            ? "border-[#2563eb] bg-[#2563eb]/25"
                            : "border-[#d97706] bg-[#d97706]/25"
                          : rebuilt
                            ? "border-[#16a34a] bg-[#16a34a]/20"
                            : isSrc
                              ? "border-foreground/40 bg-foreground/15"
                              : "border-border bg-muted/50";
                      return <span key={col} className={`h-6 rounded-sm border ${cls}`} />;
                    })}
                  </div>,
                ];
              })}
            </div>
            <p className="mt-3 min-h-5 text-[11px] text-muted-foreground">
              {active === 4 ? "초록 칸: 얻은 4개 열로 각 행을 보간해 다시 만든 cell" : active === 5 ? "점선 행: 그려 넣지 않는 세로 parity" : " "}
            </p>
          </div>
        );
      }}
    />
  );
}
