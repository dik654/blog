import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** 의료비는 환자·보험자·정부·병원 사이를 돌아서 움직인다 — 숫자와 제도 예시는 2026-10-03 확인 기준. */
export default function HealthcarePaymentSystemsArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">창구에서 2만 원을 냈어도 진료비가 2만 원인 것은 아닙니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">한 진료에 의료기관이 10만 원을 받고 환자가 2만 원, 보험자가 8만 원을 낸다고 합시다. 환자의 가격 체감과 사회가 조달한 비용은 다릅니다. 보험자가 낸 8만 원은 가입자의 보험료나 세금에서 왔습니다.</p>
          <p className="leading-7">병원이 받는 10만 원도 순이익은 아닙니다. 의사·간호사 임금, 약품·장비, 건물, 행정 비용을 내야 합니다. 누가 돈을 내는지와 누가 진료를 결정하는지는 다른 질문입니다.</p>
        </div>
        <FlowRail
          title="(가정) 진료 총지급 10만 원, 환자 2만 원, 보험자 8만 원"
          steps={[
            { actor: "환자", movement: "진료 후 2만 원을 부담합니다.", receives: "의료 서비스와 보장" },
            { actor: "보험자·정부", movement: "모은 보험료·세금에서 8만 원을 지급합니다.", receives: "위험 공동 부담" },
            { actor: "의료기관", movement: "진료를 제공하고 10만 원을 받습니다.", receives: "운영비 지급 뒤 남는 돈" },
          ]}
        />
        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">환자가 2만 원을 냈어도 병원은 10만 원을 받는다는 계산을 했습니다. 8만 원의 재원을 따라갑니다.</p>
      </section>
      <section id="mechanism" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">재원 조달·위험 풀·구매 가격표를 셋으로 나눕니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">첫째, 보험료·세금·개인 지출 가운데 어디서 돈을 모으는가. 둘째, 건강한 사람과 아픈 사람, 젊은 사람과 노인의 위험을 한 풀에서 나누는가. 셋째, 보험자나 정부가 의료기관에 건별·묶음·인두제 등 어떤 방식으로 지급하는가를 봅니다.</p>
          <p className="leading-7">건별 지급은 진료량을 늘릴 유인이 있고 정액 지급은 진료량을 아낄 유인이 생길 수 있습니다. 품질과 접근성 지표를 함께 봐야 어느 쪽이 좋은지 판단할 수 있습니다.</p>
        </div>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">재원 조달과 위험 풀, 병원 지급을 분리했습니다. 나라마다 어떤 계약에서 차이가 나는지 봅니다.</p>
      </section>
      <section id="comparison" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">한국·영국·미국도 같은 세 질문으로 비교합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">한국 국민건강보험은 환자 본인부담과 보험자의 급여 지급을 나누어 설명합니다. 영국 NHS England는 2026/27 NHS Payment Scheme으로 대상 의료기관의 지급 규칙을 제시하며 이것이 NHS 총예산을 정하는 것은 아니라고 밝힙니다. 미국 CMS의 Original Medicare는 의사 서비스 등에서 fee schedule을 사용합니다.</p>
          <p className="leading-7">한 나라 안에도 여러 제도가 공존합니다. 미국의 민간보험과 Medicare, 영국의 1차 진료와 병원, 한국의 급여·비급여를 하나로 묶지 말고 환자·보험자·공급자별 계약을 확인해야 합니다.</p>
        </div>
        <SourceApplication source="WHO · Pooling revenues and reducing fragmentation" excerpt="The purpose of pooling is to spread financial risk across the population" application="진료비 10만 원 중 환자 창구 부담 2만 원과 보험자 지급 8만 원을 분리합니다. 보험자 돈은 여러 사람이 미리 낸 재원에서 왔고 병원 수입 전체가 환자 개인의 지출은 아닙니다." />
        <CitationBlock source="WHO Pooling revenues and reducing fragmentation" citeKey={1} href="https://www.who.int/activities/pooling">재원 조달·pooling·구매의 기능과 위험 공유를 설명합니다.</CitationBlock>
        <CitationBlock source="NHS England 2026/27 Payment Scheme" citeKey={2} href="https://www.england.nhs.uk/pay-syst/nhs-payment-scheme/">2026년 4월 시행된 대상 의료기관 지급 규칙. NHS 전체 예산과 구분합니다.</CitationBlock>
        <CitationBlock source="US CMS Fee Schedules" citeKey={3} href="https://www.cms.gov/medicare/payment/fee-schedules">미국 Original Medicare 일부 의료 서비스의 건별 지급표를 설명합니다.</CitationBlock>
        <CitationBlock source="국민건강보험공단 건강보험 제도" citeKey={4} href="https://www.nhis.or.kr/static/html/wbma/c/wbmac0103.html">한국의 환자 본인부담과 보험자 급여 지불 구조를 확인합니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">WHO의 위험 공유 목적과 세 나라의 지급 방식은 같은 층의 정보가 아닙니다. 비용과 건강 결과의 관계를 따로 봅니다.</p>
      </section>
      <section id="limits" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">의료 지출이 늘어도 건강 결과가 자동으로 좋아지지는 않습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">고령화와 신기술, 가격·이용량, 행정 비용이 지출을 늘릴 수 있습니다. 반대로 진료를 제한하면 지출은 줄어도 대기 시간과 건강 손실이 커질 수 있습니다.</p>
          <p className="leading-7">의료제도를 비교할 때는 1인당 비용과 함께 미충족 의료, 대기 시간, 치료 결과, 가계의 파산 위험을 봅니다. 숫자의 정의와 연령 구조를 맞추지 않은 국가 순위는 쉽게 오해를 만듭니다.</p>
        </div>
        <ReviewPrompts questions={[
          "환자가 2만 원을 냈고 의료기관이 10만 원을 받았다면 나머지 8만 원은 어느 장부를 거쳤을까요? (답: 2절)",
          "의료 지출이 낮아진 나라가 건강도 좋아졌다고 판단하려면 어떤 결과를 더 봐야 할까요? (답: 4절)",
        ]} />
      </section>
    </div>
  );
}
