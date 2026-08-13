import ExplainedFormula from "@/components/ui/explained-formula";
import UnitCircleViz from "./viz/UnitCircleViz";

export default function UnitCircle() {
  return (
    <section id="unit-circle" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Sine과 cosine은 회전한 점의 세로·가로 좌표다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          반지름이 1인 원을 단위원이라고 합니다. 양의 가로축에서 시작해 반시계 방향으로 <code>θ</code>만큼 회전한 점의 가로 좌표를 <code>cos θ</code>, 세로 좌표를 <code>sin θ</code>라고 정의합니다. 이 정의를 쓰면 직각삼각형이 만들어지지 않는 90° 이후의 각도와 음의 각도도 같은 규칙으로 다룰 수 있습니다.
        </p>
      </div>
      <ExplainedFormula
        question="한 바퀴를 도는 점의 위치를 두 좌표로 어떻게 나타낼까?"
        idea={<>단위원 위의 점은 원점에서 거리가 항상 1입니다. 회전각 θ에서 가로축으로 내린 좌표가 cos θ, 세로축 좌표가 sin θ이므로 두 좌표의 제곱합은 언제나 1입니다.</>}
        formula={String.raw`u(\theta)=(\cos\theta,\sin\theta),\qquad \cos^2\theta+\sin^2\theta=1`}
        terms={[
          { symbol: "u(\theta)", name: "unit-circle point", description: "각도 θ에 놓인 2차원 좌표입니다." },
          { symbol: "\cos\theta", name: "horizontal coordinate", description: "회전한 점의 가로 성분입니다." },
          { symbol: "\sin\theta", name: "vertical coordinate", description: "회전한 점의 세로 성분입니다." },
        ]}
        assumptions={["각도 θ는 양의 가로축에서 반시계 방향을 양수로 하며 radian으로 잽니다."]}
        interpretation="Sine과 cosine은 별개의 파형 두 개가 아니라 같은 원운동을 서로 직각인 두 축에서 본 좌표입니다. 그래서 같은 frequency와 90°의 phase 차이를 가집니다."
      />
      <UnitCircleViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          점이 일정한 속도로 원을 반복해서 돌면 가로 좌표와 세로 좌표도 일정한 주기로 반복됩니다. 신호에서 말하는 amplitude는 원의 반지름에, frequency는 한 시간 동안 도는 횟수에, phase는 시작한 각도에 대응합니다. 이 세 값을 분리하면 모양이 같은 파동도 크기·빠르기·시작 위치가 어떻게 다른지 구분할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
