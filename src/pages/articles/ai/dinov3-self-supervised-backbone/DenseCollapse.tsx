import { Link } from "react-router-dom";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import CollapseViz from "./viz/CollapseViz";

export default function DenseCollapse() {
  return (
    <section id="dense-collapse" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">오래 학습할수록 패치 사이 구별이 흐려집니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          앞 절의 두 목표를 오래 돌리면 이미지 한 장을 요약하는 능력은 계속 좋아지는데, 패치마다 다른 정보를 담는
          능력은 어느 시점부터 나빠집니다. 같은 물체 위의 패치와 배경 위의 패치가 점점 비슷한 벡터를 갖게 되고,
          그 위에 얹은 분할이나 깊이 head의 성능이 함께 떨어집니다.
        </p>

        <p className="leading-7">
          원인은 두 목표가 요구하는 방향이 다르다는 데 있습니다. 이미지 수준 목표는 크롭이 달라도 같은 답을 내라고
          밀어붙입니다. 좁게 자른 장면과 넓게 자른 장면이 같은 분포를 내려면 위치에 따라 달라지는 성분은 지워지는
          쪽이 유리합니다. 패치 수준 목표는 반대로 자리마다 다른 답을 요구합니다.
        </p>

        <p className="leading-7">
          모델이 작고 학습이 짧으면 이 긴장은 잘 드러나지 않습니다. 용량이 부족해 둘 다 적당히 맞추는 지점에
          머물기 때문입니다. 모델과 데이터를 함께 키우면 이미지 수준 목표를 더 낮출 여지가 생기고, 그 여지를
          패치 개별성을 희생해 채우는 해가 나타납니다.
        </p>

        <p className="leading-7">
          이 현상을 어떻게 볼 수 있는지가 다음 절의 설계로 이어집니다. 패치 벡터를 하나씩 들여다보는 대신 같은
          이미지 안 패치들끼리의 유사도 행렬을 그려 보면, 초반에는 물체 경계를 따라 블록 구조가 보이다가 학습이
          길어지면 그 구조가 평평해집니다. 무너지는 대상이 값이 아니라 관계라는 뜻입니다.
        </p>
      </div>

      <CollapseViz />

      <div className="mt-6">
        <ProgressiveDetail
          title="왜 손실값만 보고는 이 붕괴를 알 수 없나요"
          preview="학습 손실은 계속 내려갑니다. 무너지는 것은 손실에 직접 들어가지 않는 패치 사이의 관계이고, 그래서 dense 과제로 따로 재야 보입니다."
        >
          <p className="leading-7">
            사전학습 손실 세 항 중 어느 것도 "패치들끼리 서로 얼마나 다른가"를 직접 재지 않습니다. 패치 수준 목표는
            가려진 자리 각각을 teacher와 맞출 뿐이고, teacher도 같은 방향으로 함께 흘러가면 둘의 차이는 작게
            유지됩니다. 손실은 내려가는데 표현은 평평해질 수 있습니다.
          </p>
          <p className="leading-7">
            그래서 확인은 downstream으로 합니다. backbone을 얼린 채 선형 분할 head만 붙여 재면 어느 시점부터
            점수가 떨어지기 시작합니다. 이 평가 방식 자체가 뒤에서 다룰 frozen 평가 프로토콜입니다.
          </p>
          <p className="leading-7">
            보고된 붕괴는 DINOv3 기술 보고서의 자기보고 관찰이며 학습 규모와 일정이 명시된 조건에서의 결과입니다.
            모든 자기지도 학습이 같은 시점에 같은 방식으로 무너진다는 일반 법칙으로 읽으면 안 됩니다. 표현이 한
            점으로 모이는 다른 종류의 붕괴는{" "}
            <Link to="/cs/ai/contrastive-learning#pair-contract">대조학습</Link>에서 다루는 문제와 구분해야 합니다.
          </p>
        </ProgressiveDetail>
      </div>
    </section>
  );
}
