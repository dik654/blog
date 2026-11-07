import { Arrow, Plane } from "./PlaneParts";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — (3,4), (−3,−4), (6,8)의 길이 5, 5, 10.
 * 방향을 돌리는 변화와 크기만 늘리는 변화를 한 평면에서 구별한다.
 */
const VECTORS = [
  { x: 3, y: 4, name: "(3,4)", dx: 7, dy: 4, anchor: "start" },
  { x: -3, y: -4, name: "(−3,−4)", dx: 7, dy: 8, anchor: "start" },
  { x: 6, y: 8, name: "(6,8)", dx: -8, dy: 4, anchor: "end" },
] as const;

const SCENES = [
  { label: "원래 이동", summary: "√(3²+4²) = 5", note: "오른쪽 3, 위 4로 간 이동입니다. 길이는 5이고 이 숫자만으로는 어느 쪽으로 갔는지 알 수 없습니다." },
  { label: "방향을 반대로", summary: "√((−3)²+(−4)²) = 5", note: "화살표가 정반대를 가리켜도 제곱하면 부호가 사라져 길이는 그대로 5입니다. 방향이 바뀐 일은 최종 답에 남지 않습니다." },
  { label: "모든 이동량을 두 배로", summary: "√(6²+8²) = 10", note: "가리키는 방향은 (3,4)와 같은 직선 위에 그대로 있고 길이만 10으로 늘어납니다. 방향을 돌리는 변화와는 다른 변화입니다." },
] as const;

export default function DirectionLengthViz() {
  return (
    <SceneShell
      eyebrow="방향과 크기"
      title="길이 숫자는 방향이 바뀐 것을 알아채지 못합니다"
      description="모눈 한 칸은 두 축에서 같은 길이입니다. 파랗게 칠한 화살표가 지금 보는 이동입니다."
      ariaLabel="같은 평면에 놓은 세 이동의 방향과 길이 비교"
      scenes={SCENES}
      render={(active) => (
        <div className="mx-auto w-full max-w-[285px] sm:max-w-[340px]">
        <Plane
          minX={-5}
          maxX={8}
          minY={-5}
          maxY={9}
          unit={18}
          label={`${SCENES[active].label}: ${SCENES[active].summary}`}
          render={(sx, sy) =>
            VECTORS.map((vector, index) => {
              const on = index === active;
              return (
                <g key={vector.name}>
                  <Arrow x1={sx(0)} y1={sy(0)} x2={sx(vector.x)} y2={sy(vector.y)} color={on ? "#2563eb" : "#94a3b8"} opacity={on ? 1 : 0.7} />
                  <text x={sx(vector.x) + vector.dx} y={sy(vector.y) + vector.dy} textAnchor={vector.anchor} fontSize={12} fontWeight={on ? 700 : 400} fill={on ? "#2563eb" : "#64748b"}>
                    {vector.name}
                  </text>
                </g>
              );
            })
          }
        />
        </div>
      )}
    />
  );
}
