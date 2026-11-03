import { Link } from "react-router-dom";
import TermBreakdown from "@/components/articles/term-breakdown";

export default function FormFactor() {
  return (
    <section id="form-factor" className="scroll-mt-20">
      <h2 className="mb-6 break-keep text-2xl font-bold">
        성능 비교 전에 자체 랙과 통합 시스템, cloud service의 배치 경계를 가릅니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          고정한 사례는 자체 데이터센터 두 곳이 기본 용량을 맡고 cloud가 급증분을
          받습니다. 따라서 “70B가 잘 돈다”는 사실만으로 같은 후보가 되지 않습니다.
          고객이 사서 설치할 수 있는 module·server, rack 전체로 조달하는 통합 system,
          특정 cloud에서 시간 단위로 빌리는 service는 확보 방법과 장애 책임이 다릅니다.
        </p>
        <p className="leading-7">
          Google TPU와 AWS Trainium은 이 사례에서 cloud burst 후보입니다. 자체 랙에
          같은 accelerator module을 사서 넣는 경로로 취급하지 않습니다. 반대로 NVIDIA,
          AMD, Intel 계열은 OEM server나 통합 rack으로 자체 시설에 들일 수 있지만,
          공개된 제품이 필요한 지역·수량·납기에 실제 공급된다는 뜻은 아닙니다.
        </p>
      </div>

      <TermBreakdown
        title="같은 성능표에 넣기 전에 구분할 배치 형태"
        items={[
          {
            term: "자체 랙의 module·server",
            description: "조직이 server를 소유하고 전력·냉각·network·spare와 upgrade를 책임집니다.",
            example: "PCIe card나 OAM·SXM 계열 module을 담은 OEM server를 설치합니다.",
            boundary: "Module 규격이 같아도 baseboard, firmware, link 구성과 지원 조합이 같다는 뜻은 아닙니다.",
          },
          {
            term: "Rack-scale 통합 system",
            description: "가속기와 scale-up fabric, CPU·NIC, 전력·액랭을 rack 단위로 함께 조달합니다.",
            example: "Rack 전체 domain을 한 모델에 쓰면 촘촘한 통신 범위를 크게 가져갈 수 있습니다.",
            boundary: "가속기 수만 보고 기존 rack에 넣을 수 없습니다. Floor load, busway, CDU와 service clearance까지 맞아야 합니다.",
          },
          {
            term: "Cloud accelerator service",
            description: "Cloud 사업자가 hardware와 facility를 운영하고 사용자는 instance·slice·pod를 예약합니다.",
            example: "TPU와 Trainium은 region별 quota와 예약 단위를 확인해 burst 후보로 씁니다.",
            boundary: "제품 page의 GA 표기와 내 계정·region의 즉시 capacity는 다릅니다.",
          },
        ]}
      />

      <h3 id="facility-gate" className="mt-10 mb-3 scroll-mt-24 break-keep text-xl font-semibold">
        자체 시설 후보는 accelerator 전력보다 rack이 끝까지 버티는지를 먼저 봅니다
      </h3>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          고전력 module을 선택하면 server PSU만 바뀌는 것이 아닙니다. Rack당 지속 kW,
          A/B feed 한쪽을 잃은 N−1 상태, 공랭 또는 direct liquid cooling, CDU와 facility
          water loop, 배관 누수 격리까지 함께 바뀝니다. 장비 인도일보다 전력 증설과
          냉각 공사가 더 늦으면 hardware가 도착해도 capacity는 생기지 않습니다.
        </p>
        <p className="leading-7">
          따라서 자체 랙 후보에는 장비 가격뿐 아니라 site 준비 기간, 남은 전력·냉각,
          spare·현장 교체, model weight를 가져오는 storage·network 경로를 붙입니다.
          Cloud 후보에는 region latency, egress, quota, 예약 할인, 데이터 위치와 provider
          장애 시 이동 비용을 붙입니다. 이 비용은 서로 다른 단위이므로 먼저 월간 고정
          capacity와 burst 사용량이라는 같은 업무량으로 환산합니다.
        </p>
        <p className="leading-7">
          전력 경로와 열 제거 계산은{" "}
          <Link to="/cs/gpu/hw-power-cooling">전력과 냉각</Link>이, 자체·cloud를
          섞는 배치 정책은 이후 platform 글이 소유합니다. 여기서는 배치 경계를 통과하지
          못한 후보의 FLOPS를 비교하지 않는다는 원칙만 확정합니다.
        </p>
      </div>

      <div className="mt-8 rounded-xl border border-border bg-muted/20 p-5 text-sm leading-7">
        <p className="font-semibold text-foreground">이 사례에서 다음 관문으로 넘길 증거</p>
        <p className="mt-2 text-muted-foreground">
          자체 랙 후보에는 OEM BOM과 인도 일정을 남깁니다. 전력과 냉각 조건도 같은
          문서에 붙입니다. Cloud 후보에는 region·quota·예약 단위와 egress 조건을
          남깁니다. “출시됨”이나 “지원됨” 한 단어는 실제 배치 가능 증거가 아닙니다.
        </p>
      </div>
    </section>
  );
}
