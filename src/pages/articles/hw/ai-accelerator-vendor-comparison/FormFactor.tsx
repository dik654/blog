import { Link } from "react-router-dom";
import TermBreakdown from "@/components/articles/term-breakdown";
import FormFactorViz from "./viz/FormFactorViz";

export default function FormFactor() {
  return (
    <section id="form-factor" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">폼팩터가 전력과 냉각, 그리고 조달 선택지를 함께 정합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          가속기를 보드에 올리는 방법은 크게 둘입니다. 일반 확장 슬롯에 꽂는 카드 형태와, 베이스보드에 직접
          얹는 모듈 형태입니다. 이 선택이 전력 상한과 냉각 방식, 그리고 어떤 서버를 살 수 있는지까지 함께
          정합니다.
        </p>

        <p className="leading-7">
          카드 형태는 표준 슬롯에 들어가므로 일반 서버에 꽂을 수 있고 한두 장 구성이 쉽습니다. 대신 슬롯이
          공급할 수 있는 전력과 카드가 스스로 처리할 수 있는 발열에 상한이 있습니다. 같은 칩이라도 카드
          형태가 모듈 형태보다 낮은 전력으로 나오는 이유가 여기 있습니다.
        </p>

        <p className="leading-7">
          모듈 형태는 베이스보드가 전력과 냉각을 책임집니다. 그래서 카드 형태보다 훨씬 높은 전력을 쓸 수 있고
          가속기 사이 전용 링크도 보드 위에서 직접 배선됩니다. 대신 그 베이스보드를 지원하는 서버 섀시가
          있어야 하므로 조달 선택지가 좁아집니다.
        </p>

        <p className="leading-7">
          여기서 표준화 여부가 갈립니다. 모듈 규격을 업계 공개 규격으로 두면 여러 벤더의 가속기를 같은 형태의
          보드에 얹을 수 있고 서버 제조사도 한 설계를 재사용할 수 있습니다. 벤더 전용 규격은 그 벤더의 보드와
          섀시에 묶이는 대신 링크와 전력 설계를 한 회사가 통합해 최적화할 수 있습니다.
        </p>
      </div>

      <FormFactorViz />

      <TermBreakdown
        title="폼팩터가 결정하는 네 가지"
        description="가속기를 고르는 순간 따라오는 것들입니다."
        items={[
          {
            term: "전력 상한",
            description: "슬롯 급전에 묶이는지 베이스보드가 공급하는지에 따라 수백 W 차이가 납니다.",
            example: "같은 칩이 모듈 형태에서는 900W, 카드 형태에서는 600W로 나오기도 합니다.",
            boundary: "전력 상한이 낮으면 클럭과 지속 성능도 함께 낮아집니다.",
          },
          {
            term: "냉각 방식",
            description: "전력이 올라가면 공랭으로 감당할 수 없어 액체 냉각이 전제가 됩니다.",
            example: "같은 계열에서 공랭 모델과 액랭 모델의 전력이 다르게 공시되는 경우가 있습니다.",
            boundary: "액체 냉각은 서버뿐 아니라 랙과 전산실 설비까지 함께 바꿔야 합니다.",
          },
          {
            term: "가속기 간 배선",
            description: "전용 링크는 대개 베이스보드 위에서 배선되므로 모듈 형태에서만 온전히 쓸 수 있습니다.",
            example: "카드 형태에서는 같은 칩이라도 확장 버스만으로 통신하게 되는 구성이 있습니다.",
            boundary: "카드 형태의 대역폭을 모듈 형태 스펙으로 읽으면 안 됩니다.",
          },
          {
            term: "조달 선택지",
            description: "공개 규격이면 여러 서버 제조사의 섀시를 쓸 수 있고 전용 규격이면 좁아집니다.",
            example: "8개 모듈을 얹는 베이스보드는 공개 규격 쪽에서 여러 제조사가 내놓습니다.",
            boundary: "공개 규격이라도 전력·냉각 조건이 맞아야 실제로 장착됩니다.",
          },
        ]}
      />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          그래서 카탈로그에서 "8-GPU 서버"라는 표현을 볼 때 확인할 것은 모듈 규격과 전력 공급, 그리고 냉각
          방식입니다. 같은 8장이라도 어떤 규격의 모듈을 얹는 보드인지에 따라 올릴 수 있는 가속기가 달라지고,
          전원 모듈 구성과 팬 배치가 그 전력을 실제로 감당하는지도 따로 봐야 합니다.
        </p>

        <p className="leading-7">
          랙 단위 전력과 냉각 설계는{" "}
          <Link to="/cs/gpu/hw-power-cooling">전력과 냉각</Link>이 소유합니다. 이 절이 더하는 것은 그 설계 요구가
          가속기 폼팩터 선택에서 이미 결정된다는 점입니다.
        </p>
      </div>
    </section>
  );
}
