import SceneShell from "./SceneShell";

/**
 * 본문 대응: #vln-taxonomy — 같은 약 10m 경로(R2R 평균 길이)를
 * discrete graph(평균 4~6 edge), VLN-CE 고정 0.25m 전진, waypoint(0.25~4m)로 각각 걷는다.
 * 복도 7m + 방 안 3m 배치와 graph node 위치는 가정이다.
 * 10m ÷ 0.25m = 40번 전진, 10m ÷ 4m = 2.5 → waypoint 최소 3번.
 */
const PX = 30;
const OX = 36;
const OY = 150;
const px = (mx: number) => OX + mx * PX;
const py = (my: number) => OY - my * PX;

type Pt = readonly [number, number];

const ROUTE_NODES: readonly Pt[] = [
  [0, 0],
  [2.5, 0],
  [5, 0],
  [7, 0],
  [7, 1.5],
  [7, 3],
];
const SIDE_NODES: readonly Pt[] = [[9, 0]];
const SIDE_EDGES: readonly (readonly [Pt, Pt])[] = [[[7, 0], [9, 0]]];

const STEP = 0.25;
const DOTS: readonly Pt[] = [
  ...Array.from({ length: 28 }, (_, index): Pt => [(index + 1) * STEP, 0]),
  ...Array.from({ length: 12 }, (_, index): Pt => [7, (index + 1) * STEP]),
];

const WAYPOINTS: readonly Pt[] = [
  [0, 0],
  [4, 0],
  [7, 0],
  [7, 3],
];
const HOPS = WAYPOINTS.slice(1).map((point, index) => {
  const prev = WAYPOINTS[index];
  return { from: prev, to: point, len: Math.hypot(point[0] - prev[0], point[1] - prev[1]) };
});

const SCENES = [
  {
    label: "Discrete graph (R2R)",
    summary: "edge 5개를 골라 이동 (가정)",
    note: "R2R은 미리 만든 navigation graph 위에서 움직입니다. 점(viewpoint)은 사진을 찍어 둔 위치이고, 매 step 연결된 viewpoint 중 하나를 고릅니다. 위치와 연결을 미리 안다고 가정하며 경로 하나는 평균 4~6개 edge, 약 10m입니다.",
  },
  {
    label: "VLN-CE 저수준 action",
    summary: "10m ÷ 0.25m = 40번 전진 + 회전",
    note: "VLN-CE는 graph와 정확한 위치라는 가정을 없앱니다. Agent는 고정 거리 0.25m 전진과 회전만으로 움직이므로 같은 10m에 전진만 최소 40번, 여기에 회전 action이 더 필요합니다. 이 설정에서 성능이 크게 떨어졌습니다.",
  },
  {
    label: "Waypoint prediction",
    summary: "한 번에 0.25~4m → 최소 3번",
    note: "Waypoint는 다음에 도착할 중간 목표 지점입니다. 거리 0.25~4m, 방향 오프셋 ±15˚까지 자유롭게 예측하면 10m를 4m 이하 구간 3개(4m·3m·3m, 가정)로 끊을 수 있습니다. 논문은 표현력이 큰 예측일수록 더 짧고 실행이 빠른 경로를 만들었다고 보고합니다.",
  },
] as const;

function Floor() {
  return (
    <g>
      <rect x={px(-0.6)} y={py(0.7)} width={px(9.6) - px(-0.6)} height={py(-0.7) - py(0.7)} fill="none" stroke="#cbd5e1" strokeWidth={1} />
      <rect x={px(5.6)} y={py(3.8)} width={px(8.4) - px(5.6)} height={py(0.7) - py(3.8)} fill="none" stroke="#cbd5e1" strokeWidth={1} />
      <text x={px(-0.5)} y={py(0.7) - 5} fontSize={11} fill="#64748b">복도 7m (가정)</text>
      <text x={px(8.5)} y={py(3.8) + 12} fontSize={11} fill="#64748b">방 3m</text>
      <circle cx={px(0)} cy={py(0)} r={5} fill="#0f172a" />
      <text x={px(0)} y={py(0) + 18} fontSize={11} textAnchor="middle" fill="#0f172a">출발</text>
      <rect x={px(7) - 6} y={py(3) - 6} width={12} height={12} rx={2} fill="none" stroke="#16a34a" strokeWidth={1.25} />
      <text x={px(7) - 10} y={py(3) + 4} fontSize={11} textAnchor="end" fill="#16a34a">목표</text>
    </g>
  );
}

export default function ActionSpaceMapViz() {
  return (
    <SceneShell
      eyebrow="같은 경로, 세 가지 action space"
      title="한 번에 얼마나 멀리 고를 수 있느냐가 결정 횟수를 바꿉니다"
      description="위에서 내려다본 평면도입니다. 출발에서 목표까지 약 10m로, R2R 경로의 평균 길이를 씁니다. 복도와 방 배치는 가정입니다."
      note="점의 위치와 waypoint 구간 길이는 action 단위 차이를 보이려는 예시이며 실제 benchmark 경로가 아닙니다."
      ariaLabel="약 10미터 경로를 discrete graph, 0.25미터 전진, 0.25에서 4미터 waypoint로 이동할 때 결정 횟수 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 24 360 154" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <Floor />
          {active === 0 && (
            <g>
              {SIDE_EDGES.map(([a, b]) => (
                <line key={`${a[0]}-${a[1]}-${b[0]}`} x1={px(a[0])} y1={py(a[1])} x2={px(b[0])} y2={py(b[1])} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
              ))}
              {ROUTE_NODES.slice(1).map((node, index) => {
                const prev = ROUTE_NODES[index];
                return <line key={`e${index}`} x1={px(prev[0])} y1={py(prev[1])} x2={px(node[0])} y2={py(node[1])} stroke="#2563eb" strokeWidth={1.25} />;
              })}
              {[...ROUTE_NODES, ...SIDE_NODES].map((node) => (
                <circle key={`n${node[0]}-${node[1]}`} cx={px(node[0])} cy={py(node[1])} r={4} fill="#ffffff" stroke="#2563eb" strokeWidth={1.25} />
              ))}
              <text x={px(9)} y={py(0) + 18} fontSize={11} textAnchor="middle" fill="#64748b">다른 viewpoint</text>
            </g>
          )}
          {active === 1 && (
            <g>
              {DOTS.map((dot) => (
                <circle key={`d${dot[0]}-${dot[1]}`} cx={px(dot[0])} cy={py(dot[1])} r={1.8} fill="#2563eb" />
              ))}
              <text x={px(7) + 8} y={py(0) + 4} fontSize={11} fill="#d97706">회전</text>
              <text x={px(3.5)} y={py(0) + 20} fontSize={11} textAnchor="middle" fill="#2563eb">점 하나 = 0.25m 전진</text>
            </g>
          )}
          {active === 2 && (
            <g>
              {HOPS.map((hop) => {
                const mx = (hop.from[0] + hop.to[0]) / 2;
                const my = (hop.from[1] + hop.to[1]) / 2;
                const vertical = hop.from[0] === hop.to[0];
                return (
                  <g key={`h${hop.to[0]}-${hop.to[1]}`}>
                    <line x1={px(hop.from[0])} y1={py(hop.from[1])} x2={px(hop.to[0])} y2={py(hop.to[1])} stroke="#2563eb" strokeWidth={1.25} />
                    <circle cx={px(hop.to[0])} cy={py(hop.to[1])} r={4} fill="#2563eb" />
                    <text x={vertical ? px(mx) - 8 : px(mx)} y={vertical ? py(my) + 4 : py(my) + 20} fontSize={11} textAnchor={vertical ? "end" : "middle"} fill="#2563eb">
                      {hop.len}m
                    </text>
                  </g>
                );
              })}
            </g>
          )}
        </svg>
      )}
    />
  );
}
