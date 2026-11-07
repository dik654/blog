import SceneShell from "./SceneShell";
import { Arrow, Plane } from "./Plane";

/**
 * 본문 대응: #picture — 색 점과 두 축으로 내린 가는 선. 가로 숫자만 남기면 (3,4)와 (3,−4)를 구별하지 못하고,
 * 다음 위치는 규칙 (a,b)→(−b,a)에 따라 (−4,3)과 (4,3)으로 갈린다.
 */
const SCENES = [
  { label: "두 숫자로 읽습니다", summary: "(3,4) · 길이 5", note: "색 점이 현재 위치입니다. 점에서 가로축과 세로축으로 내린 가는 선이 가로 3과 세로 4입니다. 두 축은 같은 배율입니다." },
  { label: "가로 숫자만 남기면", summary: "(3,4)도 (3,−4)도 가로 3", note: "위의 점과 아래의 점이 가로축에서는 같은 자리에 닿습니다. 3이라는 숫자 하나로는 어느 쪽인지 구별하지 못합니다." },
  { label: "다음 위치는 갈립니다", summary: "(−4,3)과 (4,3)", note: "반시계 1/4바퀴 규칙으로 위의 점은 (−4,3), 아래의 점은 (4,3)으로 갑니다. 세로 숫자까지 있어야 어느 방향인지 압니다." },
] as const;

const BLUE = "#2563eb";
const AMBER = "#d97706";

export default function ShadowReadViz() {
  return (
    <SceneShell
      eyebrow="두 축의 그림자"
      title="가로 숫자 하나로는 위아래를 구별하지 못합니다"
      description="파란 점이 출발점 (3,4)이고, 노란 점은 가로 위치만 같은 (3,−4)입니다. 원은 원점에서 길이 5인 자리입니다."
      ariaLabel="가로 좌표가 같은 두 점과 다음 위치"
      scenes={SCENES}
      render={(active) => (
        <Plane
          width={300}
          height={270}
          originX={150}
          originY={135}
          unit={22}
          xTicks={[-4, -2, 2, 4]}
          yTicks={[-4, -2, 2, 4]}
          ariaLabel={`${SCENES[active].label}: ${SCENES[active].summary}`}
          maxWidth="max-w-[270px] sm:max-w-[420px]"
          render={(m) => (
            <g>
              <circle cx={m.x(0)} cy={m.y(0)} r={5 * m.unit} fill="none" stroke="#94a3b8" strokeWidth={1} strokeOpacity={0.5} />
              <line x1={m.x(3)} x2={m.x(3)} y1={m.y(0)} y2={m.y(4)} stroke={BLUE} strokeWidth={1} strokeDasharray="3 3" />
              {active === 0 && <line x1={m.x(0)} x2={m.x(3)} y1={m.y(4)} y2={m.y(4)} stroke={BLUE} strokeWidth={1} strokeDasharray="3 3" />}
              <Arrow x1={m.x(0)} y1={m.y(0)} x2={m.x(3)} y2={m.y(4)} color={BLUE} opacity={active === 0 ? 1 : 0.35} />
              <circle cx={m.x(3)} cy={m.y(4)} r={5} fill={BLUE} />
              <text x={m.x(3) + 8} y={m.y(4) - 6} fontSize={12} fontWeight={700} fill={BLUE}>(3,4)</text>
              {active >= 1 && (
                <g>
                  <line x1={m.x(3)} x2={m.x(3)} y1={m.y(0)} y2={m.y(-4)} stroke={AMBER} strokeWidth={1} strokeDasharray="3 3" />
                  <circle cx={m.x(3)} cy={m.y(-4)} r={5} fill={AMBER} />
                  <text x={m.x(3) + 8} y={m.y(-4) + 14} fontSize={12} fontWeight={700} fill={AMBER}>(3,−4)</text>
                  <circle cx={m.x(3)} cy={m.y(0)} r={4} fill="#ffffff" stroke="#64748b" strokeWidth={1} />
                </g>
              )}
              {active === 2 && (
                <g>
                  <path d={`M${m.x(3)} ${m.y(4)}A${5 * m.unit} ${5 * m.unit} 0 0 0 ${m.x(-4)} ${m.y(3)}`} fill="none" stroke={BLUE} strokeWidth={1.25} />
                  <circle cx={m.x(-4)} cy={m.y(3)} r={4} fill={BLUE} />
                  <text x={m.x(-4) - 8} y={m.y(3) - 2} textAnchor="end" fontSize={12} fontWeight={700} fill={BLUE}>(−4,3)</text>
                  <path d={`M${m.x(3)} ${m.y(-4)}A${5 * m.unit} ${5 * m.unit} 0 0 0 ${m.x(4)} ${m.y(3)}`} fill="none" stroke={AMBER} strokeWidth={1.25} />
                  <circle cx={m.x(4)} cy={m.y(3)} r={4} fill={AMBER} />
                  <text x={m.x(4) + 8} y={m.y(3) + 4} fontSize={12} fontWeight={700} fill={AMBER}>(4,3)</text>
                </g>
              )}
            </g>
          )}
        />
      )}
    />
  );
}
