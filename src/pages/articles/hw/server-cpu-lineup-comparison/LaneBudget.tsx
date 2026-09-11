import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import LaneViz from "./viz/LaneViz";

export default function LaneBudget() {
  return (
    <section id="lane-budget" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">레인은 나눠 쓰는 자원이라 먼저 예산을 짭니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          CPU가 제공하는 PCIe 레인 수는 고정입니다. 가속기, 네트워크 카드, 저장장치가 모두 이 예산에서 레인을
          가져갑니다. 그래서 서버를 설계할 때 첫 계산은 "이 구성이 레인 예산에 들어가는가"이고, 들어가지 않으면
          어딘가를 느리게 만들거나 스위치를 넣어 나눠 써야 합니다.
        </p>

        <p className="leading-7">
          가속기 한 장이 보통 16레인을 가져갑니다. 여덟 장이면 128레인이고, 여기에 고속 네트워크 카드가 장당
          16레인, 부팅용과 데이터용 저장장치가 각각 4레인씩 붙습니다. 단순히 더하면 백오십 레인을 넘기고,
          단일 소켓 CPU가 제공하는 양을 넘어섭니다.
        </p>

        <p className="leading-7">
          해결책은 셋입니다. 소켓을 둘로 늘려 예산을 두 배로 만들거나, 스위치 칩을 넣어 여러 장치가 상위 레인을
          나눠 쓰게 하거나, 일부 장치를 더 적은 레인으로 연결하는 것입니다. 각각 비용과 성능 특성이 다르므로
          어느 장치를 어디에 둘지가 설계 결정이 됩니다.
        </p>
      </div>

      <ExplainedFormula
        question="이 구성이 레인 예산에 들어가는지 어떻게 확인합니까"
        idea="장치마다 필요한 레인을 더해 CPU가 제공하는 총량과 비교하고, 넘치면 어디를 나눠 쓸지 정합니다."
        formula={String.raw`L_{\text{req}} = \sum_{d} n_d\,\ell_d \le S \cdot L_{\text{cpu}}`}
        annotatedFormula={String.raw`\underbrace{L_{\text{req}} = \sum_{d} n_d\,\ell_d}_{\text{필요한 레인 합}} \le \underbrace{S \cdot L_{\text{cpu}}}_{\text{소켓 수 × 소켓당 레인}}`}
        operations={[
          {
            expression: String.raw`n_d\,\ell_d`,
            annotation: [
              "장치 종류 d의 개수에 그 장치가 쓰는 레인 수를 곱합니다",
              "가속기 16, 고속 NIC 16, NVMe 4가 흔한 값입니다",
            ],
          },
          {
            expression: String.raw`\sum_{d} n_d\,\ell_d`,
            annotation: "모든 장치의 요구를 더합니다. 관리 포트와 온보드 장치도 일부 레인을 씁니다",
          },
          {
            expression: String.raw`S \cdot L_{\text{cpu}}`,
            annotation: "소켓 수에 소켓당 레인 수를 곱한 값이 예산입니다. 2소켓 구성에서 일부 레인은 소켓 간 연결에 쓰이기도 합니다",
          },
        ]}
        terms={[
          { symbol: String.raw`L_{\text{req}}`, name: "필요 레인 합", description: "구성에 들어가는 모든 장치의 레인 요구입니다." },
          { symbol: String.raw`\ell_d`, name: "장치당 레인 수", description: "가속기 16, NVMe 4처럼 장치 종류마다 정해진 값입니다." },
          { symbol: "S", name: "소켓 수", description: "1소켓이면 1, 2소켓이면 2입니다." },
          { symbol: String.raw`L_{\text{cpu}}`, name: "소켓당 레인 수", description: "제품군마다 다르며 같은 회사 안에서도 서버용과 워크스테이션용이 갈립니다." },
        ]}
        assumptions={[
          "모든 장치를 최대 폭으로 연결한다고 가정합니다. 더 좁은 폭으로 연결하면 요구는 줄지만 그 장치의 대역폭도 줄어듭니다.",
          "소켓 간 연결과 칩셋용으로 예약되는 레인은 제품마다 달라 별도로 확인해야 합니다.",
        ]}
        interpretation="부등식이 성립하지 않는다고 구성이 불가능한 것은 아닙니다. 스위치를 넣어 나눠 쓰면 들어가지만, 그 아래 장치들이 상위 링크를 공유하게 되므로 동시 사용 시 대역폭이 갈립니다."
      />

      <LaneViz />

      <h3 id="lane-arithmetic" className="mt-10 mb-3 scroll-mt-24 text-xl font-semibold">
        나눠 쓰면 언제 문제가 되는지 계산합니다
      </h3>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          스위치를 넣어 네 장치를 16레인 하나에 붙이면 각 장치는 필요할 때 16레인만큼 쓸 수 있습니다. 문제는
          동시에 쓸 때입니다. 네 장치가 함께 전송하면 상위 링크를 나눠 갖게 되어 각자 4레인 분량으로 떨어집니다.
        </p>

        <p className="leading-7">
          그래서 나눠 쓰는 구성이 괜찮은지는 워크로드의 동시성으로 정해집니다. 저장장치처럼 접근이 산발적이고
          짧은 장치는 나눠 써도 체감이 적습니다. 반대로 가속기 사이 통신이나 네트워크 전송처럼 오래 지속되는
          트래픽은 나눠 쓰는 순간 그대로 절반, 사분의 일이 됩니다.
        </p>

        <p className="leading-7">
          이 판단이 배치 문제와 이어집니다. 서로 많이 통신하는 장치는 같은 스위치 아래 두어야 상위 링크를 거치지
          않고, 반대로 대역폭을 놓고 다투는 장치는 다른 경로로 분리해야 합니다. 경로에 따라 실제 달성 대역폭이
          달라지는 구조는{" "}
          <Link to="/gpu/gpu-interconnects#pcie-topology-peer-path">PCIe 토폴로지</Link>에서 다룹니다.
        </p>
      </div>

      <div className="mt-6">
        <ProgressiveDetail
          title="카탈로그의 레인 표기를 읽는 법"
          preview="슬롯 개수와 실제 레인 수는 다릅니다. 물리적으로 16레인 크기인 슬롯이 전기적으로는 8레인인 경우가 흔합니다."
        >
          <p className="leading-7">
            슬롯 표기는 보통 물리 크기와 전기 연결을 함께 적습니다. 물리적으로 큰 슬롯이라도 실제로 연결된
            레인이 적으면 그 폭만큼만 나옵니다. 카탈로그에서 이 두 값을 구분해 읽어야 합니다.
          </p>
          <p className="leading-7">
            또 하나는 동시 장착 제약입니다. 특정 슬롯을 쓰면 다른 슬롯의 레인이 줄거나 비활성화되는 보드가
            많습니다. 이런 제약은 CPU 사양이 아니라 메인보드와 라이저 설계에서 나오므로 해당 문서를 따로 봐야
            합니다.
          </p>
          <p className="leading-7">
            세대도 확인합니다. 같은 16레인이라도 세대가 한 단계 다르면 대역폭이 두 배 차이 납니다. 세대별 전송률과
            인코딩을 반영한 계산은{" "}
            <Link to="/gpu/gpu-interconnects#pcie-transaction-bandwidth-latency">PCIe 대역폭 공식</Link>을 씁니다.
          </p>
        </ProgressiveDetail>
      </div>
    </section>
  );
}
