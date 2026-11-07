import { Arrow, Plane } from "./PlaneParts";
import SceneShell from "./SceneShell";

/** 본문 대응: #vectors — x=(3,4), y=(−1,2), x+y=(2,6). */
const SCENES = [
  { label: "두 이동", summary: "x=(3,4), y=(−1,2)", note: "두 벡터를 같은 출발점에서 그렸습니다. y는 왼쪽으로 1, 위로 2 가는 이동입니다." },
  { label: "차례로 이어 가기", summary: "(3,4)에서 y만큼 더", note: "x로 도착한 곳에서 y만큼 더 갑니다. y의 시작점만 옮겼을 뿐 이동량은 그대로 (−1,2)입니다." },
  { label: "합의 벡터", summary: "(3−1, 4+2) = (2,6)", note: "출발점에서 최종 도착점으로 곧장 그은 화살표가 x+y입니다. 첫 좌표끼리, 둘째 좌표끼리 더한 결과와 같습니다. 두 벡터의 차원과 각 좌표의 의미가 같을 때만 이 해석이 성립합니다." },
] as const;

export default function VectorAdditionViz() {
  return (
    <SceneShell
      eyebrow="벡터의 덧셈"
      title="좌표끼리 더하면 두 이동을 차례로 간 도착점이 나옵니다"
      description="모눈 한 칸은 두 축에서 같은 길이입니다. 좌표를 가로·세로 이동량으로 읽은 그림입니다."
      ariaLabel="x와 y를 이어 x 더하기 y를 만드는 과정"
      scenes={SCENES}
      render={(active) => (
        <div className="mx-auto w-full max-w-[245px] sm:max-w-[300px]">
        <Plane
          minX={-2}
          maxX={5}
          minY={0}
          maxY={7}
          unit={28}
          label={`${SCENES[active].label}: ${SCENES[active].summary}`}
          render={(sx, sy) => (
            <>
              <Arrow x1={sx(0)} y1={sy(0)} x2={sx(3)} y2={sy(4)} color={active === 2 ? "#94a3b8" : "#2563eb"} />
              <text x={sx(3) + 7} y={sy(4) + 12} fontSize={12} fontWeight={700} fill={active === 2 ? "#64748b" : "#2563eb"}>x=(3,4)</text>
              {active === 0 ? (
                <>
                  <Arrow x1={sx(0)} y1={sy(0)} x2={sx(-1)} y2={sy(2)} color="#d97706" />
                  <text x={sx(-1) - 38} y={sy(2) - 7} fontSize={12} fontWeight={700} fill="#d97706">y=(−1,2)</text>
                </>
              ) : (
                <>
                  <Arrow x1={sx(0)} y1={sy(0)} x2={sx(-1)} y2={sy(2)} color="#94a3b8" dashed opacity={0.6} />
                  <Arrow x1={sx(3)} y1={sy(4)} x2={sx(2)} y2={sy(6)} color={active === 2 ? "#94a3b8" : "#d97706"} />
                  <text x={sx(3) - 2} y={sy(5) - 2} fontSize={12} fontWeight={700} fill={active === 2 ? "#64748b" : "#d97706"}>y</text>
                </>
              )}
              {active === 2 && (
                <>
                  <Arrow x1={sx(0)} y1={sy(0)} x2={sx(2)} y2={sy(6)} color="#2563eb" />
                  <text x={sx(2) + 8} y={sy(6) - 4} fontSize={12} fontWeight={700} fill="#2563eb">x+y=(2,6)</text>
                </>
              )}
            </>
          )}
        />
        </div>
      )}
    />
  );
}
