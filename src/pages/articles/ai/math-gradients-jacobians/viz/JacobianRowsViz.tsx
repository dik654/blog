import SceneShell from "./SceneShell";

/**
 * 본문 대응: #jacobian — F(x,y)=(x+y,xy), 위치 (2,3), v=(0.01,−0.02).
 * 첫 행 1×0.01+1×(−0.02)=−0.01, 둘째 행 3×0.01+2×(−0.02)=−0.01.
 * 예측 (4.99,5.99), 실제 (4.99,5.9898).
 */
const SCENES = [
  { label: "표를 세웁니다", summary: "J = [[1,1],[3,2]]", note: "행은 어떤 결과를 계산하는지, 열은 어떤 입력을 움직이는지 정합니다. 곱 xy의 칸은 위치에 달려 있어 (2,3)에서 3과 2입니다." },
  { label: "첫 행 · 합 x+y", summary: "0.01 − 0.02 = −0.01", note: "각 칸의 비율에 그 열의 입력 변화를 곱한 뒤 같은 행 안에서 더합니다. 합의 예측은 5에서 4.99입니다." },
  { label: "둘째 행 · 곱 xy", summary: "0.03 − 0.04 = −0.01", note: "같은 입력 변화를 둘째 행에 다시 적용합니다. 비율이 달라 기여도 +0.03과 −0.04로 달라지고, 곱의 예측은 6에서 5.99입니다." },
  { label: "실제 결과와 비교", summary: "(4.99, 5.99) ↔ (4.99, 5.9898)", note: "합은 예측과 같고 곱만 −0.0002 차이가 납니다. 야코비안은 작은 이동에 대한 1차 예측이라 이런 나머지가 남을 수 있습니다." },
] as const;

const ROWS: readonly { name: string; cells: readonly { rate: string; part: string }[]; sum: string; from: string; to: string; real: string }[] = [
  { name: "F₁ = x+y", cells: [{ rate: "1", part: "1×0.01 = +0.01" }, { rate: "1", part: "1×(−0.02) = −0.02" }], sum: "−0.01", from: "5", to: "4.99", real: "4.99" },
  { name: "F₂ = xy", cells: [{ rate: "y = 3", part: "3×0.01 = +0.03" }, { rate: "x = 2", part: "2×(−0.02) = −0.04" }], sum: "−0.01", from: "6", to: "5.99", real: "5.9898" },
];

const COLS = "grid grid-cols-[3.6rem_minmax(0,1fr)_minmax(0,1fr)_3.4rem] gap-1.5 sm:grid-cols-[6rem_minmax(0,1fr)_minmax(0,1fr)_6rem] sm:gap-2";

export default function JacobianRowsViz() {
  return (
    <SceneShell
      eyebrow="행과 열"
      title="입력 변화를 표의 행마다 따로 합칩니다"
      description="가정 F(x,y)=(x+y, xy)의 (2,3)에서 v=(0.01, −0.02)를 표에 통과시킵니다. 위 칸이 비율, 아래 칸이 그 입력의 기여입니다."
      ariaLabel="야코비안 표의 행과 열에 입력 변화를 곱해 결과별로 합하는 과정"
      scenes={SCENES}
      render={(index) => (
        <div className="min-w-0 space-y-1.5">
          <div className={`${COLS} text-center text-xs font-bold`}>
            <span />
            <span>x 이동{index > 0 ? " +0.01" : ""}</span>
            <span>y 이동{index > 0 ? " −0.02" : ""}</span>
            <span>행의 합</span>
          </div>
          {ROWS.map((row, rowIndex) => {
            const shown = index > rowIndex;
            const focus = index === rowIndex + 1;
            return (
              <div key={row.name} className={COLS}>
                <span className={`flex items-center text-xs font-bold ${focus ? "text-[#2563eb]" : ""}`}>{row.name}</span>
                {row.cells.map((cell) => (
                  <div key={cell.part} className={`min-h-[4.6rem] rounded-lg border px-1 py-2 text-center ${focus ? "border-[#2563eb]" : "border-border"} bg-background`}>
                    <span className="block font-mono text-sm font-bold">{cell.rate}</span>
                    <span className={`mt-1 block font-mono text-[11px] leading-4 sm:text-xs ${shown ? "text-muted-foreground" : "invisible"}`}>{cell.part}</span>
                  </div>
                ))}
                <div className={`flex items-center justify-center rounded-lg border px-1 text-center font-mono text-sm font-bold ${shown ? "border-[#2563eb] text-[#2563eb]" : "border-dashed border-border/60 text-transparent"}`}>{row.sum}</div>
              </div>
            );
          })}
          <div className="grid grid-cols-2 gap-2 pt-2 font-mono text-xs">
            {ROWS.map((row, rowIndex) => (
              <div key={row.name} className="rounded-lg border border-border bg-background px-2 py-2 leading-5">
                <span className="block font-bold">{row.name}</span>
                <span className="block">예측 {index > rowIndex ? `${row.from} → ${row.to}` : "−"}</span>
                <span className={`block ${index === 3 && row.real !== row.to ? "font-bold text-[#b45309]" : ""}`}>실제 {index === 3 ? row.real : "−"}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    />
  );
}
