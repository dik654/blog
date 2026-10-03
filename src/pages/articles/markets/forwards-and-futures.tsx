import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** 선물은 미래 가격을 고정하면서 반대편에 같은 크기의 위험을 건넨다 — 숫자와 제도 예시는 2026-10-03 확인 기준. */
export default function ForwardsAndFuturesArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">미래 밀값이 오르면 누가 좋아하고 누가 아쉬운가</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">제빵업자가 3개월 뒤 밀 100톤을 톤당 30만 원에 사기로 하고 농가가 같은 가격에 팔기로 했다고 합시다. 당시 현물값이 35만 원이면 제빵업자는 시장에서 사는 것보다 500만 원 유리하고 농가는 그만큼 높은 가격 기회를 포기합니다.</p>
          <p className="leading-7">현물값이 25만 원이면 방향이 반대입니다. 두 사람은 서로의 불확실성을 없앴다기보다 가격이 움직였을 때의 몫을 바꿨습니다. 농가의 수확량 위험이나 제빵업자의 판매 위험은 여전히 남습니다.</p>
        </div>
        <FlowRail
          title="(가정) 밀 100톤을 톤당 30만 원에 3개월 뒤 사기로 약속"
          steps={[
            { actor: "제빵업자", movement: "미래 원료 구매 가격을 3천만 원으로 고정합니다.", receives: "가격 상승 위험 감소" },
            { actor: "농가", movement: "미래 판매 가격을 3천만 원으로 고정합니다.", receives: "가격 하락 위험 감소" },
            { actor: "청산기관", movement: "거래소 선물의 증거금과 일별 손익을 관리합니다.", receives: "계약 이행 보장 체계" },
          ]}
        />
        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">밀 100톤의 미래 가격을 고정한 사람과 반대편의 위험을 그렸습니다. 만기 전 현금 요구가 다른 계약을 구별합니다.</p>
      </section>
      <section id="mechanism" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">선도와 선물의 차이는 계약을 어디서 어떻게 정산하느냐입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">선도는 보통 당사자가 수량·품질·만기를 맞춤형으로 약속합니다. 선물은 거래소가 계약 규격을 표준화하고 청산기관이 중간에 서며 증거금을 받고 손익을 일별 정산합니다. 둘 다 기초자산을 처음부터 소유하는 거래는 아닙니다.</p>
          <p className="leading-7">계약 가격은 미래 현물값의 확정 예언이 아닙니다. 현물 보유 비용, 금리, 수익이나 보관 비용, 수급과 담보 제약이 가격 관계를 만듭니다. 환율 선도에서는 두 통화의 금리와 자금조달 제약도 중요합니다.</p>
        </div>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">톤당 1만 원 변동이 100만 원의 노출로 바뀝니다. 거래소의 증거금 규칙이 이 현금을 어떻게 당기는지 살핍니다.</p>
      </section>
      <section id="comparison" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">헤지와 투기는 같은 계약을 다른 기존 위험에 붙입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">농가는 이미 미래에 팔 밀을 가질 예정이라 매도 선물로 가격 하락 위험을 줄일 수 있습니다. 밀 사업이 없는 사람이 같은 선물을 팔면 새로운 가격 위험을 떠안습니다. 계약 자체를 헤지 또는 투기라고 부를 수 없는 이유입니다.</p>
          <p className="leading-7">미국 CME의 선물 교육은 증거금이 자산의 계약금이 아니라 이행 담보이며 일별 가격 변동에 따라 현금이 오간다고 설명합니다. BIS는 장외 파생상품의 명목원금과 시장가치를 분리해 집계합니다.</p>
        </div>
        <SourceApplication source="CME Group · Understanding Margin Changes" excerpt="We mark positions to market twice a day to prevent losses from accumulating over time" application="밀 100톤을 톤당 30만 원에 사기로 한 선물의 가격이 톤당 1만 원 움직이면 중간 평가 차액은 100만 원입니다. 장외 선도와 장내 선물의 중간 현금 요구를 구분합니다." />
        <CitationBlock source="CME Understanding Margin Changes" citeKey={1} href="https://www.cmegroup.com/education/articles-and-reports/understanding-margin-changes">선물 증거금과 일별 평가·유지 요건의 공식 설명입니다.</CitationBlock>
        <CitationBlock source="CME Money Calculations for Futures and Options" citeKey={2} href="https://www.cmegroup.com/education/articles-and-reports/money-calculations-for-futures-and-options">선물 손익이 변동증거금으로 현금 정산되는 계산 설명입니다.</CitationBlock>
        <CitationBlock source="BIS OTC Derivatives Data" citeKey={3} href="https://data.bis.org/topics/OTC_DER">명목원금과 시가·신용노출을 구분하는 국제 통계입니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">CME의 중간 평가 문구를 적용했습니다. 가격을 맞게 예측해도 자금이 모자랄 수 있는 경계를 남깁니다.</p>
      </section>
      <section id="limits" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">최종 가격을 맞혀도 중간 증거금을 못 내면 계약을 유지할 수 없습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">농가가 만기에 밀을 팔아 손실을 상쇄할 수 있어도 그 전에 선물 가격이 급등하면 증거금을 추가해야 할 수 있습니다. 현물 대금은 나중에 들어와도 선물 손실 현금은 오늘 필요합니다.</p>
          <p className="leading-7">기초 품질·지역·만기가 다르면 실제 현물 가격과 선물 가격의 차이가 남습니다. 이 베이시스 위험과 담보 유동성을 헤지 효과와 함께 계산해야 합니다.</p>
        </div>
        <ReviewPrompts questions={[
          "미래 가격을 100에 고정한 계약에서 만기 현물가격이 120이면 누가 20을 포기하거나 받나요? (답: 2절)",
          "만기 최종 손익이 좋더라도 그 전에 거래를 접어야 할 수 있는 이유는 무엇인가요? (답: 4절)",
        ]} />
      </section>
    </div>
  );
}
