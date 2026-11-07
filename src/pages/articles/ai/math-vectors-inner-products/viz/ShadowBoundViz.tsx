import { Arrow, Plane } from "./PlaneParts";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #cauchy-schwarz — u=(3,4)에 기준 (1,0), (6,8), (−6,−8), (4,−3).
 * 그림자 길이 = |u·v|/‖v‖ = 3, 5, 5, 0. 나머지 길이 = 4, 0, 0, 5. 항상 3²+4²=5²꼴이다.
 */
const SCENES = [
  { label: "기준이 가로", summary: "|u·v| = 3 ≤ 5×1", dir: [1, 0], name: "(1,0)", foot: [3, 0], shadow: 3, rest: 4, note: "가로 기준에서 그림자 길이는 3이고 수직인 나머지가 4입니다. 그림자는 전체 길이 5보다 짧습니다." },
  { label: "같은 직선 위", summary: "|u·v| = 50 = 5×10", dir: [0.6, 0.8], name: "(6,8)", foot: [3, 4], shadow: 5, rest: 0, note: "기준을 u와 같은 직선으로 돌리면 나머지가 0이 되어 그림자가 전체 길이 5와 같아집니다. 부등식이 등호가 되는 경우입니다." },
  { label: "반대 방향 직선", summary: "|u·v| = 50 = 5×10", dir: [-0.6, -0.8], name: "(−6,−8)", foot: [3, 4], shadow: 5, rest: 0, note: "기준이 반대쪽을 가리켜도 같은 직선입니다. 내적은 −50이고 절댓값이 50이라 역시 등호입니다." },
  { label: "기준이 직각", summary: "|u·v| = 0 ≤ 5×5", dir: [0.8, -0.6], name: "(4,−3)", foot: [0, 0], shadow: 0, rest: 5, note: "기준이 u와 직각이면 그림자가 사라집니다. 상한은 5×5=25지만 실제 내적은 0입니다. 상한은 가능한 최댓값이지 실제 유사도가 아닙니다." },
] as const;

function Row({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="min-w-0 text-xs sm:text-sm">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono">{value}</span>
      </div>
      <div className="mt-1 h-3 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${(value / 5) * 100}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

export default function ShadowBoundViz() {
  return (
    <SceneShell
      eyebrow="그림자의 상한"
      title="기준을 어느 쪽으로 돌려도 그림자는 전체 길이 5를 넘지 못합니다"
      description="그림자는 u=(3,4)를 회색 기준선에 투영한 길이 |u·v|÷‖v‖입니다. 초록 화살표는 v의 방향만 나타내고 실제 v의 길이는 장면마다 다릅니다. 위쪽 식은 '그림자 ≤ 5'의 양변에 ‖v‖를 곱한 꼴입니다."
      ariaLabel="기준 방향을 돌릴 때 그림자와 나머지 길이의 변화"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const [dx, dy] = scene.dir;
        const [fx, fy] = scene.foot;
        return (
          <div className="grid min-w-0 grid-cols-[minmax(0,165px)_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:gap-6">
            <Plane
              minX={-5}
              maxX={5}
              minY={-5}
              maxY={5}
              unit={16}
              className="mx-auto h-auto w-full max-w-[240px]"
              label={`${scene.label}: ${scene.summary}`}
              render={(sx, sy) => (
                <>
                  <line x1={sx(-4.8 * dx)} y1={sy(-4.8 * dy)} x2={sx(4.8 * dx)} y2={sy(4.8 * dy)} stroke="#64748b" strokeWidth={1} />
                  <Arrow x1={sx(0)} y1={sy(0)} x2={sx(1.6 * dx)} y2={sy(1.6 * dy)} color="#16a34a" />
                  <text x={sx(-4.7)} y={sy(4.1)} fontSize={12} fontWeight={700} fill="#16a34a">v={scene.name}</text>
                  {scene.rest > 0 && <line x1={sx(fx)} y1={sy(fy)} x2={sx(3)} y2={sy(4)} stroke="#d97706" strokeWidth={1.25} strokeDasharray="4 3" />}
                  <Arrow x1={sx(0)} y1={sy(0)} x2={sx(3)} y2={sy(4)} color="#475569" />
                  {scene.shadow > 0 && <line x1={sx(0)} y1={sy(0)} x2={sx(fx)} y2={sy(fy)} stroke="#2563eb" strokeWidth={1.25} />}
                  {scene.shadow > 0 && <circle cx={sx(fx)} cy={sy(fy)} r={3.5} fill="#2563eb" />}
                  <text x={sx(3) + 6} y={sy(4) - 6} fontSize={12} fontWeight={700} fill="#475569">u</text>
                </>
              )}
            />
            <div className="min-w-0 space-y-2">
              <Row label="전체 길이" value={5} color="#475569" />
              <Row label="그림자" value={scene.shadow} color="#2563eb" />
              <Row label="수직 나머지" value={scene.rest} color="#d97706" />
              <p className="pt-1 font-mono text-xs text-muted-foreground">{scene.shadow}² + {scene.rest}² = 5²</p>
            </div>
          </div>
        );
      }}
    />
  );
}
