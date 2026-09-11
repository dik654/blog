import { Link } from "react-router-dom";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import ContractViz from "./viz/ContractViz";

export default function ToolContract() {
  return (
    <section id="tool-contract" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">무엇을 그릴지 말하지 않는 것이 작동하는 이유입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          도구로 만들 때 가장 중요한 결정은 프롬프트를 받지 않는 것이었습니다. 편집 도구에 설명을 넣을 칸이
          없다는 것이 처음에는 빠진 기능처럼 보입니다. 그런데 이 모델이 동작하는 이유가 정확히 그 통로가
          없다는 데 있습니다.
        </p>

        <p className="leading-7">
          칸을 만들어 두면 호출하는 쪽이 채웁니다. 채워진 설명은 이 모델에서 아무 일도 하지 않거나, 배선을
          바꿔 전달하는 순간 다시 물건을 그리는 모델로 돌아갑니다. 어느 쪽이든 나쁩니다. 첫 번째는 조용히
          무시되는 인자가 되고, 두 번째는 처음의 문제로 되돌아갑니다.
        </p>

        <p className="leading-7">
          두 번째 결정은 마스크 확장 기본값을 0으로 둔 것입니다. 교체에서는 96픽셀을 열어야 결과가 좋아지는데,
          지우기는 반대입니다. 24픽셀만 넓혀도 띠 아래에 있던 가죽 벨트까지 함께 사라지고, 96픽셀에서는 마스크
          밖 변화가 0.16에서 4.12로 뜁니다.
        </p>

        <p className="leading-7">
          같은 이름의 파라미터가 한 동작에서 필수이고 다른 동작에서 금지라, 두 동작은 같은 도구에 들어갈 수
          없습니다. 확장 방향이 동작마다 반대라는 관계는{" "}
          <Link to="/ai/masked-edit-verb-routing#mask-polarity">편집 동작과 모델 라우팅</Link>이 소유하고,
          여기서는 지우기 쪽 기본값의 근거만 다룹니다.
        </p>
      </div>

      <ContractViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          세 번째는 잘못 들어온 요청을 넘기는 방식입니다. 인페인팅 도구를 부르면서 의도를 "지우기"로 지정하면,
          연산을 시작하기 전에 다른 도구로 넘깁니다. 반대로 이 모델이 할 수 없는 요청은 아무도 못 한다고
          답합니다.
        </p>

        <p className="leading-7">
          두 응답을 구분한 이유가 있습니다. "다른 도구가 합니다"는 호출하는 쪽이 그 도구를 부르면 되는
          상황이고, "아무도 못 합니다"는 접근 자체를 바꿔야 하는 상황입니다. 같은 거절로 뭉뚱그리면 호출하는
          쪽이 같은 요청을 다른 표현으로 계속 시도하게 됩니다.
        </p>
      </div>

      <div className="mt-6">
        <ProgressiveDetail
          title="설명을 받아 두면 나중에 쓸 수 있지 않습니까"
          preview="쓸 수 있게 되는 순간이 곧 이 도구가 다시 물건을 그리기 시작하는 순간입니다. 받아 두는 것 자체가 그 방향으로 가는 설계 압력이 됩니다."
        >
          <p className="leading-7">
            인자를 받아 두고 지금은 무시하는 설계는 흔합니다. 다만 이 경우에는 그 인자를 실제로 쓰는 유일한
            방법이 조건을 받는 모델로 갈아 끼우는 것이고, 그러면 일곱 모델이 전부 실패했던 그 자리로
            돌아갑니다.
          </p>
          <p className="leading-7">
            더 현실적인 위험은 호출하는 쪽입니다. 칸이 보이면 채우고, 채운 설명이 반영되지 않으면 표현을 바꿔
            다시 시도합니다. 아무 효과가 없는 문구를 계속 다듬는 시간이 생기고, 그 시간은 도구가 설명을 받지
            않았다면 아예 없었을 것입니다.
          </p>
          <p className="leading-7">
            그래서 받지 않는 쪽을 택했습니다. 지울 영역과 세기만 받고, 세기는 254에서 자릅니다. 호출 규약이
            좁다는 사실 자체가 이 도구가 무엇을 보장하는지를 말해 줍니다.
          </p>
        </ProgressiveDetail>
      </div>
    </section>
  );
}
