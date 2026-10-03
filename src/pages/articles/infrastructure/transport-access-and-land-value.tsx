import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** 교통은 이동 시간을 바꿔 일자리와 땅값을 다시 배분한다 — 숫자와 제도 예시는 2026-10-03 확인 기준. */
export default function TransportAccessAndLandValueArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">새 역은 시간을 줄이지만 이익이 모두 승객에게 남지 않습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">통근이 편도 60분에서 35분으로 줄면 한 달 20일 기준 편도 시간만 약 500분을 아낍니다. 더 먼 일자리에 지원할 수 있고 상점에는 새 손님이 올 수 있습니다. 그러나 역세권 월세가 오르면 이익 일부는 토지 소유자에게 옮겨갑니다.</p>
          <p className="leading-7">교통의 가치는 자동차가 몇 대 더 달리는지보다 누가 어떤 기회에 닿는지로 읽을 수 있습니다.</p>
        </div>
        <FlowRail
          title="(가정) 통근 60분에서 35분, 월 절약 20일×25분"
          steps={[
            { actor: "통근자", movement: "한 달 약 500분의 이동 시간을 아낍니다.", receives: "접근 가능한 일자리 확대" },
            { actor: "교통 운영자·정부", movement: "노선·차량·도로를 건설하고 운영합니다.", receives: "요금·세입과 유지 책임" },
            { actor: "토지 소유자·상인", movement: "역 주변 접근성 변화를 맞습니다.", receives: "임대료와 매출 변화" },
          ]}
        />
        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">편도 25분 절약을 월 500분으로 계산했습니다. 이 시간이 어떤 기회에 닿는지 살핍니다.</p>
      </section>
      <section id="mechanism" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">건설비·운영비·접근성 이익을 다른 장부에 둡니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">철도 건설비를 정부가 먼저 내고 승객이 요금을 냅니다. 운영 적자는 세금으로 메울 수 있습니다. 토지 소유자는 역 접근성이 높아진 뒤 임대료 상승을 얻을 수 있지만 기존 임차인은 퇴거 압박을 받을 수도 있습니다.</p>
          <p className="leading-7">혼잡은 한 사람이 도로에 들어가 다른 사람의 시간을 늦추는 비용입니다. 요금과 차량 수만 세면 이 비용과 보행자의 안전을 놓칩니다.</p>
        </div>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">통근자의 편익과 토지 소유자의 임대료 수입을 나눴습니다. 같은 노선이 다른 도시에서 어떻게 작동하는지 봅니다.</p>
      </section>
      <section id="comparison" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">같은 철도라도 도시의 토지 규칙에 따라 결과가 달라집니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">세계은행의 도시 교통 자료는 사람을 일자리와 서비스에 연결하는 접근성을 다룹니다. 역 주변 개발 밀도 제한, 주차 공급, 환승 요금, 기존 주거 보호가 나라와 도시마다 다릅니다.</p>
          <p className="leading-7">서울·런던·뭄바이·라구스의 통근을 한 숫자로 비교할 때는 총 이동 시간, 비용, 신뢰성, 혼잡, 안전과 실제 일자리 분포를 맞춰야 합니다.</p>
        </div>
        <SourceApplication source="World Bank · Leaders in Urban Transport Planning" excerpt="assess the accessibility needs and challenges facing their own cities" application="편도 25분 절약을 월 20일에 대입하면 편도만 500분입니다. 그러나 새 노선이 실제 일자리·학교에 닿는지와 임대료 상승까지 그 도시에서 확인해야 합니다." />
        <CitationBlock source="World Bank Leaders in Urban Transport Planning" citeKey={1} href="https://academy.worldbank.org/en/infrastructure/transport/leaders-in-urban-transport-planning">도시 교통 계획에서 접근성과 서비스·재정의 연결을 다루는 교육 자료입니다.</CitationBlock>
        <CitationBlock source="World Bank Urban Mobility Results" citeKey={2} href="https://www.worldbank.org/en/results/2024/03/13/promoting-livable-cities-by-investing-in-urban-mobility">교통 투자와 도시 생활 접근의 사례를 제공합니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">세계은행의 접근성 질문은 속도만 재지 않습니다. 시간 절약과 땅값을 더할 때 같은 편익을 두 번 세지 않는지 확인합니다.</p>
      </section>
      <section id="limits" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">시간 절약을 곧바로 경제 성장액으로 더할 수 없습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">절약한 시간이 반드시 유급 노동으로 바뀌지는 않습니다. 노선 변경으로 다른 지역의 손님이 줄 수도 있고 인구가 이동할 수 있습니다.</p>
          <p className="leading-7">사업성 검토에는 이용자 추정, 건설 초과 비용, 운영 적자, 이주 비용과 지역별 수혜를 함께 놓아야 합니다.</p>
        </div>
        <ReviewPrompts questions={[
          "통근을 편도 25분 줄이는 새 노선의 이익이 시간이 지나도 전부 승객에게 남을까요? (답: 2절)",
          "시간 절약과 역세권 땅값 상승을 편익으로 단순히 더하면 어떤 중복이 생길까요? (답: 4절)",
        ]} />
      </section>
    </div>
  );
}
