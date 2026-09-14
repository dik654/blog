import { Link } from "react-router-dom";
import TermBreakdown from "@/components/articles/term-breakdown";
import TierViz from "./viz/TierViz";

export default function ProductTiers() {
  return (
    <section id="product-tiers" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">제품군 경계는 코어가 아니라 플랫폼 기능이 정합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          같은 회사가 비슷한 코어 수로 서버용, 워크스테이션용, 고성능 데스크톱용을 각각 내놓습니다. 가격 차이의
          근거는 코어가 아니라 플랫폼 기능입니다. 소켓을 몇 개까지 붙일 수 있는지, 레인과 채널이 몇 개인지,
          원격 관리와 이중화를 지원하는지가 갈립니다.
        </p>

        <p className="leading-7">
          서버 계열은 두 소켓 이상을 전제로 설계됩니다. 레인과 채널이 가장 많고, 원격 관리 컨트롤러와 이중화
          전원, 핫스왑 부품이 플랫폼 차원에서 지원됩니다. 랙에 넣어 오래 돌리는 것을 전제한 설계입니다.
        </p>

        <p className="leading-7">
          워크스테이션 계열은 단일 소켓이지만 서버에 가까운 레인과 채널을 제공합니다. 가속기 두세 장과 빠른
          저장장치를 붙이는 작업용 기기에 맞고, 오류 정정 메모리도 지원합니다. 다만 이중화와 원격 관리는 서버만큼
          갖추지 않은 경우가 많습니다.
        </p>

        <p className="leading-7">
          고성능 데스크톱 계열은 같은 이름을 쓰더라도 레인이 크게 줄어듭니다. 가속기 한두 장에는 충분하지만
          여덟 장 구성에는 예산이 모자랍니다. 이 구분을 모르고 이름만 보고 고르면 조립 단계에서 슬롯이 부족한
          상황을 만납니다.
        </p>
      </div>

      <TierViz />

      <TermBreakdown
        title="제품군을 가르는 플랫폼 기능"
        description="코어 수가 비슷해도 이 항목들이 다르면 다른 계열입니다."
        items={[
          {
            term: "소켓 확장",
            description: "여러 소켓을 한 보드에 올릴 수 있는지입니다. 레인과 채널 예산이 소켓 수에 비례합니다.",
            example: "레인이 모자라 두 소켓으로 가는 결정은 코어를 늘리려는 것이 아닙니다.",
            boundary: "소켓이 늘면 배치 문제가 생기므로 단순히 예산이 두 배가 되는 것은 아닙니다.",
          },
          {
            term: "레인과 채널 수",
            description: "확장 장치 수와 메모리 대역폭·용량의 상한을 정합니다.",
            example: "같은 브랜드 안에서도 계열에 따라 레인이 절반 이하로 줄기도 합니다.",
            boundary: "제품 세대마다 값이 바뀌므로 기준일과 함께 확인해야 합니다.",
          },
          {
            term: "관리와 이중화",
            description: "원격 관리 컨트롤러, 이중 전원, 핫스왑 부품 지원 여부입니다.",
            example: "무인 운영과 장애 대응 시간을 좌우합니다.",
            boundary: "이 기능은 CPU가 아니라 보드와 섀시가 제공하므로 플랫폼 단위로 확인합니다.",
          },
          {
            term: "메모리 정정 지원",
            description: "오류 정정 모듈을 쓸 수 있는지입니다.",
            example: "장시간 학습에서 조용한 비트 오류를 줄입니다.",
            boundary: "지원 여부와 필수 여부가 계열마다 달라 보드 문서를 함께 봐야 합니다.",
          },
        ]}
      />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          서버와 데스크톱 플랫폼이 어떤 운영 요구를 다르게 다루는지는{" "}
          <Link to="/cs/gpu/hw-server-vs-desktop">서버와 데스크톱</Link>이 소유합니다. 이 절은 그 구분을 CPU
          제품군 선택에 적용해, 이름이 아니라 레인·채널·관리 기능으로 계열을 가리는 방법을 다뤘습니다.
        </p>
      </div>
    </section>
  );
}
