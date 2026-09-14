import { Link } from "react-router-dom";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import EvaluationViz from "./viz/EvaluationViz";

export default function Evaluation() {
  return (
    <section id="evaluation" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">시각적으로 비슷한 것이 정답은 아닙니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          이미지 검색 평가에서 가장 자주 어긋나는 지점은 정답 정의입니다. 사람이 보기에 비슷한 사진과 사용자가
          찾던 사진은 다를 수 있습니다. 같은 제품의 다른 각도 사진을 찾는 과제에서 색만 비슷한 다른 제품이
          올라오면, 시각적으로는 가깝지만 과제 기준으로는 오답입니다.
        </p>

        <p className="leading-7">
          정답이 하나가 아니라는 점도 다릅니다. 한 질의에 맞는 사진이 수십 장일 수 있고, 그중 무엇이 먼저 와야
          하는지는 과제가 정합니다. 이 구조를 전제한 지표를 써야 하며, 정답이 하나라고 가정한 지표를 그대로
          가져오면 좋은 시스템이 낮게 나옵니다.
        </p>

        <p className="leading-7">
          평가 집합을 만들 때 조심할 것은 근거 누출입니다. 같은 촬영 세션에서 나온 사진들을 질의와 정답으로
          나눠 넣으면, 모델이 대상이 아니라 배경이나 조명을 근거로 맞힐 수 있습니다. 점수는 높게 나오는데 실제
          사용에서는 재현되지 않습니다.
        </p>

        <p className="leading-7">
          그래서 최소한의 구성은 세 가지입니다. 과제 기준으로 정의한 정답, 촬영 세션이나 출처가 겹치지 않게
          나눈 분할, 그리고 앞 절에서 만든 변형 민감도 점검입니다. 앞의 둘이 무엇을 재는지 정하고, 마지막이
          점수가 의미가 아닌 단서에서 나왔는지 걸러 줍니다.
        </p>
      </div>

      <EvaluationViz />

      <div className="mt-6">
        <ProgressiveDetail
          title="오프라인 점수가 올랐는데 체감이 그대로인 경우"
          preview="평가 집합의 질의 분포가 실제 사용과 다르면 흔히 일어납니다. 상위 몇 개만 보는 사용자와 전체 순위를 보는 지표의 간극도 원인입니다."
        >
          <p className="leading-7">
            평가 질의를 만들 때 흔히 쓰는 방법은 색인에서 임의로 뽑는 것입니다. 그런데 실제 질의는 특정 범주에
            몰려 있는 경우가 많습니다. 그러면 개선이 실제 사용자가 거의 보내지 않는 질의에서 일어났을 수 있습니다.
          </p>
          <p className="leading-7">
            지표의 절단 위치도 봅니다. 사용자가 상위 5개만 본다면 그 범위의 순위 변화가 중요한데, 전체 순위를
            반영하는 지표는 하위권 개선에도 반응합니다. 실제 사용 화면에 맞춰 절단을 정하는 편이 간극을 줄입니다.
          </p>
          <p className="leading-7">
            임베딩 품질을 재는 지표 자체의 선택과 다중 정답 처리 방식은{" "}
            <Link to="/cs/ai/embedding-evaluation">임베딩 평가</Link>가 소유합니다. 이 절은 그 지표를 이미지에
            적용할 때 정답 정의와 분할에서 생기는 함정만 다뤘습니다.
          </p>
        </ProgressiveDetail>
      </div>

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          정리하면 이 글의 결론은 하나입니다. 이미지 임베딩의 품질은 백본 이름이 아니라 그 앞뒤의 계약으로
          결정되고, 그 계약을 기록해 두지 않으면 문제가 생겼을 때 어디를 고쳐야 하는지 알 수 없습니다. 다음
          글에서는 이 계약을 어떤 백본으로 채울지 고르는 기준을 다룹니다.
        </p>
      </div>
    </section>
  );
}
