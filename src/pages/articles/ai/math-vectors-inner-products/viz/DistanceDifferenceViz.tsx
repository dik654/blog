import { Arrow, Plane } from "./PlaneParts";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #norm — p=(1,2), q=(4,6), q−p=(3,4), 거리 5.
 * 마지막 장면의 R=5는 12절에 나오는 예시 값을 미리 빌린 그림이다.
 */
const SCENES = [
  { label: "두 점", summary: "p=(1,2), q=(4,6)", note: "거리를 재려는 두 점입니다. 둘 다 원점에서 떨어져 있어 p나 q의 노름만으로는 둘 사이 거리를 알 수 없습니다." },
  { label: "차이를 원점으로", summary: "q−p=(3,4) → 길이 5", note: "p에서 q로 가는 이동이 차이 q−p입니다. 시작점을 원점으로 옮기면 앞에서 잰 (3,4)와 같은 화살표라 노름 5가 곧 두 점 사이 거리입니다." },
  { label: "순서를 바꾸면", summary: "p−q=(−3,−4) → 길이 5", note: "q에서 p로 가면 화살표 방향은 반대가 되지만 길이는 그대로 5입니다. 그래서 거리는 어느 순서로 빼도 같습니다." },
  { label: "노름이 R 이하", summary: "원점에서 거리 R 안", note: "입력의 노름이 R 이하이면 모든 입력이 이 원 안이나 원 위에 있습니다. 그림의 R=5는 12절의 예시 값입니다(가정). (3,4)와 (−3,−4)는 노름이 5라 원 위에 놓입니다." },
] as const;

const P = { x: 1, y: 2 };
const Q = { x: 4, y: 6 };

export default function DistanceDifferenceViz() {
  return (
    <SceneShell
      eyebrow="두 점 사이 거리"
      title="두 점의 거리는 차이 벡터를 원점으로 옮겨 잰 길이입니다"
      description="모눈 한 칸은 두 축에서 같은 길이입니다. 파란 화살표는 원점에서 출발한 벡터입니다."
      ariaLabel="두 점의 차이 벡터와 노름, 그리고 노름 상한 R의 원"
      scenes={SCENES}
      render={(active) => (
        <div className="mx-auto w-full max-w-[255px] sm:max-w-[340px]">
        <Plane
          minX={-5}
          maxX={6}
          minY={-5}
          maxY={7}
          unit={18}
          label={`${SCENES[active].label}: ${SCENES[active].summary}`}
          render={(sx, sy) => (
            <>
              {active < 3 && (
                <>
                  <circle cx={sx(P.x)} cy={sy(P.y)} r={3.5} fill="#475569" />
                  <circle cx={sx(Q.x)} cy={sy(Q.y)} r={3.5} fill="#475569" />
                  <text x={sx(P.x) + 7} y={sy(P.y) + 14} fontSize={12} fill="#64748b">p=(1,2)</text>
                  <text x={sx(Q.x) - 7} y={sy(Q.y) - 7} textAnchor="end" fontSize={12} fill="#64748b">q=(4,6)</text>
                </>
              )}
              {active === 0 && <line x1={sx(P.x)} y1={sy(P.y)} x2={sx(Q.x)} y2={sy(Q.y)} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />}
              {active === 1 && (
                <>
                  <Arrow x1={sx(P.x)} y1={sy(P.y)} x2={sx(Q.x)} y2={sy(Q.y)} color="#d97706" />
                  <Arrow x1={sx(0)} y1={sy(0)} x2={sx(3)} y2={sy(4)} color="#2563eb" />
                  <text x={sx(3) + 7} y={sy(4) + 14} fontSize={12} fontWeight={700} fill="#2563eb">(3,4)</text>
                </>
              )}
              {active === 2 && (
                <>
                  <Arrow x1={sx(Q.x)} y1={sy(Q.y)} x2={sx(P.x)} y2={sy(P.y)} color="#d97706" />
                  <Arrow x1={sx(0)} y1={sy(0)} x2={sx(-3)} y2={sy(-4)} color="#2563eb" />
                  <text x={sx(-3) + 7} y={sy(-4) + 8} fontSize={12} fontWeight={700} fill="#2563eb">(−3,−4)</text>
                </>
              )}
              {active === 3 && (
                <>
                  <circle cx={sx(0)} cy={sy(0)} r={sx(5) - sx(0)} fill="#2563eb" fillOpacity={0.08} stroke="#2563eb" strokeWidth={1} />
                  <Arrow x1={sx(0)} y1={sy(0)} x2={sx(3)} y2={sy(4)} color="#2563eb" />
                  <Arrow x1={sx(0)} y1={sy(0)} x2={sx(-3)} y2={sy(-4)} color="#2563eb" />
                  <text x={sx(3) + 7} y={sy(4) - 2} fontSize={12} fontWeight={700} fill="#2563eb">(3,4)</text>
                  <text x={sx(-3) + 10} y={sy(-4) + 2} fontSize={12} fontWeight={700} fill="#2563eb">(−3,−4)</text>
                  <text x={sx(-2)} y={sy(2)} textAnchor="middle" fontSize={12} fill="#64748b">노름 ≤ R</text>
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
