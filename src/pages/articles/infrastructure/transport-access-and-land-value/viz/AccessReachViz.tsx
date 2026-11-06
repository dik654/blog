import SceneShell from "./SceneShell";

/**
 * 본문 대응: #names — 속도가 같아도 주변 일자리와 환승망이 다르면 접근성은 다릅니다.
 * 원 = 주어진 시간 안에 닿는 범위. 일자리 점 12개와 위치는 설명용 가정이며, 개수는 좌표에서 계산합니다.
 */
type Point = [number, number];
const CENTER: Point = [85, 85];
const RADIUS = 58;
const STATION: Point = [138, 42];
const BRANCH_RADIUS = 24;

const JOBS_A: Point[] = [[60, 62], [85, 50], [112, 60], [52, 88], [66, 84], [108, 92], [62, 112], [88, 118], [118, 112], [18, 24], [150, 150], [20, 152]];
const JOBS_B: Point[] = [[70, 62], [105, 100], [60, 110], [146, 30], [152, 50], [128, 26], [18, 26], [22, 150], [150, 130], [140, 155], [40, 16], [12, 90]];

const dist = (a: Point, b: Point) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const inCircle = (p: Point) => dist(p, CENTER) <= RADIUS;
const inBranch = (p: Point) => dist(p, STATION) <= BRANCH_RADIUS;
const countA = JOBS_A.filter(inCircle).length;
const countB = JOBS_B.filter(inCircle).length;
const countBWithBranch = JOBS_B.filter((p) => inCircle(p) || inBranch(p)).length;

const SCENES = [
  { label: "같은 속도, 같은 시간", summary: "닿는 범위는 같음", note: "집에서 주어진 시간과 비용으로 갈 수 있는 범위를 원으로 그렸습니다. 두 곳의 교통 속도는 같습니다(가정)." },
  { label: "주변 일자리가 다르면", summary: `${countA}개 vs ${countB}개`, note: "원의 크기가 같아도 안에 든 일자리 수가 다릅니다. 접근성은 속도가 아니라 닿을 수 있는 일자리와 서비스의 범위를 셉니다. 개수는 가정입니다." },
  { label: "환승망이 다르면", summary: `나: ${countB}개 → ${countBWithBranch}개`, note: "나 지역에 환승 노선이 이어져 있다면 같은 시간에 닿는 범위가 그 방향으로 늘어납니다. 차량 속도는 그대로여도 접근성은 달라집니다." },
] as const;

function Panel({ x, name, jobs, showJobs, branch }: { x: number; name: string; jobs: Point[]; showJobs: boolean; branch: boolean }) {
  return (
    <g transform={`translate(${x} 18)`}>
      <text x={85} y={-6} textAnchor="middle" fontSize={12} fontWeight={700} fill="#475569">{name}</text>
      <rect x={0.5} y={0.5} width={169} height={169} rx={8} fill="none" stroke="#94a3b8" strokeWidth={1} />
      <circle cx={CENTER[0]} cy={CENTER[1]} r={RADIUS} fill="#2563eb" fillOpacity={0.1} stroke="#2563eb" strokeWidth={1} />
      {branch && (
        <>
          <circle cx={STATION[0]} cy={STATION[1]} r={BRANCH_RADIUS} fill="#2563eb" fillOpacity={0.1} stroke="#2563eb" strokeWidth={1} />
          <line x1={CENTER[0]} y1={CENTER[1]} x2={STATION[0]} y2={STATION[1]} stroke="#2563eb" strokeWidth={1.25} />
          <rect x={STATION[0] - 3} y={STATION[1] - 3} width={6} height={6} fill="#2563eb" />
        </>
      )}
      {showJobs &&
        jobs.map((p) => {
          const reached = inCircle(p) || (branch && inBranch(p));
          return <circle key={`${p[0]}-${p[1]}`} cx={p[0]} cy={p[1]} r={3.5} fill={reached ? "#d97706" : "#ffffff"} stroke={reached ? "#d97706" : "#94a3b8"} strokeWidth={1} />;
        })}
      <path d={`M${CENTER[0]} ${CENTER[1] - 7}l6 6v7h-12v-7z`} fill="#0f172a" stroke="#ffffff" strokeWidth={1} />
    </g>
  );
}

export default function AccessReachViz() {
  return (
    <SceneShell
      eyebrow="교통 접근성"
      title="속도가 같아도 닿는 일자리가 다르면 접근성이 다릅니다"
      description="집 모양이 출발지, 원이 닿는 범위, 작은 점이 일자리입니다(칠한 점은 닿음). 지역마다 일자리 12개이고, 개수와 위치는 가정입니다."
      ariaLabel="같은 반경 안에 든 일자리 수를 두 지역에서 비교하고 환승 노선으로 범위가 늘어나는 모습"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 192" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <Panel x={0} name={active === 0 ? "가 지역" : `가 지역 · 닿는 일자리 ${countA}개`} jobs={JOBS_A} showJobs={active > 0} branch={false} />
          <Panel x={190} name={active === 0 ? "나 지역" : `나 지역 · 닿는 일자리 ${active === 2 ? countBWithBranch : countB}개`} jobs={JOBS_B} showJobs={active > 0} branch={active === 2} />
        </svg>
      )}
    />
  );
}
