import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** 대세는 사람들이 믿는 이야기와 실제 자금 제약이 서로를 바꿀 때 생긴다 — 숫자와 제도 예시는 2026-10-03 확인 기준. */
export default function NarrativesAndMarketRegimesArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">좋은 기술 설명만으로 자산 가격이 오르지는 않습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">어떤 기술의 기대 매출이 100에서 150으로 올라가고 요구 수익률은 10%에서 8%로 내려간다고 합시다. 미래에 받을 돈을 더 크게 보고 더 낮은 할인율로 계산하니 가격은 두 방향에서 오릅니다. 하지만 실제 다음 해 매출이 105라면 기대를 다시 고쳐야 합니다.</p>
          <p className="leading-7">사람들의 인식은 주문으로 바뀔 때 가격에 닿습니다. 대출자의 담보 허용, 펀드의 자금 유입, 정부의 보조금, 공급업체의 투자까지 이어질 때 이야기가 산업의 실제 생산에도 영향을 줄 수 있습니다.</p>
        </div>
        <FlowRail
          title="(가정) 기대 매출 100에서 150, 할인율 10%에서 8%, 실제 매출 105"
          steps={[
            { actor: "기업·정부", movement: "미래 계획과 정책 목표를 발표합니다.", receives: "자금·정치적 지지" },
            { actor: "투자자·대출자", movement: "기대 현금과 할인율을 다시 계산하고 주문합니다.", receives: "청구권과 가격 변동" },
            { actor: "대중·언론", movement: "오른 가격을 보고 이야기를 확산합니다.", receives: "새 기대와 참여" },
          ]}
        />
        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">기대 매출 150과 실제 매출 105를 구별했습니다. 믿음이 주문과 자금조달로 바뀌는 경로를 봅니다.</p>
      </section>
      <section id="mechanism" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">이야기 → 기대 → 자금 → 주문 → 가격 → 새 이야기의 고리를 봅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">처음에는 기술 성능이나 정책이 미래 현금흐름의 가능성을 바꿉니다. 투자자가 더 높은 매출과 낮은 위험을 예상하면 더 높은 가격에 주문합니다. 오른 가격은 회사가 새 주식을 발행하거나 담보로 차입하는 조건을 좋게 만들어 실제 설비 투자와 고용을 늘릴 수 있습니다.</p>
          <p className="leading-7">같은 고리는 반대로도 돕니다. 실적이 기대보다 낮거나 금리가 오르면 투자자는 할인율과 매출 전망을 다시 계산합니다. 레버리지 투자자가 팔아야 하면 가격 하락이 더 커지고, 낮아진 가격이 다시 비관적 이야기를 강화할 수 있습니다.</p>
        </div>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">가격 상승이 새 자금조달을 돕는 고리를 그렸습니다. 자금이 막힐 때 같은 고리가 어떻게 돌아가는지 원문과 대조합니다.</p>
      </section>
      <section id="comparison" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">인식의 힘은 시장 구조와 나라의 제도를 통과합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">BIS는 자금 유동성과 시장 유동성이 서로 영향을 주는 경로를 설명합니다. IMF의 주택시장 해설은 가격 상승과 미래 상승 믿음이 되먹임할 수 있다고 정리합니다. 이는 모든 상승이 거품이라는 뜻이 아닙니다.</p>
          <p className="leading-7">보조금·자본 통제·공매도 규칙·연기금의 의무·언론 환경·기업 공시의 질이 나라별로 다릅니다. 같은 기술 뉴스도 자금을 대는 사람이 누구인지에 따라 가격 반응과 지속 기간이 다를 수 있습니다.</p>
        </div>
        <SourceApplication source="BIS · Market and funding liquidity, overview" excerpt="Declines in market liquidity, in turn, may further impair funding liquidity, creating a negative feedback dynamic" application="기대 매출 150과 실제 105의 차이로 매도 주문이 커질 때 자금조달까지 막히면 가격 하락이 더 커질 수 있습니다. 이 서사의 인과는 실제 주문·대출 조건으로 확인해야 합니다." />
        <CitationBlock source="BIS Market and Funding Liquidity" citeKey={1} href="https://www.bis.org/speeches/20160502-market-and-funding-liquidity-overview">자금 제약과 시장 가격·거래량 사이의 되먹임을 설명합니다.</CitationBlock>
        <CitationBlock source="IMF Finance & Development: Are Housing Markets Broken?" citeKey={2} href="https://www.elibrary.imf.org/view/journals/022/0061/004/article-A003-en.xml">주택 가격과 상승 기대 서사의 되먹임 사례입니다.</CitationBlock>
        <CitationBlock source="IAS 7 Cash Flows" citeKey={3} href="https://www.ifrs.org/issued-standards/list-of-standards/ias-7-statement-of-cash-flows/">서사와 구분할 실제 영업 현금흐름 확인의 회계 기준입니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">BIS의 유동성 되먹임은 이야기 자체의 진실을 판정하지 않습니다. 이제 어떤 지표로 서사를 반증할지 정합니다.</p>
      </section>
      <section id="limits" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">서사가 틀렸는지 알려면 가격보다 검증할 지표를 먼저 정해야 합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">매출 150이라는 이야기를 들었다면 수주·생산능력·고객 유지·현금 회수·원가를 따로 검증합니다. 정부 발표라면 예산 통과와 실제 집행, 규제 인허가를 확인합니다. 가격이 올랐다는 사실은 그 주장들이 맞았다는 증거가 아닙니다.</p>
          <p className="leading-7">반대로 예상보다 매출이 105에 그쳤어도 초기 기술이 영원히 실패했다는 뜻도 아닙니다. 채택 시점과 비용 곡선, 대체 기술, 금리 변화를 분리해서 판단합니다.</p>
        </div>
        <ReviewPrompts questions={[
          "기대 매출과 할인율이 함께 바뀌면 가격과 실제 설비투자는 어떤 순서로 영향을 주고받을까요? (답: 2절)",
          "오른 가격을 이야기의 증거로 쓰지 않으려면 어떤 관측값을 미리 정해야 할까요? (답: 4절)",
        ]} />
      </section>
    </div>
  );
}
