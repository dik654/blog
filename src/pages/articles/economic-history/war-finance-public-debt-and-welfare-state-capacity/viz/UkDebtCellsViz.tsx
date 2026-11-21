import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison 첫 문단 — House of Commons Library 정리: 영국 국채 1688년 약 100만 파운드,
 * 10년 뒤 1,500만, 1800년 무렵 약 5억 파운드. 칸 하나 = 100만 파운드 → 1칸, 15칸, 500칸.
 * 500 ÷ 1 = 500배, 500 ÷ 15 ≈ 33배. 명목 금액(물가 미반영)이라 배수에 물가 상승분이 섞여 있다.
 */
interface Scene {
  label: string;
  summary: string;
  cells: number;
  note: string;
}

const SCENES: readonly Scene[] = [
  { label: "1688년", summary: "약 100만 파운드 = 1칸", cells: 1, note: "House of Commons Library는 영국 국채가 1688년 약 100만 파운드였다고 정리합니다. 칸 하나가 100만 파운드이므로 한 칸입니다." },
  { label: "10년 뒤", summary: "1,500만 파운드 = 15칸", cells: 15, note: "10년 뒤에는 1,500만 파운드, 곧 15칸입니다. 1688년의 약 15배입니다." },
  { label: "1800년 무렵", summary: "약 5억 파운드 = 500칸", cells: 500, note: "1800년 무렵에는 약 5억 파운드, 곧 500칸입니다. 1688년의 약 500배, 10년 뒤 1,500만의 약 33배(500 ÷ 15)이며 명목 금액이라 물가 상승분이 섞여 있습니다." },
];

const COLS = 25;
const ROWS = 20;
const CELL = 11;
const GAP = 2;

export default function UkDebtCellsViz() {
  return (
    <SceneShell
      eyebrow="국채 규모"
      title="영국 국채는 100만 파운드에서 약 5억 파운드로 불었습니다"
      description="칸 하나가 100만 파운드입니다. 숫자는 9절이 인용한 House of Commons Library 브리핑의 정리이고 물가를 반영하지 않은 명목 금액이며, 빈 칸은 1800년 무렵 규모의 자리를 미리 보인 것입니다."
      ariaLabel="영국 국채 1688년 약 100만 파운드, 10년 뒤 1,500만 파운드, 1800년 무렵 약 5억 파운드를 100만 파운드 칸으로 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox={`0 0 ${COLS * (CELL + GAP) - GAP} ${ROWS * (CELL + GAP) - GAP}`} className="mx-auto h-auto w-full max-w-[420px] text-foreground" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {Array.from({ length: COLS * ROWS }, (_, index) => {
              const filled = index < scene.cells;
              const x = (index % COLS) * (CELL + GAP);
              const y = Math.floor(index / COLS) * (CELL + GAP);
              return <rect key={index} x={x + 0.5} y={y + 0.5} width={CELL - 1} height={CELL - 1} rx={2} fill={filled ? "#2563eb" : "none"} fillOpacity={0.35} stroke={filled ? "#2563eb" : "#94a3b8"} strokeOpacity={filled ? 1 : 0.4} strokeWidth={1} />;
            })}
          </svg>
        );
      }}
    />
  );
}
