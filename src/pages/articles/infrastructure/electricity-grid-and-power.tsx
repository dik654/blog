import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** 전기는 발전소보다 전력망의 연결과 시간 제약을 함께 봐야 한다 — 숫자와 제도 예시는 2026-10-03 확인 기준. */
export default function ElectricityGridAndPowerArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">발전소가 충분해도 공장에 전기가 닿지 않을 수 있습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">한 지역 발전소가 100MWh를 만들 수 있어도 송전선이 붐비면 20MWh는 먼 공장에 보낼 수 없습니다. 공장은 다른 발전원을 더 비싸게 쓰거나 생산을 미룹니다. 전력은 생산량만큼 연결 위치와 필요한 시간이 중요합니다.</p>
          <p className="leading-7">새 반도체 공장이나 데이터센터는 전력망 접속과 변전 설비를 확인해야 합니다. 전력 가격이 낮다는 광고만으로 실제 입주 가능 시점이 정해지지는 않습니다.</p>
        </div>
        <FlowRail
          title="(가정) 발전 100MWh, 송전 혼잡으로 20MWh를 멀리 보내지 못함"
          steps={[
            { actor: "발전사업자", movement: "100MWh를 생산할 능력을 준비합니다.", receives: "판매 대금과 접속 권리" },
            { actor: "계통운영자·망사업자", movement: "선로 용량과 수급 균형을 운영합니다.", receives: "망 요금과 운영 책임" },
            { actor: "가정·공장", movement: "필요한 시간에 전기를 구매합니다.", receives: "사용 전력과 공급 안정성" },
          ]}
        />
        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">발전 능력 100과 먼 수요처에 닿는 80을 구별했습니다. 이제 망의 비용과 운영 책임을 나눕니다.</p>
      </section>
      <section id="mechanism" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">발전·망·운영·요금을 네 장부로 나눕니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">발전사업자는 연료·설비·자본 비용을 회수하려 합니다. 망사업자는 송배전 설비와 유지비를 부담하고 운영자는 주파수와 예비력을 맞춥니다. 소비자의 요금에는 이 비용들이 서로 다른 제도 아래 합쳐집니다.</p>
          <p className="leading-7">저장장치는 값이 낮거나 공급이 남는 시간에 충전해 부족한 시간에 방전할 수 있습니다. 그러나 충전 손실과 접속 제약이 있으므로 발전량 증가와 같은 효과라고 단정할 수 없습니다.</p>
        </div>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">저장장치까지 넣어도 송전과 접속의 제약이 남습니다. 국가별 규칙이 이 비용을 누구에게 보낼지 확인합니다.</p>
      </section>
      <section id="comparison" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">국가마다 가격 결정과 망 소유의 경계가 다릅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">IEA는 2026년 보고서에서 발전·수요·저장 설비의 접속 대기가 여러 지역의 병목이라고 설명합니다. 한국, 미국의 주별 전력시장, 유럽의 연결 시장은 망 접근과 소매 요금 규칙이 다릅니다.</p>
          <p className="leading-7">같은 산업단지 투자라도 접속 계약, 공급 가능 전력, 정전 위험, 요금 변동, 자가발전 허용 범위를 현지 규정으로 확인해야 합니다.</p>
        </div>
        <SourceApplication source="IEA Electricity 2026 · Grids" excerpt="Grids are emerging as a bottleneck for connecting supply, demand and storage" application="100MWh를 만들 능력이 있어도 선로가 20MWh를 못 보내면 먼 수요처에 공급 가능한 양은 80MWh입니다. 발전소 규모와 접속 가능량을 별도 숫자로 적어야 합니다." />
        <CitationBlock source="IEA Electricity 2026: Grids" citeKey={1} href="https://www.iea.org/reports/electricity-2026/grids">전력망 접속 대기와 혼잡, 투자·운영 대안을 설명하는 IEA 2026년 보고서입니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">IEA의 접속 병목은 모든 공장에 같은 요금을 뜻하지 않습니다. 마지막으로 가격과 공급 안정성을 함께 봅니다.</p>
      </section>
      <section id="limits" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">전기 요금만 내려도 투자가 늘어난다고 단정할 수 없습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">전력망 증설은 토지·인허가·변압기·선로 공사가 필요합니다. 오늘의 낮은 요금이 미래 접속 용량이나 안정성을 보장하지 않습니다.</p>
          <p className="leading-7">발전 단가 비교에서는 망·저장·예비력 비용과 실제 시간대별 공급 가치를 따로 놓아야 합니다.</p>
        </div>
        <ReviewPrompts questions={[
          "발전 능력 100MWh에서 송전 혼잡 때문에 20MWh를 못 보내면 새 공장은 어떤 비용을 다시 계산해야 할까요? (답: 2절)",
          "평균 전기요금이 낮아도 필요한 시간에 전기를 못 받는 경우를 어떻게 확인할까요? (답: 4절)",
        ]} />
      </section>
    </div>
  );
}
