import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need — 재고 손실 10을 선물 이익 10으로 막았어도 분류·인식 규칙이 다르면 한 해 과세 장부는 0이 아닐 수 있습니다.
 * 어느 해에 어느 항목이 잡히는지는 본문에 없으므로 "선물 이익은 1년차 연말 평가, 재고 손실은 2년차"로 놓은 가정입니다.
 * 1년차 +10, 2년차 −10, 두 해 합계 0.
 */
type Cell = { item: string; value: number } | null;

const SCENES = [
  {
    label: "경제적으로는 0",
    summary: "−10 + 10 = 0",
    year1: [{ item: "재고 손실", value: -10 }, { item: "선물 이익", value: 10 }] as readonly Cell[],
    year2: [null, null] as readonly Cell[],
    tax: false,
    note: "재고 값이 10 떨어진 만큼 선물에서 10을 벌었습니다. 회사 전체의 경제적 결과만 보면 손익은 0입니다.",
  },
  {
    label: "세금 장부가 기간을 나누면",
    summary: "1년차 +10 · 2년차 −10",
    year1: [null, { item: "선물 이익", value: 10 }] as readonly Cell[],
    year2: [{ item: "재고 손실", value: -10 }, null] as readonly Cell[],
    tax: true,
    note: "두 항목의 분류와 인식 규칙이 다르면 같은 해에 함께 잡히지 않을 수 있습니다. 여기서는 선물 이익이 1년차 연말 평가로, 재고 손실이 2년차에 잡힌다고 놓았습니다(가정). 그러면 1년차 과세 장부는 0이 아니라 +10입니다.",
  },
  {
    label: "식별 시점이 갈림길",
    summary: "거래 때 식별 ↔ 사후 설명",
    year1: [null, { item: "선물 이익", value: 10 }] as readonly Cell[],
    year2: [{ item: "재고 손실", value: -10 }, null] as readonly Cell[],
    tax: true,
    note: "세법상 헤지 식별을 정해진 시점에 했다면 별도 예외와 연결 규칙을 검토할 수 있습니다. 늦게 식별하면 경제적 설명만으로 예외를 되살리기 어려울 수 있고, 회계상 헤지 지정도 세법상 식별과 자동으로 같지 않습니다.",
  },
] as const;

function CellBox({ cell }: { cell: Cell }) {
  if (!cell) return <div className="h-12 rounded-md border border-dashed border-border/50" />;
  const loss = cell.value < 0;
  return (
    <div className="flex h-12 flex-col items-center justify-center rounded-md border text-xs" style={{ borderColor: loss ? "#dc2626" : "#16a34a" }}>
      <span className="text-muted-foreground">{cell.item}</span>
      <span className="font-mono font-bold" style={{ color: loss ? "#dc2626" : "#16a34a" }}>{loss ? "−" : "+"}{Math.abs(cell.value)}</span>
    </div>
  );
}

const sum = (cells: readonly Cell[]) => cells.reduce<number>((total, cell) => total + (cell ? cell.value : 0), 0);
const signed = (value: number) => (value === 0 ? "0" : `${value > 0 ? "+" : "−"}${Math.abs(value)}`);

export default function HedgeTimingViz() {
  return (
    <SceneShell
      eyebrow="헤지와 과세 시점"
      title="경제적으로 0인 헤지도 한 해 장부에서는 0이 아닐 수 있습니다"
      description="열 하나가 과세연도 하나입니다. 어느 해에 어느 항목이 잡히는지는 설명을 위해 정한 것이며(가정) 특정 제도의 실제 인식 시점이 아닙니다. 세법상 헤지 식별은 막으려는 위험과 파생계약을 세법이 요구하는 방식·시점에 묶은 기록입니다."
      ariaLabel="재고 손실 10과 선물 이익 10이 서로 다른 과세연도에 잡혀 한 해 장부가 0이 되지 않는 과정과 헤지 식별 시점의 갈림길"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        const years = [
          { name: scene.tax ? "1년차 과세 장부" : "경제적 결과", cells: scene.year1 },
          { name: scene.tax ? "2년차 과세 장부" : "(다음 해는 아직 보지 않음)", cells: scene.year2 },
        ];
        return (
          <div className="min-w-0 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {years.map((year) => (
                <div key={year.name} className="min-w-0 space-y-2 rounded-lg border border-border p-2">
                  <p className="text-center text-xs font-semibold">{year.name}</p>
                  {year.cells.map((cell, cellIndex) => <CellBox key={cellIndex} cell={cell} />)}
                  <p className="border-t border-border pt-1 text-center font-mono text-sm font-bold">합 {year.cells.some((cell) => cell) ? signed(sum(year.cells)) : "—"}</p>
                </div>
              ))}
            </div>
            <div className={`grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-3 text-xs leading-5 ${index === 2 ? "" : "opacity-25"}`} aria-hidden={index !== 2}>
              <div className="rounded-lg border border-[#16a34a] p-2">
                <p className="font-semibold text-[#15803d]">거래 때 세법상 식별</p>
                <p className="text-muted-foreground">위험·계약을 정해진 방식으로 기록 → 별도 예외와 연결 규칙을 검토할 수 있음</p>
              </div>
              <div className="rounded-lg border border-dashed border-[#dc2626] p-2">
                <p className="font-semibold text-[#b91c1c]">세법상 식별을 늦게 함</p>
                <p className="text-muted-foreground">경제적 설명만으로 예외를 되살리기 어려울 수 있음</p>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
