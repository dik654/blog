import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** 수도 요금은 물값과 배관을 계속 유지할 돈을 함께 묻는다 — 숫자와 제도 예시는 2026-10-03 확인 기준. */
export default function WaterUtilityAndTariffsArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">물을 싸게 공급해도 낡은 관은 언젠가 바꿔야 합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">한 지역의 물 공급 비용을 정수·운영 60, 배관 교체 30, 취약 가구 지원 10으로 놓아 봅시다. 당장 운영비 60만 요금으로 받으면 올해 장부는 버틸 수 있어도 배관을 바꿀 돈은 부족합니다. 누수와 단수가 늘면 나중에 더 큰 비용을 치를 수 있습니다.</p>
          <p className="leading-7">수도 요금은 물 분자에 붙인 가격만이 아닙니다. 물을 안전하게 만들고 집 앞까지 보내고 사용 뒤 처리하는 설비를 지속시키는 약속입니다.</p>
        </div>
        <FlowRail
          title="(가정) 정수·운영 60, 배관 교체 30, 저소득 지원 10"
          steps={[
            { actor: "수도사업자", movement: "정수·운영 60과 배관 교체 30을 준비합니다.", receives: "요금 수입과 유지 책임" },
            { actor: "가구·기업", movement: "사용량에 따라 요금을 냅니다.", receives: "안전한 급수와 하수 처리" },
            { actor: "정부·지원 대상", movement: "지원 10의 재원을 세금이나 요금에서 정합니다.", receives: "접근성과 재정 부담" },
          ]}
        />
        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">운영 60 외에 배관 30과 지원 10이 남는다는 점을 적었습니다. 요금과 세금의 분담을 정합니다.</p>
      </section>
      <section id="mechanism" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">사용량 요금과 고정 설비비의 부담을 분리합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">가구가 물을 덜 쓰면 처리 비용 일부는 줄지만 묻혀 있는 배관의 이자와 수리비는 거의 그대로 남습니다. 사용량만으로 요금을 매기면 절수에 성공할수록 운영자의 고정비 회수가 어려워질 수 있습니다.</p>
          <p className="leading-7">요금 인상 대신 세금으로 보조할 수도 있습니다. 그때는 누가 세금을 내고 누구에게 물 서비스가 닿는지, 미납과 단수 규칙은 무엇인지 같이 확인해야 합니다.</p>
        </div>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">사용량이 줄어도 묻힌 배관의 비용이 남습니다. 도시 밀도와 기후가 요금 구조에 미치는 차이를 봅니다.</p>
      </section>
      <section id="comparison" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">기후와 도시 밀도에 따라 같은 요금표도 효과가 다릅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">세계은행의 수도 요금 연구는 비용 회수와 부담 가능성을 함께 다룹니다. 인구가 흩어진 지역의 배관 길이, 가뭄 지역의 취수 비용, 비공식 주거지의 접속 권리가 서로 다릅니다.</p>
          <p className="leading-7">국가 비교에서는 공급 시간, 수질, 누수율, 하수 처리, 가구 소득 대비 요금과 공공 보조금을 같은 시점에 놓아야 합니다.</p>
        </div>
        <SourceApplication source="World Bank · Troubled Tariffs, How Should Costs Be (re)Covered?" excerpt="the difference between revenues collected through tariffs and full economic cost recovery constitutes an economic shortfall" application="요금으로 운영비 60만 받으면서 교체비 30과 지원 10을 마련하지 못하면 필요한 100과의 간격은 40입니다. 그 간격을 세금·이전금으로 메울지 결정해야 합니다." />
        <CitationBlock source="World Bank Troubled Tariffs" citeKey={1} href="https://documents1.worldbank.org/curated/en/568291635871410812/pdf/Troubled-Tariffs-Revisiting-Water-Pricing-for-Affordable-and-Sustainable-Water-Services.pdf">수도 요금의 비용 회수와 부담 가능성을 함께 검토한 세계은행 연구입니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">세계은행의 비용 회수 문구에 40의 재원 공백을 넣었습니다. 낮은 요금이 누구에게 닿는지까지 확인합니다.</p>
      </section>
      <section id="limits" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">낮은 요금도 높은 요금도 그 자체로 공정하다고 말할 수 없습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">낮은 요금의 혜택이 이미 배관에 연결된 부유층에 집중될 수 있습니다. 높은 요금은 저소득층의 필수 사용을 줄일 위험이 있습니다.</p>
          <p className="leading-7">지원은 기본 사용량 할인이나 현금 보조, 연결비 지원처럼 설계할 수 있습니다. 어떤 방식이 적절한지는 누가 서비스 밖에 있는지 확인한 뒤 판단합니다.</p>
        </div>
        <ReviewPrompts questions={[
          "수도 운영비 60만 요금으로 회수하고 배관 교체비 30을 미루면 어떤 일이 쌓일까요? (답: 2절)",
          "요금을 낮췄는데도 혜택을 못 받는 가구는 어떤 가구일까요? (답: 4절)",
        ]} />
      </section>
    </div>
  );
}
