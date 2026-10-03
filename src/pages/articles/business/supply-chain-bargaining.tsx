import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** 공급망의 힘은 공장 소유보다 규격·주문·판매처를 쥔 곳에 생긴다 — 숫자와 제도 예시는 2026-10-03 확인 기준. */
export default function SupplyChainBargainingArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">100달러 수출품에서 한 나라에 100달러가 남지 않습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">100달러 제품에 수입 부품과 조립 60달러, 국제 물류 10달러, 유통·브랜드 단계 30달러가 있다고 가정합시다. 마지막 나라에서 수출 통계가 100달러로 잡혀도 앞선 나라의 부품 가치가 이미 포함되어 있습니다. 한 나라의 부가가치를 알려면 중간 투입을 빼야 합니다.</p>
          <p className="leading-7">기업의 힘도 마찬가지입니다. 공장을 갖는 것과 제품 사양을 정하고 대체 공급자를 고를 권한은 다를 수 있습니다. 특허·인증·고객 채널·대량 주문이 협상력을 만듭니다.</p>
        </div>
        <FlowRail
          title="(가정) 완제품 100달러, 부품·조립 60달러, 물류 10달러, 유통·브랜드 30달러"
          steps={[
            { actor: "부품·조립 업체", movement: "여러 나라에서 부품과 노동을 투입합니다.", receives: "계약상 제조대금 60달러" },
            { actor: "물류·통관", movement: "국경을 넘어 운송과 통관을 수행합니다.", receives: "운송대금 10달러" },
            { actor: "브랜드·판매자", movement: "규격과 고객 접점을 정하고 재고를 팝니다.", receives: "나머지 30달러에서 마케팅·위험 비용 지급" },
          ]}
        />
        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">100달러 물건의 생산과 판매 몫을 갈랐다면 국경을 넘는 돈의 길이 보입니다. 누가 규격과 고객을 정하는지 추적합니다.</p>
      </section>
      <section id="mechanism" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">통제 지점을 찾으면 이익이 어디에 남는지 보입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">브랜드가 설계와 판매 데이터를 쥐고 여러 조립업체를 선택할 수 있으면 조립업체는 가격 협상에서 약할 수 있습니다. 반대로 대체하기 어려운 부품·장비나 허가된 원료를 가진 공급자는 더 많은 몫을 요구할 수 있습니다.</p>
          <p className="leading-7">단기에는 계약 단가가 정해져도 환율·관세·운송비가 바뀌면 다음 계약에서 부담이 재배분됩니다. 재고를 누가 소유하고 품질 불량과 반품을 누가 책임지는지까지 봐야 실제 이익이 보입니다.</p>
        </div>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">부품·조립 60달러를 받은 주체가 최종가격까지 정하지는 못합니다. 정책 충격이 다른 나라의 공정으로 넘어가는 길을 확인합니다.</p>
      </section>
      <section id="comparison" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">국가의 산업정책도 같은 권한 지도를 바꿉니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">세계은행의 글로벌 가치사슬 보고서는 생산 단계가 여러 나라로 분리되고 한 나라의 정책 변화가 교역 상대에게 전해진다고 설명합니다. OECD 부가가치 무역 자료는 총수출과 국내 부가가치의 차이를 확인하는 데 쓸 수 있습니다.</p>
          <p className="leading-7">관세·수출통제·보조금·표준 인증은 특정 노드의 비용과 교체 가능성을 바꿉니다. 한국의 조립, 미국의 설계, 유럽의 규제처럼 한 나라에 역할을 고정하면 현실을 놓칩니다. 같은 산업 안에서도 기업별 계약 권한을 봐야 합니다.</p>
        </div>
        <SourceApplication source="World Bank WDR 2020 · About" excerpt="Public policies and economic conditions in one country strongly affect trade partners through production linkages" application="완제품 100달러 중 부품·조립 60달러가 여러 나라를 지날 때 한 나라의 관세나 자금 사정이 다른 단계의 원가와 납기에 전해질 수 있습니다." />
        <CitationBlock source="World Bank World Development Report 2020" citeKey={1} href="https://www.worldbank.org/en/publication/wdr2020">국제 가치사슬의 분업과 정책 파급을 설명하는 공식 보고서입니다.</CitationBlock>
        <CitationBlock source="World Bank Global Value Chains" citeKey={2} href="https://www.worldbank.org/ext/en/topic/trade/global-value-chains">국가 사이의 생산 단계 분리와 고부가가치 단계 이동을 설명합니다.</CitationBlock>
        <CitationBlock source="OECD Trade in Value Added" citeKey={3} href="https://www.oecd.org/en/topics/sub-issues/trade-in-value-added.html">총수출과 국내 부가가치의 차이를 확인할 통계 안내입니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">국제 생산망의 연결을 확인했습니다. 마지막은 수출 총액이 각 나라에 남는 가치와 왜 다른지 묻습니다.</p>
      </section>
      <section id="limits" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">공급망 재편이 곧 한 국가의 승리라는 결론은 빠릅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">생산지를 옮기면 운송 거리·인건비·정치 위험이 달라지지만 새 공장의 수율과 공급자 생태계가 따라와야 합니다. 공장 숫자가 늘어도 수입 중간재 비중이 높으면 국내 부가가치 증가가 작을 수 있습니다.</p>
          <p className="leading-7">시장 지배력의 원인을 찾을 때는 특허, 병목 장비, 전환 비용, 고객 계약, 규제 승인을 따로 시험합니다. 가격 인상 한 번만으로 누가 계속 이길지 알 수 없습니다.</p>
        </div>
        <ReviewPrompts questions={[
          "제품을 만든 공장의 제조비가 높아져도 최종 판매가격을 그 공장이 결정할 수 있을까요? (답: 2절)",
          "국가별 수출액만 보고 국내에 남는 가치를 판단하면 어떤 비용과 권리를 놓칠까요? (답: 4절)",
        ]} />
      </section>
    </div>
  );
}
