import { Link } from "react-router-dom";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import GateViz from "./viz/GateViz";

export default function DecisionGate() {
  return (
    <section id="decision-gate" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">판단 순서를 고정하면 논쟁이 줄어듭니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          지금까지의 내용을 순서로 묶으면 이렇습니다. 질의 형태와 출력 형태를 먼저 적고, 그에 맞는 계열로
          후보를 좁히고, 같은 조건에서 짧게 재고, 교체 비용을 더해 결정합니다. 이 순서를 지키면 "어느 모델이
          더 좋은가"라는 답 없는 논쟁을 피할 수 있습니다.
        </p>

        <p className="leading-7">
          순서를 뒤집으면 흔한 함정에 빠집니다. 모델부터 고르고 과제를 맞추면 표현이 요구를 못 채울 때 미세조정
          외에 방법이 없어집니다. 점수표부터 보면 그 점수를 만든 평가 조건이 내 조건과 다르다는 사실이 가려집니다.
        </p>

        <p className="leading-7">
          결정을 기록하는 것도 순서의 일부입니다. 왜 이 계열을 골랐고 어떤 숫자를 근거로 삼았는지 남겨 두면,
          나중에 교체를 검토할 때 같은 실측을 반복해 비교할 수 있습니다. 근거 없이 바꾼 선택은 다음에 또
          바꾸게 됩니다.
        </p>
      </div>

      <GateViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          마지막으로 이 글이 주장하지 않는 것을 적어 둡니다. 계열별 강점은 각 논문이 보고한 학습 목표와 평가
          조건에서 나온 경향이고, 특정 두 모델의 우열을 정한 값이 아닙니다. 도메인이 학습 분포에서 멀면 경향
          자체가 뒤집힐 수 있으며, 그 경우 답은 표가 아니라 앞 절의 실측에 있습니다.
        </p>
      </div>

      <div className="mt-6">
        <ProgressiveDetail
          title="흔히 하는 세 가지 실수"
          preview="점수표를 그대로 옮기기, 여러 백본 벡터를 이어 붙이기, 미세조정 결과로 표현 품질을 판단하기입니다."
        >
          <p className="leading-7">
            공개 점수를 그대로 옮기는 것이 첫 번째입니다. 그 점수는 해당 평가 집합의 정답 정의와 전처리, 프롬프트
            설정 위에서 나온 값입니다. 내 데이터로 같은 순위가 재현되는지는 별개 문제입니다.
          </p>
          <p className="leading-7">
            여러 백본의 벡터를 이어 붙이는 것이 두 번째입니다. 차원이 늘고 거리 계산에서 스케일이 큰 쪽이 지배하기
            쉬우며, 각 부분의 정규화를 어떻게 맞출지가 또 다른 조정 대상이 됩니다. 얻는 것보다 관리 비용이 큰
            경우가 많습니다.
          </p>
          <p className="leading-7">
            미세조정 결과로 표현 품질을 판단하는 것이 세 번째입니다. backbone까지 학습하면 그 결과는 표현이 아니라
            초기값의 유용성에 대한 주장이 됩니다. 두 주장은 다르며, 얼린 평가와 함께 보고해야 의미가 있습니다.
            이 구분은 <Link to="/cs/ai/dinov3-self-supervised-backbone#use-boundary">얼린 backbone 평가</Link>에서
            정리했습니다.
          </p>
        </ProgressiveDetail>
      </div>
    </section>
  );
}
