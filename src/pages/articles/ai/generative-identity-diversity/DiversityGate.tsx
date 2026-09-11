import { Link } from "react-router-dom";
import GateViz from "./viz/GateViz";

export default function DiversityGate() {
  return (
    <section id="diversity-gate" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">표본이 작으면 같은 질문에 계속 다른 답이 나옵니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          세 번의 정정이 각각 다른 이유로 일어났습니다. 첫 번째는 고정해 둔 변수가 실제 변수를 가렸고, 두
          번째는 표본이 작아 충돌률을 볼 수 없었으며, 세 번째는 측정 대상 자체가 능력을 억누르고 있었습니다.
        </p>

        <p className="leading-7">
          두 번째가 특히 되새길 만합니다. 여섯 명에서 만들 수 있는 쌍은 열다섯 개인데, 10퍼센트 수준의
          충돌률을 관찰하려면 그보다 훨씬 많은 쌍이 필요합니다. 열다섯 쌍에서 충돌이 0이라는 것은 충돌률이
          0이라는 뜻이 아니라 그 표본으로는 못 본다는 뜻입니다.
        </p>

        <p className="leading-7">
          그래서 규모를 키우기 전까지는 "이 축이 듣는다"는 결론을 미루는 편이 낫습니다. 실제로 일흔두 개로
          늘리자 2211쌍이 되고 215쌍의 충돌이 보였습니다.
        </p>

        <p className="leading-7">
          지금 답은 이렇습니다. 정체성은 조건의 함수이고 그 사상은 다대일입니다. 영향력 순서는 프롬프트가
          가장 크고 그다음이 모델이며 시드는 사실상 0인데, 프롬프트가 닿을 수 있는 범위 자체를 가중치가
          정합니다.
        </p>
      </div>

      <GateViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          실무 규칙으로 줄이면 셋입니다. 뱅크는 비증류 가중치로 만들고, 혼합으로 늘리려 하지 말고, 필요한
          인물 수보다 넉넉하게 확보합니다. 시간이 네 배 들지만 한 번 만들어 계속 재사용하는 자산이라 이
          거래는 남습니다.
        </p>

        <p className="leading-7">
          이 글이 주장하지 않는 것도 적어 둡니다. 수치는 한 장비에서 특정 모델 조합으로 얻은 것이며 증류가 다양성을 무너뜨린다는 결론도 한 모델 가족에서 한 번 잰 것입니다. 다른
          가족에서 같은 대조를 돌려 보지 않았으므로 증류 일반에 대한 주장으로 읽으면 안 됩니다.
        </p>

        <p className="leading-7">
          그리고 눈과 계측기가 갈리는 지점도 남아 있습니다. 스타일이 바뀌는 변환에서는 계측기가 눈보다 관대해서 얼굴형만 유지되면 질감과 나이가 크게 달라져도 유사도가 버팁니다. 이 부분은
          미해결로 둡니다.
        </p>

        <p className="leading-7">
          마지막 글은 이 시리즈에서 가장 오래 붙잡았던 실패를 다룹니다. 3차원 형태로 얼굴 골격을 직접
          제어하려던 세 라운드이고, 여기서 안 움직이던 너비 축이 그 글의 주제입니다. 임계값 선택의 방향성은{" "}
          <Link to="/ai/generative-measurement-controls#threshold-choice">계측기 검증</Link>이 소유합니다.
        </p>
      </div>
    </section>
  );
}
