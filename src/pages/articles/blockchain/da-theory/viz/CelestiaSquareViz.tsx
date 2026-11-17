import SceneShell from "./SceneShell";

/**
 * 본문 대응: #celestia — 4×4 원본 16칸 → 각 행을 8칸으로(4×8=32) → 그 결과의 각 열을 8칸으로(8×8=64), code rate 16÷64=1/4.
 * 가로·세로 모두 복원 관계가 생겨 좌표 단위 표본과 행·열 복원을 쓴다. 표본 좌표 (행 2, 열 6)은 설명용 가정.
 */
const N = 8;
const HALF = 4;
const SAMPLE = { row: 2, col: 6 } as const;

const SCENES = [
  { label: "원본 정사각형", summary: `${HALF}×${HALF} = ${HALF * HALF}칸`, note: "원본 자료를 4×4, 16칸의 정사각형으로 놓습니다." },
  { label: "각 행을 8칸으로", summary: `${HALF}×${N} = ${HALF * N}칸`, note: "원본의 네 행을 각각 8칸으로 늘립니다. 오른쪽 절반이 행 방향 복원용 칸입니다." },
  { label: "각 열도 8칸으로", summary: `${N}×${N} = ${N * N}칸`, note: "앞 단계 결과의 여덟 열을 각각 8칸으로 늘립니다. 아래 절반이 열 방향 복원용 칸이고, 전체는 8×8의 64칸입니다." },
  { label: "원본 비율과 좌표 표본", summary: `${HALF * HALF} ÷ ${N * N} = 1/4`, note: "64칸 중 원본이 16칸이라 code rate는 1/4입니다. 가로·세로 모두 복원 관계가 있어 좌표 단위로 표본을 받고 행·열 단위로 복원합니다. 이 1/4을 PeerDAS에 옮기면 틀립니다." },
] as const;

export default function CelestiaSquareViz() {
  return (
    <SceneShell
      eyebrow="2차원 확장"
      title="행을 늘린 뒤 열을 늘리면 원본은 전체의 1/4이 됩니다"
      description="칸 하나가 정사각형의 한 칸입니다. 진한 칸은 원본, 파란 칸은 행 방향 확장, 주황 칸은 열 방향 확장입니다. 마지막 장면의 표본 좌표는 설명용입니다(가정)."
      ariaLabel="4×4 원본을 행과 열 방향으로 확장해 8×8이 되고 원본 비율이 1/4이 되는 네 장면"
      scenes={SCENES}
      render={(active) => (
        <div className="mx-auto grid w-full max-w-[12rem] gap-1 sm:max-w-[18rem]" style={{ gridTemplateColumns: `repeat(${N}, minmax(0, 1fr))` }}>
          {Array.from({ length: N * N }, (_, index) => {
            const row = Math.floor(index / N);
            const col = index % N;
            const src = row < HALF && col < HALF;
            const rowExt = row < HALF && col >= HALF;
            const colExt = row >= HALF;
            const shown = src || (rowExt && active >= 1) || (colExt && active >= 2);
            const sample = active === 3 && row === SAMPLE.row && col === SAMPLE.col;
            const line = active === 3 && !sample && (row === SAMPLE.row || col === SAMPLE.col);
            const cls = !shown
              ? "border-dashed border-border/50"
              : sample
                ? "border-[#dc2626] bg-[#dc2626]/40"
                : src
                  ? "border-foreground/40 bg-foreground/20"
                  : rowExt
                    ? "border-[#2563eb]/70 bg-[#2563eb]/20"
                    : "border-[#d97706]/70 bg-[#d97706]/20";
            return <span key={index} className={`aspect-square rounded-sm border ${cls} ${line ? "outline outline-1 outline-[#dc2626]/60" : ""}`} />;
          })}
        </div>
      )}
    />
  );
}
