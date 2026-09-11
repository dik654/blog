import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import CouplingViz from "./viz/CouplingViz";

export default function ReferenceCoupling() {
  return (
    <section id="reference-coupling" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">참조 조건에는 인물과 자세가 같이 들어 있습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          참조 이미지를 잠재 표현으로 인코딩해 조건에 이어 붙이는 방식이 있습니다. 출발점으로 쓰는 것이 아니라
          조건으로 쓰기 때문에 샘플링은 완전한 노이즈에서 시작하고, 그래도 인물이 유지됩니다.
        </p>

        <p className="leading-7">
          효과 자체는 분명합니다. 참조 없이 말로만 같은 인물을 그리게 한 대조군과 비교하면 얼굴 정면 기준
          0.845 대 0.284로 0.56 격차입니다. 양쪽 모두 회전 각도가 0도라 자세 교란이 없는 가장 깨끗한
          비교입니다.
        </p>

        <p className="leading-7">
          문제는 그 조건에 자세도 함께 들어 있다는 점입니다. 측면을 요구하면 머리는 60도까지 돌아가는데 몸은
          그대로입니다. 처음에는 눈으로 보고 "측면인데 정면처럼 보인다"고 적었는데, 실제 각도를 재 보니 머리만
          도는 것이었습니다.
        </p>

        <p className="leading-7">
          문구로 풀리는지 확인했습니다. 인물이 돈다는 표현을 카메라가 돈다는 표현으로 바꿔 봤는데 회전 각도가
          59.5도에서 59.9도로, 28.3도에서 28.0도로 움직였습니다. 측정 오차 수준입니다.
        </p>
      </div>

      <CouplingViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          결정적인 증거는 참조를 빼 보는 것이었습니다. 같은 프롬프트에서 참조 조건만 제거하자 몸이 실제로
          돌았습니다. 인물은 매번 달라지지만 자세는 요구한 대로 나옵니다. 몸을 붙잡고 있던 것이 참조 조건이라는
          사실이 여기서 확정됩니다.
        </p>

        <p className="leading-7">
          그래서 선택지가 갈립니다. 참조를 유지하면 인물은 지키지만 정면·사분의삼·준측면까지만 나오고, 참조를
          빼면 자세는 자유롭지만 매번 다른 사람이 됩니다. 둘 다 얻으려면 정체성을 잠재 조건이 아닌 다른 경로로
          넣어야 합니다.
        </p>

        <p className="leading-7">
          정체성 유사도의 판정 임계값은{" "}
          <Link to="/ai/generative-measurement-controls#threshold-choice">계측기 검증</Link>이 정한 값을
          씁니다. 이 절은 그 값으로 잰 결과만 다뤘습니다.
        </p>
      </div>

      <CitationBlock
        source="프로젝트 실측 — 참조 조건의 효과와 자세 결합 (2026-09-11, RTX 4090 48GB)"
        citeKey={1}
        href="https://github.com/dik654/blog"
      >
        참조 있음과 없음의 정체성이 얼굴 정면 0.845 대 0.284, 얼굴 사분의삼 0.644 대 0.327, 전신 사분의삼
        0.731 대 0.227이었습니다. 측면 요구 시 실측 회전각이 60도(머리)였고, 문구를 인물 회전에서 카메라
        회전으로 바꿔도 59.5도에서 59.9도, 28.3도에서 28.0도로 변화가 없었습니다. 참조 조건을 제거하면 몸이
        실제로 회전했습니다.
      </CitationBlock>
    </section>
  );
}
