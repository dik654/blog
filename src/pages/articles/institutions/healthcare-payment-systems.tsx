import { CitationBlock } from "@/components/ui/citation";
import NumericPath from "../world-systems/NumericPath";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** teach-system S→B→0…7. 공식 문서 확인 2026-10-04, 사례 수치는 가정. */
export default function HealthcarePaymentSystemsArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teaching-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">S · 진료실에서 낸 돈 밖에도 비용을 낸 사람이 있습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">병원 창구에서 낸 금액만 보면 진료에 들어간 돈의 일부를 놓칠 수 있습니다. 다른 가입자와 정부가 미리 낸 돈이 의료기관으로 돌아오기 때문입니다.</p>
          <p className="leading-8">이 글은 한 번의 진료를 따라 환자, 돈을 모은 곳, 병원 사이의 지급을 나눕니다. 병원에 돈을 주는 방식이 바뀌면 어떤 진료를 늘리거나 아끼려는 유인이 생기는지도 봅니다.</p>
        </div>
        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">환자 지출과 전체 지급을 나눌 질문이 마련됐습니다. 큰 경로를 확인합니다.</p>
      </section>
      <section id="black-box" data-teaching-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">B · 미리 모은 돈과 창구에서 낸 돈이 병원에서 합쳐집니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">사람들은 건강할 때부터 공동 재원에 돈을 냅니다. 아픈 사람이 치료받으면 지급 담당이 계약상 보장되는 진료를 확인해 병원에 보냅니다. 환자는 본인이 내야 할 부분을 따로 냅니다.</p>
          <p className="leading-8">병원은 받은 돈으로 의료진, 약품과 시설의 비용을 냅니다. 누가 진료를 결정하는지와 누가 대금을 주는지가 같지 않다는 점이 이 구조의 특징입니다.</p>
        </div>
        <NumericPath title="큰 흐름부터 읽기" steps={[{"label": "미리 모으기", "value": "1"}, {"label": "진료·지급 확인", "value": "2"}, {"label": "치료 제공하기", "value": "3"}]} />
        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">돈을 모으는 길과 진료를 제공하는 길을 나눴습니다. 한 진료의 숫자를 넣습니다.</p>
      </section>
      <section id="case" data-teaching-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">0 · 10만 원 진료에서 환자 2만 원과 다른 지급 8만 원이 합쳐집니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">한 번의 진료에 의료기관이 받는 총액을 10만 원, 환자가 내는 금액을 2만 원, 공동 재원에서 지급하는 금액을 8만 원으로 놓습니다(가정). 이는 특정 국가의 본인부담률이 아닙니다.</p>
          <p className="leading-8">병원의 관련 비용을 7만 원으로 두면 차액은 3만 원입니다(가정). 이 비용에 시설 유지와 공통 인건비를 모두 넣었는지에 따라 3만 원의 의미도 달라집니다.</p>
        </div>
        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">환자2·공동8·병원10의 관계가 잡혔습니다. 지급 결정의 안을 엽니다.</p>
      </section>
      <section id="picture" data-teaching-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">1 · 지급자는 보장 대상과 가격을 확인합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">병원이 진료 기록과 청구 내역을 보내면 지급자는 자격과 보장 대상, 정한 가격을 확인합니다. 환자는 이미 2만 원을 냈습니다. 지급자는 별도로 8만 원을 보냅니다. 청구가 조정되거나 거절되면 실제 총지급이 10만 원과 달라질 수 있습니다.</p>
        </div>
        <NumericPath title="(가정) 한 진료의 두 지급이 합쳐지는 경로" steps={[{"label": "환자 창구 지급", "value": "2만 원"}, {"label": "공동 재원 지급", "value": "+8만 원"}, {"label": "의료기관 총수입", "value": "10만 원"}]} />
        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">진료와 지급 사이에 확인 절차가 있음을 보았습니다. 미리 돈을 모으는 이유를 살핍니다.</p>
      </section>
      <section id="need" data-teaching-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2 · 아픈 시점의 소득만으로 치료비를 감당하기 어렵습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">아플 때는 지출이 늘면서 일을 못 해 소득도 줄 수 있습니다. 미리 돈을 모아 두면 현재 아픈 사람의 비용을 여러 사람이 나눕니다. 건강한 사람과 아픈 사람을 어떤 범위에서 함께 묶는지가 보호의 크기를 바꿉니다.</p>
          <p className="leading-8">모은 돈이 같아도 병원에 지급하는 기준이 다르면 진료량이 달라질 수 있습니다. 치료를 늘릴 때 수입도 늘어나는지, 정해진 수입 안에서 비용을 감당해야 하는지에 따라 유인이 달라집니다.</p>
        </div>
        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">재원의 준비와 지급 방식의 역할을 구별했습니다. 공식 이름으로 묶습니다.</p>
      </section>
      <section id="names" data-teaching-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3 · 재원 조달·위험 풀·구매라는 세 기능입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">보험료와 세금 등으로 돈을 모으는 일이 재원 조달입니다. 여러 사람의 돈을 함께 관리해 아픈 사람의 부담을 나누는 것이 위험 풀 형성입니다.</p>
          <p className="leading-8">의료기관에 어떤 서비스를 얼마에 지불할지 정하는 일이 구매입니다. 이 세 가지가 의료 재정의 세 기능이며, 한 기관이 함께 맡을 수도 여러 기관이 나눌 수도 있습니다.</p>
          <p className="leading-8">환자 본인부담은 창구에서 개인이 내는 몫입니다. 2만 원의 본인부담과 총지급 10만 원을 구별해야 제도 전체 비용을 셀 수 있습니다.</p>
        </div>
        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">세 기능과 환자 몫을 정의했습니다. 같은 진료가 두 번이면 어떻게 달라지는지 봅니다.</p>
      </section>
      <section id="mechanism" data-teaching-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4 · 건수로 주는 돈과 묶어서 주는 돈은 다른 선택을 만듭니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">같은 조건의 진료를 두 번 제공하고 각각 10만 원을 받으면 병원 수입은 20만 원입니다. 환자 몫은 합계 4만 원, 공동 재원 지급은 16만 원입니다(가정). 진료 한 건마다 지급하는 방식을 건별 지급이라고 부릅니다.</p>
          <p className="leading-8">반대로 치료 과정 전체에 총 10만 원을 주기로 정하면 두 번 진료해도 수입이 20만 원으로 늘지 않습니다(가정). 이를 묶음 지급이라고 합니다. 정해진 사람을 돌보는 기간에 따라 금액을 주는 인두제도 있으며 지급 단위가 다릅니다.</p>
          <p className="leading-8">건별 지급은 필요한 진료를 늘릴 수 있지만 과잉 진료 유인도 있습니다. 정액 성격의 지급은 비용을 아끼게 합니다. 그 과정에서 필요한 진료를 줄이거나 위험한 환자를 피할 유인이 생길 수 있습니다. 진료의 질과 환자 구성을 함께 평가해야 합니다.</p>
        </div>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">같은 서비스의 지급 단위가 행동 유인을 바꿨습니다. 위험을 나누는 원문 목적과 대조합니다.</p>
      </section>
      <section id="source" data-teaching-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5 · WHO의 위험 공유 목적을 8만 원에 적용합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">WHO는 미리 모은 재원으로 의료비 위험을 나누는 목적을 설명합니다. 사례의 8만 원은 병원에서 갑자기 생긴 공짜 돈이 아니라 여러 사람의 사전 재원에서 온 지급입니다.</p>
          <p className="leading-8">이 기능을 설명한다고 모든 나라가 하나의 기관을 써야 한다는 결론이 나오는 것은 아닙니다. 풀 사이를 어떻게 연결하고 누구를 보장하는지가 실제 제도 설계의 문제입니다.</p>
        </div>
        <SourceApplication source="WHO · Pooling revenues and reducing fragmentation" excerpt="The purpose of pooling is to spread financial risk across the population" application="총 10만 원에서 환자 2만 원을 제외한 8만 원은 공동 재원이 부담합니다. 조달한 보험료를 진료 총액에 한 번 더 더하지 않습니다." />
        <CitationBlock source="WHO · Pooling revenues and reducing fragmentation" citeKey={1} href="https://www.who.int/activities/pooling/pooling">의료 재정의 위험 공유 기능을 설명하는 WHO 원문.</CitationBlock>
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">공동 지급의 출처를 원문과 연결했습니다. 나라별로 어떤 지급표가 적용되는지 봅니다.</p>
      </section>
      <section id="comparison" data-teaching-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6 · 한국·잉글랜드·미국의 지급 규칙은 적용 범위부터 다릅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">한국 국민건강보험공단은 급여 항목을 안내합니다. 비용 부담도 구분해 설명합니다. 사례의 20%를 실제 진료에 일괄 적용할 수 없고 급여 여부와 진료 종류 등을 확인해야 합니다.</p>
          <p className="leading-8">4절의 지급 방식으로 보면 한국은 건별 지급이 근간입니다. 건강보험심사평가원 안내에 따르면 한국은 의료보험 도입 때부터 진료 행위의 사용량과 가격으로 진료비를 지불하는 행위별수가제(fee-for-service)를 채택했고, 이를 보완하려고 질병군별 포괄수가제(DRG)와 요양병원·보건기관 등의 정액수가제를 함께 씁니다.</p>
          <p className="leading-8">포괄수가제는 7개 질병군에 대해 2013년 7월부터 전국 모든 의료기관에 적용됐습니다. 사례의 10만 원이 검사·처치 항목별 가격을 더한 값이면 행위별수가제, 같은 질병군 입원 한 건에 미리 정한 금액이면 포괄수가제에 해당합니다. 1절의 &lsquo;지급자 확인&rsquo;도 한국에서는 심평원의 심사와 국민건강보험공단의 지급으로 나뉩니다(<a className="text-sky-700 underline dark:text-sky-300" href="https://www.hira.or.kr/dummy.do?pgmid=HIRAA020028000000">심평원 수가제도 안내</a>, 2026-10-09 확인).</p>
          <p className="leading-8">미국 CMS의 fee schedule은 Original Medicare의 해당 서비스 지급표입니다. 사례의 10만 원처럼 서비스를 얼마에 살지 정하는 층의 규칙이며 미국 전체 민간보험 가격표가 아닙니다.</p>
          <p className="leading-8">잉글랜드의 2026/27 NHS Payment Scheme은 적용 대상 서비스의 지급을 정합니다. 스코틀랜드 등 영국 전체의 동일 규칙도, NHS의 총재원 규모를 정하는 규칙도 아닙니다. 제도 비교는 2026-10-04 확인 기준입니다.</p>
        </div>
        <SourceApplication source="US CMS · Fee Schedules, General Information" excerpt="A fee schedule is a complete listing of fees used by Medicare to pay doctors or other providers/suppliers." application="사례의 총지급 10만 원에 대응하는 가격을 정하는 지급표입니다. 환자 2만 원과 지급자 8만 원의 분담은 별도 보장 규칙도 확인해야 합니다." />
        <CitationBlock source="US CMS · Fee Schedules, General Information" citeKey={2} href="https://www.cms.gov/medicare/payment/fee-schedules">미국 Original Medicare의 해당 서비스 지급표. 모든 보험에 같은 가격을 적용하지 않습니다.</CitationBlock>
        <CitationBlock source="국민건강보험공단 · 급여의 범위 및 비용부담" citeKey={3} href="https://www.nhis.or.kr/static/html/wbma/c/wbmac0103.html">한국 급여 범위와 비용부담의 공식 안내. 2026-10-04 확인.</CitationBlock>
        <CitationBlock source="NHS England · NHS Payment Scheme" citeKey={4} href="https://www.england.nhs.uk/pay-syst/nhs-payment-scheme/">잉글랜드 대상 서비스 지급 규칙이며 총 NHS 재원을 정하지 않음. 2026-10-04 확인.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">같은 세 기능 안에서도 적용 대상과 계약이 다릅니다. 낮은 비용을 좋은 결과로 읽을 조건을 봅니다.</p>
      </section>
      <section id="limits" data-teaching-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7 · 비용을 줄였을 때 대기와 건강 결과도 확인합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">환자 부담과 전체 의료비를 비교하려면 창구 지출 2만 원과 공동 지급 8만 원을 합쳐 10만 원으로 봅니다. 이미 모은 보험료를 같은 진료비에 또 더해서는 안 됩니다. 지급과 재원을 중복해 세기 때문입니다.</p>
          <p className="leading-8">총지급을 줄였어도 필요한 진료를 못 받거나 대기가 길어졌다면 비용 절감만으로 좋은 제도라고 할 수 없습니다. 반대로 같은 건강 결과를 더 적은 자원으로 얻었다면 효율이 좋아졌을 수 있습니다.</p>
          <p className="leading-8">국가 비교에서는 나이와 질병 구성, 미충족 의료, 치료 결과와 가계 부담을 함께 맞춥니다. 10만 원 사례는 지불 경로를 보여 주며 어떤 치료를 받아야 할지 판단하는 의료 지침은 아닙니다.</p>
        </div>
        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">총지급과 재원, 비용과 건강 결과의 경계를 확인했습니다. 지급 단위를 바꿔 예상해 봅니다.</p>
        <ReviewPrompts questions={["같은 진료 두 번에 건별로 10만 원씩 지급하면 환자와 공동 재원은 각각 얼마를 낼까요? (답: 4절)", "병원이 받은 10만 원에 이미 낸 보험료를 다시 더하면 무엇을 중복해서 세게 될까요? (답: 7절)"]} />
      </section>
    </div>
  );
}
