import CovCells from "./CovCells";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mean-noise — 합의 제곱을 펼치면 B²칸, 독립이면 대각선 B칸만 σ²=1/2로 남는다.
 * B=2: 1/4, B=4: 1/8, B=16: 1/32. 분모 B²은 칸 전체 수, 분자는 살아남은 칸의 합이다.
 */
const SCENES = [
  { label: "B = 2", summary: "(1/2 + 1/2) / 4 = 1/4", note: "편차 합을 제곱해 펼치면 두 자리끼리 곱한 칸이 2×2=4개입니다. 평균은 합을 B로 나눈 값이라 제곱 거리에는 1/B²이 붙어 칸 전체 수 4로 나눕니다.", size: 2, live: "2칸 × 1/2 = 1", total: "4칸" },
  { label: "B = 4", summary: "(4 × 1/2) / 16 = 1/8", note: "칸은 16개로 늘지만 값이 남는 칸은 대각선 4개뿐입니다. 서로 독립인 두 편차의 곱은 평균이 0이어서 나머지 칸이 사라집니다.", size: 4, live: "4칸 × 1/2 = 2", total: "16칸" },
  { label: "B = 16", summary: "(16 × 1/2) / 256 = 1/32", note: "분모는 B²으로, 분자는 B로 늘어 결과가 σ²/B입니다. 한 점수의 분산 1/2 자체가 바뀐 것은 아니고, 칸이 너무 작아 글자는 지웠습니다.", size: 16, live: "16칸 × 1/2 = 8", total: "256칸" },
] as const;

export default function BSquaredCellsViz() {
  return (
    <SceneShell
      eyebrow="평균의 분산을 펼치면"
      title="B²칸으로 나누고 대각선 B칸만 남습니다"
      description="칸 하나가 두 자리 편차의 곱을 평균한 값입니다. 파란 대각선이 각 자리의 분산 1/2이고, 회색 칸은 독립이라 0입니다."
      ariaLabel="B가 2, 4, 16일 때 B제곱 칸 중 대각선만 남는 격자"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <CovCells size={scene.size} diagonal="1/2" off="0" mark />
            <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs leading-5 sm:text-sm">
              <div className="rounded-sm border border-border px-1 py-1"><span className="block text-muted-foreground">값이 남는 칸</span><span className="font-mono font-bold">{scene.live}</span></div>
              <div className="rounded-sm border border-border px-1 py-1"><span className="block text-muted-foreground">나누는 수 B²</span><span className="font-mono font-bold">{scene.total}</span></div>
            </div>
          </div>
        );
      }}
    />
  );
}
