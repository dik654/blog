import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** 국가 정책은 국제 자금의 제약을 지나 환율·금리·자산값에 닿는다 — 숫자와 제도 예시는 2026-10-03 확인 기준. */
export default function GlobalCapitalAndPolicyArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">달러 빚은 원화 환율이 오르면 원화 장부에서 커집니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">1억 달러를 빌린 회사가 원화로 돈을 번다고 합시다. 환율이 달러당 1천 원에서 1천200원이 되면 원화로 갚아야 할 원금 환산액은 1천억 원에서 1천200억 원으로 늘어납니다. 사업 매출이 그대로여도 재무 제약은 강해질 수 있습니다.</p>
          <p className="leading-7">다른 나라의 금리 변화가 왜 이 회사에 영향을 주는지는 자금의 통화와 만기를 따라가면 보입니다. 은행이 달러 조달을 줄이면 대출 만기 연장과 담보 요구가 바뀌고, 그다음 투자·고용·자산 매도에 영향이 갑니다.</p>
        </div>
        <FlowRail
          title="(가정) 달러 부채 1억 달러, 환율 1달러=1천 원에서 1천200원"
          steps={[
            { actor: "정부·중앙은행", movement: "세금·지출·금리와 외환 정책을 정합니다.", receives: "공공 목표의 실행" },
            { actor: "기업·은행", movement: "달러 부채와 현지통화 수입을 관리합니다.", receives: "사업 자금" },
            { actor: "해외 투자자", movement: "금리·환율·위험을 보고 자산을 사고팝니다.", receives: "해당 통화 청구권" },
          ]}
        />
        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">달러 부채 1억 달러가 환율에 따라 다른 원화 금액이 됩니다. 이 제약이 대출과 자산 가격에 어떻게 전해지는지 봅니다.</p>
      </section>
      <section id="mechanism" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">결정권에서 가격까지 다섯 고리를 그립니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">정부는 지출·세금·규제를, 중앙은행은 통화 정책과 유동성 수단을, 외국 투자자는 자금 배분을 결정합니다. 정책 발표가 은행 조달 금리와 기업 차입 비용을 바꾸는지, 실제 대출량이 변하는지, 환율과 자산 거래가 따라오는지 차례대로 확인합니다.</p>
          <p className="leading-7">금리 인상은 환율을 항상 한 방향으로 움직이지 않습니다. 성장 전망·위험 회피·자본 통제·정책 신뢰와 기존 포지션이 함께 작동합니다. 통화가 다른 부채가 많은 나라와 자국 통화 장기채가 많은 나라의 민감도도 다릅니다.</p>
        </div>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">환율 1천200원에서 상환 부담은 200억 원 더 큽니다. 국제 자금 통계가 어느 계약을 집계하는지 확인합니다.</p>
      </section>
      <section id="comparison" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">전 세계에 하나의 자금 흐름이 있어도 국가는 같지 않습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">BIS의 글로벌 유동성 지표는 비거주자에게 공급된 달러·유로·엔화 표시 은행 대출과 국제채를 추적합니다. IMF 연구는 같은 글로벌 금융 충격에 대한 각 나라의 민감도가 다르며 정책 수단도 영향을 준다고 보고합니다. 연구 결과를 모든 시기·모든 나라의 법칙으로 읽지는 않습니다.</p>
          <p className="leading-7">미국, 유로 지역, 일본의 통화는 국제 차입에서 큰 역할을 하지만 한국·인도·브라질·남아공 등은 자국의 부채 통화, 외환 완충, 금융 개방 정도가 각각 다릅니다. 어느 나라든 중앙은행 통계, 재무부 예산, 국제수지와 만기별 외채를 대조해야 합니다.</p>
        </div>
        <SourceApplication source="BIS · Global liquidity indicators overview" excerpt="The BIS GLIs track foreign currency credit to non-bank borrowers" application="외화 부채 1억 달러는 환율 1천 원에서 1천억 원, 1천200원에서 1천200억 원입니다. BIS 지표는 이런 외화 신용의 국제적 크기를 볼 출발점이며 개별 기업의 헤지 여부는 알려 주지 않습니다." />
        <CitationBlock source="BIS Global Liquidity Indicators" citeKey={1} href="https://data.bis.org/topics/GLI?m=213">달러·유로·엔화 표시 비거주자 신용의 범위와 정의를 제공합니다.</CitationBlock>
        <CitationBlock source="IMF Facing the Global Financial Cycle" citeKey={2} href="https://www.imf.org/en/publications/wp/issues/2021/02/12/facing-the-global-financial-cycle-what-role-for-policy-50053">글로벌 충격과 국가별 민감도의 차이를 연구한 IMF 작업 논문입니다. IMF 공식 정책 결론으로 확대하지 않습니다.</CitationBlock>
        <CitationBlock source="IMF Balance of Payments Data" citeKey={3} href="https://data.imf.org/Datasets/BOP">국제수지의 상품·소득·금융 거래를 확인할 공식 통계 경로입니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">BIS 지표는 외화 신용의 범위를 보여 줍니다. 한 번의 정책 발표만으로 가격 반응의 원인을 정할 수 있는지는 별개입니다.</p>
      </section>
      <section id="limits" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">환율 변동 뒤 주가가 움직였다는 순서만으로 정책의 원인이라 말할 수 없습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">동시에 원자재 가격과 기업 실적이 변했을 수 있습니다. 발표 전 시장이 이미 예상했다면 발표 당일 가격 반응은 작을 수도 있습니다. 가격은 현금흐름 전망과 할인율, 투자자의 자금 제약이 함께 정합니다.</p>
          <p className="leading-7">인과를 따질 때는 결정 시각, 예상과 실제의 차이, 관련 통화·채권·주식·대출량의 동시 변화, 반례 국가를 확인해야 합니다.</p>
        </div>
        <ReviewPrompts questions={[
          "외화 부채 1억 달러가 있는데 환율이 1천 원에서 1천200원으로 오르면 현지통화 상환액은 어떻게 바뀔까요? (답: 2절)",
          "환율 발표 뒤 주가가 내려도 정책만을 원인이라고 단정할 수 없는 이유는 무엇일까요? (답: 4절)",
        ]} />
      </section>
    </div>
  );
}
