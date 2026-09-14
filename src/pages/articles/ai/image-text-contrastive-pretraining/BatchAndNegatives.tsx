import { Link } from "react-router-dom";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import BatchViz from "./viz/BatchViz";

export default function BatchAndNegatives() {
  return (
    <section id="batch-and-negatives" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">배치 크기가 곧 음성 쌍의 개수입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          두 손실 모두 배치 안의 다른 쌍을 음성으로 씁니다. 그래서 배치를 키우면 한 양성마다 비교할 대상이
          늘어나고 학습 신호가 세집니다. 이 성질 때문에 이미지·텍스트 대조 학습은 전통적으로 수만 규모의
          배치를 씁니다.
        </p>

        <p className="leading-7">
          그런데 배치를 키우는 비용이 두 손실에서 다릅니다. 정규화가 있는 쪽은 한 행의 합을 구해야 하므로 모든
          장치의 유사도를 모아야 하고, 배치의 제곱에 비례하는 행렬이 어딘가에 존재해야 합니다. 정규화가 없는
          쪽은 자기 조각만 계산해 더하면 되므로 장치별 메모리가 조각 크기의 제곱으로 줄어듭니다.
        </p>

        <p className="leading-7">
          그렇다고 무한정 키우는 것이 답은 아닙니다. 원 논문은 배치를 백만까지 올려 봤지만 이득이 빠르게
          줄어들었고, 3만 규모면 충분하다고 보고했습니다. 반대 방향도 중요합니다. 정규화가 없는 손실은 배치가
          작을 때 오히려 더 잘 동작한다고 보고됐습니다.
        </p>
      </div>

      <BatchViz />

      <TermBreakdown
        title="배치를 키울 때 실제로 늘어나는 것"
        description="같은 '배치 크기'라는 말이 두 손실에서 다른 비용을 뜻합니다."
        items={[
          {
            term: "음성 쌍 수",
            description: "배치 N이면 양성마다 음성이 N-1개입니다. 두 손실 모두 같습니다.",
            example: "N이 1,024면 한 행에 음성이 1,023개입니다.",
            boundary: "음성이 많아질수록 이득이 줄어드는 구간이 옵니다. 무조건 크면 좋은 것이 아닙니다.",
          },
          {
            term: "유사도 행렬",
            description: "N×N 행렬이 필요합니다. 정규화가 있으면 행 전체가 한곳에 모여야 합니다.",
            example: "정규화 없는 손실은 장치별 조각 b×b만 동시에 들고 있으면 됩니다.",
            boundary: "조각 방식은 장치 간에 표현을 순환시키며 계산하므로 통신 패턴 자체가 달라집니다.",
          },
          {
            term: "가짜 음성",
            description: "배치가 커질수록 내용이 같은 다른 쌍이 함께 들어올 확률이 올라갑니다.",
            example: "같은 상품의 다른 사진 두 장이 한 배치에 들어오면 서로를 음성으로 밀어냅니다.",
            boundary: "데이터 중복 제거가 배치 크기 선택과 같이 가야 하는 이유입니다.",
          },
        ]}
      />

      <div className="mt-6">
        <ProgressiveDetail
          title="조각 단위 계산이 정확히 무엇을 바꾸나요"
          preview="손실 값은 같고 메모리 상한만 달라집니다. 모든 유사도를 동시에 들고 있지 않아도 합을 완성할 수 있기 때문입니다."
        >
          <p className="leading-7">
            칸마다 독립인 손실은 전체 합이 부분 합의 합입니다. 그래서 장치 A가 가진 이미지들과 장치 B가 가진
            문장들의 조각만 계산해 더하고, 표현을 다음 장치로 넘겨 같은 일을 반복하면 전체 손실이 완성됩니다.
          </p>
          <p className="leading-7">
            정규화가 있는 손실에서는 이 분해가 성립하지 않습니다. 행의 합이 필요하니 그 행에 해당하는 모든
            유사도를 알아야 하고, 부분 합만으로는 확률을 만들 수 없습니다. 구현상 우회법이 있지만 통신이
            추가됩니다.
          </p>
          <p className="leading-7">
            분산 학습에서 무엇을 언제 모아야 하는지의 일반 논의는{" "}
            <Link to="/cs/ai/tensor-and-pipeline-parallel-inference">병렬 추론</Link>과{" "}
            <Link to="/cs/gpu/gpu-collective-network">collective 통신</Link>에서 다룹니다. 여기서는 손실의 수학적
            형태가 통신 요구를 바꾼다는 점만 짚었습니다.
          </p>
        </ProgressiveDetail>
      </div>
    </section>
  );
}
