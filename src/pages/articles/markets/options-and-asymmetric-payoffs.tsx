import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** 옵션은 손해를 피할 선택권을 사고 그 값으로 프리미엄을 낸다 — 숫자와 제도 예시는 2026-10-03 확인 기준. */
export default function OptionsAndAsymmetricPayoffsArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">주가가 120이어도 콜 매수자가 20을 번 것은 아닙니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">행사가 100인 콜을 8에 산 뒤 만기 주가가 120이면 행사 가치 20에서 처음 낸 8을 빼 순손익은 12입니다. 주가가 90이면 행사하지 않고 8을 잃습니다. 가격이 오를 선택권은 공짜가 아닙니다.</p>
          <p className="leading-7">풋은 반대로 정해진 값에 팔 권리입니다. 이미 주식을 가진 사람이 풋을 사면 하락 손실의 바닥을 만들 수 있습니다. 주식이 없으면 풋은 가격 하락에 베팅하는 별도 포지션일 수 있습니다.</p>
        </div>
        <FlowRail
          title="(가정) 주식 1주, 행사가 100, 콜 프리미엄 8, 만기 주가 120"
          steps={[
            { actor: "콜 매수자", movement: "8을 먼저 내고 100에 살 권리를 얻습니다.", receives: "주가 상승 때 선택권" },
            { actor: "콜 매도자", movement: "8을 먼저 받고 요청 시 100에 팝니다.", receives: "프리미엄과 의무" },
            { actor: "청산·중개", movement: "계약 조건과 담보를 관리합니다.", receives: "수수료와 이행 체계" },
          ]}
        />
        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">주가 120에서 행사 가치 20과 순손익 12를 나눴습니다. 이제 선택권을 판 사람의 의무를 봅니다.</p>
      </section>
      <section id="mechanism" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">매수자는 선택하고 매도자는 의무를 받습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">콜 매수자의 만기 행사 가치는 주가에서 행사가를 뺀 값과 0 중 큰 값입니다. 순손익은 거기서 프리미엄을 뺍니다. 콜 매도자는 같은 금액을 반대로 부담합니다. 무담보 콜 매도는 주가가 크게 오르면 손실 상한이 없습니다.</p>
          <p className="leading-7">옵션을 만기까지 보유하지 않아도 시장에서 팔 수 있습니다. 만기 전 가격에는 행사 가치뿐 아니라 남은 시간, 변동성, 금리, 배당, 수급이 들어갑니다. 행사 가격만 보고 오늘의 옵션값을 정할 수 없습니다.</p>
        </div>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">주가 90에서는 8을 잃고 끝나지만 매도자는 반대편 위험을 집니다. 표준 계약의 권리와 의무를 대조합니다.</p>
      </section>
      <section id="comparison" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">보험과 비슷하지만 동일한 계약은 아닙니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">이미 보유한 주식에 풋을 붙이면 손실 제한을 사는 보험 같은 효과가 있습니다. 그러나 보험과 달리 옵션은 손해가 발생했는지 입증할 필요가 없는 표준 계약일 수 있고, 매도자에게는 큰 담보와 위험 관리가 필요합니다.</p>
          <p className="leading-7">OCC 교육 자료는 콜·풋 매수자의 권리와 매도자의 의무, 매수자의 프리미엄 한도 손실과 무담보 매도자의 큰 손실 가능성을 설명합니다. 계약 단위와 행사·결제 방식은 시장마다 다릅니다.</p>
        </div>
        <SourceApplication source="Options Industry Council · Options Basics, Describing Equity Options" excerpt="the right, but not the obligation, to buy" application="행사가 100의 콜을 8에 산 사람은 만기 주가 120에서 행사 가치 20을 선택하고 순손익 12를 얻습니다. 90이면 행사하지 않아 8만 잃습니다." />
        <CitationBlock source="Options Industry Council: Options Basics" citeKey={1} href="https://www.optionseducation.org/optionsoverview/options-basics">옵션 매수·매도의 권리와 의무, 프리미엄, 손실 구조의 공식 교육 자료입니다.</CitationBlock>
        <CitationBlock source="Options Industry Council: Benefits and Risks" citeKey={2} href="https://www.optionseducation.org/optionsoverview/what-are-the-benefits-risks">매수 손실 한도와 무담보 콜 매도의 손실 가능성을 설명합니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">OIC 원문은 매수자의 선택권을 말합니다. 그 구조가 보험과 비슷해도 같은 보장 계약이라고 부를 수 없는 이유를 확인합니다.</p>
      </section>
      <section id="limits" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">싸 보이는 프리미엄은 낮은 확률과 유동성 비용을 숨길 수 있습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">프리미엄 8을 여러 번 잃으면 한 번의 큰 이익으로도 회복하기 어려울 수 있습니다. 반대로 옵션 매도 수익이 자주 작게 발생해도 드문 큰 손실을 견딜 자본이 필요합니다.</p>
          <p className="leading-7">실제 위험은 옵션 하나가 아니라 보유 주식·대출·다른 옵션과 합한 포트폴리오에서 봐야 합니다. 행사가·만기·계약 승수·조기 행사 여부를 상품설명서로 확인합니다.</p>
        </div>
        <ReviewPrompts questions={[
          "행사가 100·프리미엄 8의 콜을 사서 만기 주가가 120이면 행사 가치와 순손익은 각각 얼마인가요? (답: 2절)",
          "프리미엄을 자주 받는 무담보 매도가 안전한 수익이라고 말할 수 있을까요? (답: 4절)",
        ]} />
      </section>
    </div>
  );
}
