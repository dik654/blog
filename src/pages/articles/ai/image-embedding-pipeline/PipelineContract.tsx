import { Link } from "react-router-dom";
import TermBreakdown from "@/components/articles/term-breakdown";
import ContractViz from "./viz/ContractViz";

export default function PipelineContract() {
  return (
    <section id="pipeline-contract" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">네 가지를 묶어야 색인을 다시 만들 시점이 정해집니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          앞의 결정들은 따로 기억할 것이 아니라 하나로 묶어 기록해야 합니다. 백본과 체크포인트, 전처리 설정,
          풀링 방식, 정규화 여부가 한 세트입니다. 이 중 하나라도 바뀌면 새 벡터는 기존 벡터와 같은 공간에 있지
          않고, 섞어 쓰면 검색이 조용히 망가집니다.
        </p>

        <p className="leading-7">
          "조용히"라는 말이 중요합니다. 차원이 같으면 코드는 오류 없이 돌아가고 검색 결과도 나옵니다. 다만 그
          결과가 무의미할 뿐입니다. 그래서 벡터를 저장할 때 이 네 가지를 지문처럼 함께 저장하고, 질의 경로가
          같은 지문을 쓰는지 확인하는 검사가 필요합니다.
        </p>

        <p className="leading-7">
          부분 재색인이 가능한지도 이 지문으로 정해집니다. 전처리만 바뀌었다면 원본 이미지가 남아 있는 한 다시
          계산하면 됩니다. 백본이 바뀌면 전량 재계산이고, 그동안 두 벌의 색인을 동시에 운영할지 아니면 중단할지를
          미리 정해 둬야 합니다.
        </p>
      </div>

      <TermBreakdown
        title="벡터와 함께 저장해야 하는 것"
        description="이 네 항목이 같아야 두 벡터를 같은 공간에서 비교할 수 있습니다."
        items={[
          {
            term: "백본 식별자",
            description: "모델 이름만으로는 부족하고 체크포인트 버전까지 포함해야 합니다.",
            example: "같은 이름이라도 재학습된 가중치가 올라오면 다른 공간입니다.",
            boundary: "양자화된 가중치로 바꾼 경우도 값이 달라지므로 별도 표기가 필요합니다.",
          },
          {
            term: "전처리 설정",
            description: "목표 크기, 자르기 방식, 보간 방식, 정규화 상수, 그리고 연산 순서입니다.",
            example: "224 중앙 자르기와 256 여백 채우기는 다른 설정입니다.",
            boundary: "라이브러리 버전 차이로 보간 결과가 달라질 수 있어 버전도 함께 남기는 편이 안전합니다.",
          },
          {
            term: "풀링 방식",
            description: "요약 토큰인지 패치 평균인지, 평균이면 앞쪽 토큰을 몇 개 잘랐는지입니다.",
            example: "보조 토큰 4개를 자른 평균과 자르지 않은 평균은 다른 벡터입니다.",
            boundary: "패치 벡터를 그대로 색인하는 경우에는 사진과 벡터의 대응 관계도 함께 기록해야 합니다.",
          },
          {
            term: "정규화 여부",
            description: "L2 정규화를 했는지, 그리고 거리 함수로 무엇을 쓰는지입니다.",
            example: "정규화한 벡터에 유클리드 거리를 쓰면 코사인과 순위가 같지만 값의 해석이 달라집니다.",
            boundary: "색인 구조가 특정 거리 함수를 전제하는 경우가 있어 색인 설정과 함께 봐야 합니다.",
          },
        ]}
      />

      <ContractViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          임베딩 서비스 일반의 운영 계약과 색인 생성 기록은{" "}
          <Link to="/ai/embedding-serving-contract">임베딩 서빙 계약</Link>이 소유합니다. 이 절이 더하는 것은
          이미지에만 있는 두 항목, 곧 전처리 설정과 풀링 방식이 그 계약에 반드시 들어가야 한다는 점입니다.
        </p>

        <p className="leading-7">
          백본을 바꾸는 판단 자체는 품질과 비용을 함께 놓고 해야 합니다. 그 비교 기준은{" "}
          <Link to="/ai/image-backbone-scaling#budget-comparison">백본 예산 비교</Link>에 있고, 여기서는 바꾸기로
          했을 때 색인 쪽에서 무엇이 일어나는지만 다뤘습니다.
        </p>
      </div>
    </section>
  );
}
