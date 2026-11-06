import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — 2단계 모델이 정확해도 목표가 20단계 뒤 장애물 너머면 마지막 거리만으로 최선 경로를 못 고를 수 있다.
 * 그림의 지도(가정): 시작 (2,0), 목표 (4,0), 벽 x=3의 y=0..8, 통로 y=9. 경로 위 9 + 오른쪽 2 + 아래 9 = 20단계.
 * 제곱거리 / 남은 단계: [→,→] (2,0) 4 / 20 · [↑,→] (2,1) 5 / 19 · [↑,↑] (2,2) 8 / 18 · [←,←] (0,0) 16 / 22.
 */
const COLS = 7;
const ROWS = 10;
const C = 17;
const LEFT = 8;
const TOP = 10;
const INK = "#64748b";
const LINE = "#94a3b8";
const BLUE = "#2563eb";
const GREEN = "#16a34a";
const AMBER = "#d97706";
const WALL = "#475569";

const gx = (x: number) => LEFT + x * C + C / 2;
const gy = (y: number) => TOP + (ROWS - 1 - y) * C + C / 2;

const CANDIDATES = [
  { name: "[→, →]", end: [2, 0], cost: 4, left: 20, note: "벽에 막혀 제자리" },
  { name: "[↑, →]", end: [2, 1], cost: 5, left: 19, note: "" },
  { name: "[↑, ↑]", end: [2, 2], cost: 8, left: 18, note: "" },
  { name: "[←, ←]", end: [0, 0], cost: 16, left: 22, note: "" },
] as const;

const ROUTE = [[2, 0], [2, 9], [4, 9], [4, 0]] as const;

const SCENES = [
  { label: "목표는 벽 너머", summary: "경로 9 + 2 + 9 = 20단계", note: "우리의 2단계 모델이 틀림없이 정확하다고 합시다. 목표가 20단계 뒤 장애물 너머에 있습니다. 직선으로는 칸 두 개 거리지만 벽을 돌아가야 합니다." },
  { label: "네 후보의 마지막 칸", summary: "2단계만 펼침", note: "벽에 막히면 제자리라고 아는 정확한 모델로 네 후보를 끝까지 펼칩니다(후보는 가정). 예측 자체에는 틀린 것이 없습니다." },
  { label: "마지막 거리로 고르면", summary: "최소 비용 4 · [→, →]", note: "제곱거리만 보면 벽 앞에 그대로 있는 후보가 가장 좋아 보입니다. 위로 가는 후보는 목표에서 오히려 멀어져 비용이 8로 커집니다." },
  { label: "실제 경로는 비용을 올립니다", summary: "남은 단계 20 대 18", note: "표의 남은 단계를 보면 [↑, ↑]가 가장 가깝습니다. 네 후보의 마지막 거리만으로는 최선 경로를 고르지 못할 수 있습니다. 이 경계에서 더 긴 예측, 가까운 subgoal, 별도 value나 제약 모델이 필요한지 판단합니다." },
] as const;

export default function ObstacleMapViz() {
  return (
    <SceneShell
      eyebrow="계획 범위의 경계"
      title="정확한 2단계 예측도 벽 너머 목표에서는 순위를 뒤집을 수 있습니다"
      description="칸 하나가 행동 한 번의 이동이고 왼쪽 아래 칸이 좌표 (0, 0)입니다. 회색 칸이 벽, S가 시작, G가 목표이며 비용은 마지막 칸과 G의 제곱거리입니다."
      note="지도와 네 후보는 본문의 20단계·장애물 상황을 그리려고 만든 2차원 가정이며, 논문의 환경이나 측정값이 아닙니다."
      ariaLabel="벽 너머 목표에서 마지막 거리 비용과 실제 남은 단계가 어긋나는 과정"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 190" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {Array.from({ length: COLS * ROWS }, (_, index) => {
            const x = index % COLS;
            const y = Math.floor(index / COLS);
            const wall = x === 3 && y <= 8;
            return <rect key={index} x={LEFT + x * C} y={TOP + (ROWS - 1 - y) * C} width={C} height={C} fill={wall ? WALL : "none"} stroke={LINE} strokeWidth={0.5} />;
          })}
          {(active === 0 || active === 3) && (
            <polyline points={ROUTE.map(([x, y]) => `${gx(x)},${gy(y)}`).join(" ")} fill="none" stroke={GREEN} strokeWidth={1.25} strokeDasharray="4 3" />
          )}
          {active >= 1 && CANDIDATES.map((candidate) => {
            const [x, y] = candidate.end;
            const best = (active >= 2 && candidate.cost === 4) || (active === 3 && candidate.left === 18);
            const color = active === 3 && candidate.left === 18 ? GREEN : best ? AMBER : BLUE;
            return <circle key={candidate.name} cx={gx(x)} cy={gy(y)} r={best ? 6.5 : 4.5} fill={color} />;
          })}
          <text x={gx(2)} y={gy(0) + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill={active >= 1 ? "#ffffff" : INK}>S</text>
          <text x={gx(4)} y={gy(0) + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={GREEN}>G</text>

          <g transform="translate(142 0)">
            {active > 0 && (
              <>
                <text x={0} y={22} fontSize={12} fontWeight={700} fill={INK}>후보</text>
                <text x={58} y={22} fontSize={12} fontWeight={700} fill={INK}>마지막 칸</text>
                <text x={120} y={22} fontSize={12} fontWeight={700} fill={INK}>비용</text>
              </>
            )}
            {active === 3 && <text x={150} y={22} fontSize={12} fontWeight={700} fill={GREEN}>남은 단계</text>}
            {active === 0 ? (
              <>
                <text x={0} y={52} fontSize={12} fill={INK}>벽을 돌아가는 경로</text>
                <text x={0} y={72} fontSize={12} fill={GREEN}>위 9 + 오른쪽 2 + 아래 9 = 20</text>
              </>
            ) : (
              CANDIDATES.map((candidate, index) => {
                const y = 52 + index * 30;
                const pickCost = active >= 2 && candidate.cost === 4;
                const pickLeft = active === 3 && candidate.left === 18;
                const color = pickLeft ? GREEN : pickCost ? AMBER : INK;
                return (
                  <g key={candidate.name}>
                    <text x={0} y={y} fontSize={12} fontWeight={pickCost || pickLeft ? 700 : 400} fill={color}>{candidate.name}</text>
                    <text x={58} y={y} fontSize={12} fill={color}>({candidate.end[0]}, {candidate.end[1]})</text>
                    <text x={120} y={y} fontSize={12} fontWeight={pickCost ? 700 : 400} fill={color}>{candidate.cost}</text>
                    {active === 3 && <text x={150} y={y} fontSize={12} fontWeight={pickLeft ? 700 : 400} fill={color}>{candidate.left}</text>}
                  </g>
                );
              })
            )}
          </g>
        </svg>
      )}
    />
  );
}
