import PlotAxes from "./PlotAxes";
import { curvePath, makeScale } from "./plotMath";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — f₁(x)=−x≤0, f₂(x)=x−2≤0. 둘 다 0 이하인 x 가 [0,2].
 * f₁(2)=−2, f₂(2)=0, f₂(3)=1 은 글의 값이다.
 */
const f1 = (x: number) => -x;
const f2 = (x: number) => x - 2;
const scale = makeScale([-1, 4], [-3.5, 2], { left: 26, right: 340, top: 22, bottom: 212 });
const F1 = "#d97706";
const F2 = "#0284c7";
const BOTH = "#2563eb";

const SCENES = [
  { label: "f₁ ≤ 0", summary: "−x ≤ 0 ⇔ x ≥ 0", note: "교재 형식은 제약의 오른쪽을 0 으로 맞춥니다. x≥0 은 f₁(x)=−x 가 0 이하라는 말과 같습니다. 선이 가로축 위로 올라가지 않는 구간이 허용되는 쪽입니다." },
  { label: "f₂ ≤ 0", summary: "x − 2 ≤ 0 ⇔ x ≤ 2", note: "x≤2 도 같은 방식으로 f₂(x)=x−2 가 0 이하라는 말이 됩니다. 이번에는 왼쪽이 허용됩니다." },
  { label: "둘 다", summary: "겹치는 구간 [0, 2]", note: "두 선이 모두 가로축 위로 올라가지 않는 구간이 가능 집합입니다. 표준 형태로 옮겨도 앞에서 쓴 [0, 2]가 그대로 나옵니다." },
  { label: "두 점 확인", summary: "f₂(2)=0 통과 · f₂(3)=1 위반", note: "x=2 는 f₁=−2, f₂=0 이라 둘 다 0 이하입니다. x=3 은 f₂=1 로 0 보다 커서 상한 제약을 어깁니다. 점수와 무관하게 이 두 값만으로 허용 여부가 정해집니다." },
] as const;

function Band({ from, to, color, y }: { from: number; to: number; color: string; y: number }) {
  return <rect x={scale.sx(from)} y={y} width={scale.sx(to) - scale.sx(from)} height={6} fill={color} fillOpacity={0.7} />;
}

export default function StandardFormViz() {
  return (
    <SceneShell
      eyebrow="표준 형태 읽기"
      title="두 제약 함수가 모두 0 이하인 구간이 가능 집합입니다"
      description="주황이 f₁(x)=−x, 하늘색이 f₂(x)=x−2 입니다. 세로축은 점수가 아니라 제약 함수의 값이고, 가운데 가로선이 0 입니다."
      ariaLabel="제약 함수 f1, f2 의 부호로 읽는 가능 집합 [0,2]"
      scenes={SCENES}
      render={(active) => {
        const show1 = active !== 1;
        const show2 = active !== 0;
        return (
          <svg viewBox="0 0 360 232" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <PlotAxes scale={scale} xTicks={[0, 2, 3]} yTicks={[-2, 1]} yLabel="제약 함수 값" xAxisAt={0} />
            <path d={curvePath(f1, -1, 3.5, scale)} fill="none" stroke={F1} strokeWidth={1} opacity={show1 ? 1 : 0.2} />
            <path d={curvePath(f2, -1, 4, scale)} fill="none" stroke={F2} strokeWidth={1} opacity={show2 ? 1 : 0.2} />
            {active === 0 && <Band from={0} to={4} color={F1} y={scale.sy(0) - 8} />}
            {active === 1 && <Band from={-1} to={2} color={F2} y={scale.sy(0) - 8} />}
            {active >= 2 && <Band from={0} to={2} color={BOTH} y={scale.sy(0) - 8} />}
            {active === 3 && (
              <g>
                <circle cx={scale.sx(2)} cy={scale.sy(0)} r={4} fill={F2} />
                <circle cx={scale.sx(2)} cy={scale.sy(-2)} r={4} fill={F1} />
                <text x={scale.sx(2) + 8} y={scale.sy(-2) + 4} fontSize={12} fill="currentColor">f₁(2)=−2</text>
                <circle cx={scale.sx(3)} cy={scale.sy(1)} r={4} fill="none" stroke={F2} strokeWidth={1.25} />
                <text x={scale.sx(3) + 8} y={scale.sy(1) + 4} fontSize={12} fontWeight={700} fill="currentColor">f₂(3)=1</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
