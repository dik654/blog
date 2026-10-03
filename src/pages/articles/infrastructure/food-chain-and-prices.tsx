import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** 식품 가격은 농장의 생산량에서 식탁까지의 손실과 권력으로 만들어진다 — 숫자와 제도 예시는 2026-10-03 확인 기준. */
export default function FoodChainAndPricesArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">소비자가 200원을 내도 농가가 200원을 받지는 않습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">농가 출하 100원에 선별·저장 30원, 운송 20원, 소매 단계 50원이 더해져 소비자 가격이 200원이 되었다고 합시다. 이 숫자는 설명용이며 각 단계 금액이 곧 이익은 아닙니다. 전기·냉장·노동·폐기와 매장 비용이 그 안에 들어갑니다.</p>
          <p className="leading-7">식품 물가를 보려면 생산량뿐 아니라 수확 시기, 수입 항로, 저장 가능 기간, 도매시장과 대형 구매자의 계약 조건을 살펴야 합니다.</p>
        </div>
        <FlowRail
          title="(가정) 농가 100원, 선별·저장 30원, 운송 20원, 소매 50원"
          steps={[
            { actor: "농가", movement: "식품 한 단위를 100원에 넘깁니다.", receives: "출하 대금과 생산 위험" },
            { actor: "가공·물류", movement: "선별·저장 30원과 운송 20원을 투입합니다.", receives: "재고와 납기 책임" },
            { actor: "소매·소비자", movement: "소매 단계 50원을 포함한 200원에 거래합니다.", receives: "식품과 품질 기대" },
          ]}
        />
        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">농가의 100원과 소비자의 200원이 다른 이유를 네 단계로 나눴습니다. 저장과 폐기 위험을 넣습니다.</p>
      </section>
      <section id="mechanism" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">상하기 쉬운 상품은 시간과 협상력이 가격을 움직입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">수확 뒤 바로 팔아야 하는 농가는 가격 협상력이 약할 수 있습니다. 냉장 보관이나 가공 능력이 있으면 판매 시점을 고를 수 있지만 설비 자금이 먼저 듭니다. 소매업자는 소비자 접근을 통제하고 반품·폐기 조건을 공급자에게 돌릴 수도 있습니다.</p>
          <p className="leading-7">생산량이 10% 줄어도 소비자가격은 반드시 10% 오르지 않습니다. 재고, 수입 대체, 수요 반응과 계약 가격이 중간에서 충격을 나눕니다.</p>
        </div>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">부패하기 쉬운 물건의 시간 제약을 알았다면 협상력을 가격 차이에 연결할 수 있습니다. 국가별 물류망을 비교합니다.</p>
      </section>
      <section id="comparison" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">국가별 식량 문제는 수입 의존과 유통망에서 갈립니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">FAO의 식품 가치사슬 자료는 생산, 집하, 가공, 유통과 소비의 연결을 함께 보게 합니다. 식량 자급률이 비슷해도 항만·도로·냉장망과 외화 조달 조건이 다르면 가격 충격이 달라집니다.</p>
          <p className="leading-7">한국·일본 같은 수입국, 브라질 같은 수출국, 가뭄이나 분쟁에 취약한 지역을 비교할 때 작물별 수입 경로와 저소득층 식비 비중을 따로 확인합니다.</p>
        </div>
        <SourceApplication source="FAO · Sustainable Food Value Chains, Figure 3 설명" excerpt="production, aggregation, processing, and distribution" application="농가의 생산 100원 뒤 집하·선별 30원, 운송 20원, 소매 50원을 나누어 적습니다. 각 단계의 30·20·50원이 그대로 이익이라는 뜻은 아닙니다." />
        <CitationBlock source="FAO Sustainable Food Value Chains" citeKey={1} href="https://www.fao.org/sustainable-food-value-chains/what-is-it/en/">생산부터 집하·가공·유통·소비까지의 가치사슬 범위를 정의합니다.</CitationBlock>
        <CitationBlock source="FAO Food Prices" citeKey={2} href="https://www.fao.org/prices/en">나라와 단계에 따른 식품 가격 자료를 찾는 공식 경로입니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">FAO의 네 기능은 어느 단계가 폭리인지 자동으로 답하지 않습니다. 원가와 순마진의 자료를 더 찾습니다.</p>
      </section>
      <section id="limits" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">가격이 올랐다는 이유만으로 폭리 주체를 지목할 수 없습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">소매가격과 농가가격 차이에는 운송비와 폐기율이 포함됩니다. 반대로 중간 비용이 늘지 않았는데 특정 단계의 마진만 뛰었다면 계약과 시장 집중도를 조사할 이유가 생깁니다.</p>
          <p className="leading-7">실제 판단에는 물량, 품질, 시기, 환율, 연료비와 단계별 순마진을 같은 단위로 맞춘 자료가 필요합니다.</p>
        </div>
        <ReviewPrompts questions={[
          "농가 100원과 소비자 200원 사이의 100원을 모두 유통업자의 이익이라 부를 수 있을까요? (답: 2절)",
          "식품 가격이 올랐을 때 작황 외에 먼저 확인할 수량과 비용은 무엇일까요? (답: 4절)",
        ]} />
      </section>
    </div>
  );
}
