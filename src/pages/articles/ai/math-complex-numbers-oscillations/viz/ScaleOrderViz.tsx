import SceneShell from "./SceneShell";
import { Arrow, Plane } from "./Plane";

/**
 * 본문 대응: #why — 크기 변경과 회전의 순서. 두 좌표 2배는 순서를 바꿔도 (−8,6).
 * 가로만 2배는 먼저 늘리면 (6,4)→(−4,6), 먼저 돌리면 (−4,3)→(−8,3)로 갈린다.
 */
type P = readonly [number, number];
const SCENES: readonly { label: string; summary: string; note: string; path: readonly P[]; mid: string; ghost: P | null }[] = [
  { label: "두 좌표 2배 → 돌리기", summary: "(3,4) → (6,8) → (−8,6)", path: [[3, 4], [6, 8], [-8, 6]], mid: "두 좌표 2배", ghost: null, note: "먼저 두 좌표를 두 배로 늘린 뒤 반시계로 1/4바퀴 돌렸습니다." },
  { label: "돌리기 → 두 좌표 2배", summary: "(3,4) → (−4,3) → (−8,6)", path: [[3, 4], [-4, 3], [-8, 6]], mid: "먼저 돌림", ghost: null, note: "순서를 바꿔도 같은 (−8,6)에 닿습니다. 두 좌표에 같은 배율을 곱했기 때문입니다." },
  { label: "가로만 2배 → 돌리기", summary: "(3,4) → (6,4) → (−4,6)", path: [[3, 4], [6, 4], [-4, 6]], mid: "가로만 2배", ghost: null, note: "이번에는 가로만 늘립니다. 늘린 뒤 돌리면 (−4,6)입니다." },
  { label: "돌리기 → 가로만 2배", summary: "(3,4) → (−4,3) → (−8,3)", path: [[3, 4], [-4, 3], [-8, 3]], mid: "먼저 돌림", ghost: [-4, 6], note: "먼저 돌리면 (−8,3)으로, 앞 장면의 (−4,6)과 다른 점입니다. 모든 크기 변경이 회전과 순서를 바꿔도 되는 것은 아닙니다." },
];

export default function ScaleOrderViz() {
  return (
    <SceneShell
      eyebrow="순서를 바꿔 보기"
      title="늘리기와 돌리기의 순서를 바꾸면 같은 점에 닿을까요"
      description="출발점은 모두 (3,4)이고, 돌리기는 반시계 1/4바퀴입니다. 화살표 두 개가 순서대로 일어난 두 동작입니다. 마지막 점이 도착 위치입니다."
      ariaLabel="크기 변경과 회전의 순서를 바꾼 네 경로"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const [start, mid, end] = scene.path;
        return (
          <Plane
            width={340}
            height={190}
            originX={170}
            originY={160}
            unit={17}
            xTicks={[-8, -4, 4, 8]}
            yTicks={[4, 8]}
            ariaLabel={`${scene.label}: ${scene.summary}`}
            render={(m) => (
              <g>
                {scene.ghost && (
                  <g>
                    <circle cx={m.x(scene.ghost[0])} cy={m.y(scene.ghost[1])} r={4} fill="#ffffff" stroke="#64748b" strokeWidth={1} />
                    <text x={m.x(scene.ghost[0]) + 8} y={m.y(scene.ghost[1]) - 2} fontSize={12} fill="#64748b">(−4,6)</text>
                  </g>
                )}
                <Arrow x1={m.x(start[0])} y1={m.y(start[1])} x2={m.x(mid[0])} y2={m.y(mid[1])} color="#94a3b8" />
                <Arrow x1={m.x(mid[0])} y1={m.y(mid[1])} x2={m.x(end[0])} y2={m.y(end[1])} color="#2563eb" />
                <circle cx={m.x(start[0])} cy={m.y(start[1])} r={3.5} fill="#64748b" />
                <text x={m.x(start[0]) + 6} y={m.y(start[1]) + 14} fontSize={12} fill="#64748b">(3,4)</text>
                <circle cx={m.x(mid[0])} cy={m.y(mid[1])} r={3.5} fill="#64748b" />
                <text x={m.x(mid[0]) + (mid[0] > 0 ? 7 : 0)} y={m.y(mid[1]) + (mid[0] > 0 ? 4 : 15)} textAnchor={mid[0] > 0 ? "start" : "middle"} fontSize={12} fill="#64748b">({mid[0] < 0 ? `−${-mid[0]}` : mid[0]},{mid[1]})</text>
                <circle cx={m.x(end[0])} cy={m.y(end[1])} r={5} fill="#2563eb" />
                <text x={m.x(end[0])} y={m.y(end[1]) - 9} textAnchor="middle" fontSize={13} fontWeight={700} fill="#2563eb">(−{-end[0]},{end[1]})</text>
              </g>
            )}
          />
        );
      }}
    />
  );
}
