import PlotAxes from "./PlotAxes";
import { makeScale } from "./plotMath";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #minimizer — 0≤x≤1, 0≤y≤1, x+y≤1 (글의 가정).
 * (1,1)은 좌표별 범위 안이지만 1+1=2>1 이다.
 */
const scale = makeScale([0, 1.25], [0, 1.25], { left: 26, right: 212, top: 22, bottom: 208 });
const ALLOWED = "#2563eb";
const OUT = "#dc2626";

const SCENES = [
  { label: "좌표별 범위", summary: "(1, 1) 통과", note: "x 와 y 를 하나씩 보면 허용 영역은 정사각형입니다. 두 조건만 있으면 (1, 1)은 모퉁이에 있는 허용된 점입니다." },
  { label: "합 규칙 추가", summary: "1 + 1 = 2 > 1", note: "x+y≤1 을 더하면 허용 영역은 대각선 아래 삼각형으로 줄어듭니다. (1, 1)은 합 규칙을 어기므로 밖으로 나갑니다." },
  { label: "좌표별로 잘라 보면", summary: "(1, 1) → (1, 1)", note: "각 좌표를 [0, 1]로 잘라도 (1, 1)은 그대로이고 여전히 삼각형 밖입니다. 그래서 구간 끝으로 자르는 계산은 앞의 1차원 예에서 통했을 뿐, 임의의 문제에 쓰는 규칙은 아닙니다." },
] as const;

export default function CoordinateClipViz() {
  return (
    <SceneShell
      eyebrow="1차원을 넘어서"
      title="좌표별로 범위 안이어도 합 규칙을 어길 수 있습니다"
      description="가로가 x, 세로가 y 인 평면에서 파란 영역이 허용된 선택입니다. 이 제약은 글이 반례로 둔 가정입니다."
      ariaLabel="좌표별 범위의 정사각형과 합 규칙이 더해진 삼각형, 그리고 점 (1,1)"
      scenes={SCENES}
      render={(active) => {
        const corner = `${scale.sx(0)},${scale.sy(0)} ${scale.sx(1)},${scale.sy(0)} ${scale.sx(1)},${scale.sy(1)} ${scale.sx(0)},${scale.sy(1)}`;
        const triangle = `${scale.sx(0)},${scale.sy(0)} ${scale.sx(1)},${scale.sy(0)} ${scale.sx(0)},${scale.sy(1)}`;
        const valid = active === 0;
        return (
          <svg viewBox="0 0 360 232" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <PlotAxes scale={scale} xTicks={[0, 1]} yTicks={[1]} yLabel="y" />
            <polygon points={valid ? corner : triangle} fill={ALLOWED} fillOpacity={0.2} stroke={ALLOWED} strokeWidth={1} />
            {!valid && (
              <>
                <polygon points={corner} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
                <line x1={scale.sx(0)} y1={scale.sy(1)} x2={scale.sx(1)} y2={scale.sy(0)} stroke={ALLOWED} strokeWidth={1.25} />
              </>
            )}
            <circle cx={scale.sx(1)} cy={scale.sy(1)} r={5} fill={valid ? ALLOWED : "none"} stroke={valid ? ALLOWED : OUT} strokeWidth={1.25} />
            <text x={scale.sx(1) + 9} y={scale.sy(1) + 4} fontSize={12} fontWeight={700} fill="currentColor">(1, 1)</text>
            <g fontSize={12} fill="currentColor">
              <text x={250} y={70} fontWeight={700}>x ≤ 1 : 예</text>
              <text x={250} y={92} fontWeight={700}>y ≤ 1 : 예</text>
              <text x={250} y={114} fontWeight={700} opacity={valid ? 0.35 : 1}>x+y ≤ 1 : {valid ? "(아직 없음)" : "아니요"}</text>
              {active === 2 && (
                <>
                  <text x={250} y={150}>자른 뒤에도</text>
                  <text x={250} y={168}>합은 2</text>
                </>
              )}
            </g>
          </svg>
        );
      }}
    />
  );
}
