import { Link } from "react-router-dom";
import TermBreakdown from "@/components/articles/term-breakdown";
import TierViz from "./viz/TierViz";

export default function ProductTiers() {
  return (
    <section id="product-tiers" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">제품군 경계는 코어가 아니라 플랫폼 기능이 정합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          같은 회사가 서버용, 워크스테이션용, 고성능 데스크톱용 CPU를 따로 내놓습니다. 코어 수 구간은 서로
          겹치므로 이름이나 코어 수만으로 경계를 잡으면 안 됩니다. 소켓 수, 실제 사용 가능한 레인, 메모리 채널,
          원격 관리와 부품 이중화가 플랫폼의 성격과 가격을 가릅니다.
        </p>

        <p className="leading-7">
          서버 계열은 1소켓 또는 2소켓 보드로 구성할 수 있습니다. 예를 들어 EPYC 9005는 1소켓에서 최대 128개
          PCIe 5.0 레인과 12개 메모리 채널을 제공합니다. 2소켓이라고 외부 장치용 레인이 단순히 256개가 되는
          것은 아닙니다. CPU끼리 연결하는 xGMI가 같은 물리 링크를 쓰므로, 공식 아키텍처 문서의 일반적인
          4링크 구성은 시스템 전체에 128개, 3링크 구성은 최대 160개를 외부 PCIe로 남깁니다.
        </p>

        <p className="leading-7">
          워크스테이션 계열은 단일 소켓이지만 서버에 가까운 I/O를 제공할 수 있습니다. Threadripper PRO 9000
          WX와 WRX90 조합은 총 144개 사용 가능 레인 중 최대 128개를 PCIe 5.0으로 제공하고, 메모리는 8채널입니다.
          여러 GPU를 한 섀시에 넣기에는 유리하지만, 이중 전원·핫스왑·BMC 같은 운영 기능은 CPU가 아니라 실제
          보드와 섀시 사양을 따로 확인해야 합니다.
        </p>

        <p className="leading-7">
          같은 sTR5 소켓을 쓰는 Threadripper 9000과 TRX50 조합은 총 88개 사용 가능 레인, 그중 최대 80개가
          PCIe 5.0이고 메모리는 4채널입니다. 이름과 소켓이 비슷해도 PRO+WRX90과 장치·메모리 예산이 다릅니다.
          일반 AM5 데스크톱은 이보다 다시 작습니다. 계열 이름보다 CPU와 칩셋·보드의 조합을 함께 읽어야 하는
          이유입니다.
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
